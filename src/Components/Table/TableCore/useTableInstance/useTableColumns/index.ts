import { useMemo } from 'react';

import { getLeafColumn } from '../../TableUtils';

import type { TableCoreColumn, TableCoreColumnGroup, TableCoreColumns } from '../../TableTypes/typeColumn';
import type { TableCoreProps } from '../../TableTypes/typeProps';
import type useTableState from '../useTableState';

type Props<T> = {
	props: TableCoreProps<T>;
	tableState: ReturnType<typeof useTableState>;
};

const useTableColumns = <T>({ props, tableState }: Props<T>) => {
	const { sizeCacheMap } = tableState;
	const { columns, rowSelectionColum } = props;
	const { visibleConf, sortConf, widthConf, fixedConf, flexGrowConf } = props.columnConf ?? {};

	const columnsCore = useMemo(() => {
		// 检测重复的columnKey
		const colKeysMap = new Map<string, number>();
		const checkSameKey = (key: string) => {
			if (colKeysMap.get(key) === 1) console.error(`same column key: ${key}`);
			colKeysMap.set(key, (colKeysMap.get(key) ?? 0) + 1);
		};

		let index = 0;
		const keyIndexMap = new Map<string, number>();

		const getColumnsCore = (c: TableCoreColumns<T>, opt?: { parents: Array<TableCoreColumnGroup<T>> }) => {
			const parents = opt?.parents ?? [];
			const splitColumnsArrInner: Array<Array<TableCoreColumn<T> | TableCoreColumnGroup<T>>> = [];
			c.forEach((column) => {
				checkSameKey(column.key);
				// isGroup
				if (Array.isArray(column.children)) {
					if (column.children.length > 0) {
						const current = { ...(column as TableCoreColumnGroup<T>) };
						splitColumnsArrInner.push(...getColumnsCore(column.children, { parents: [current, ...parents] }));
					}
				}
				// isColumn
				// 判断visible & 覆盖width
				else if (visibleConf?.[column.key] ?? true) {
					const current: TableCoreColumn<T> = {
						...(column as TableCoreColumn<T>),
						fixed: fixedConf?.[column.key] ?? column.fixed,
						width: widthConf?.[column.key] ?? column.width,
						flexGrow: flexGrowConf?.[column.key] ?? column.flexGrow,
					};
					splitColumnsArrInner.push([current, ...parents]);
					keyIndexMap.set(column.key, index);
					index++;
				}
			});
			return splitColumnsArrInner;
		};

		// 获取columnsCore
		let columnsCore = getColumnsCore(columns);

		// 增加判断order
		if (sortConf) {
			columnsCore = columnsCore.sort((a, b) => {
				const aIndex = sortConf?.[a[0].key] ?? keyIndexMap.get(a[0].key) ?? Infinity;
				const bIndex = sortConf?.[b[0].key] ?? keyIndexMap.get(b[0].key) ?? Infinity;
				return aIndex - bIndex;
			});
		}

		// 增加行选择列
		if (rowSelectionColum) {
			columnsCore.unshift([rowSelectionColum]);
		}

		return columnsCore;
	}, [rowSelectionColum, columns, widthConf, visibleConf, sortConf, fixedConf, flexGrowConf]);

	// ======================================== part2 ========================================
	const colHandleRes = useMemo(() => {
		//
		let columnKeys = '';
		// gridTemplateColumns
		let gridTemplateColumns = '';
		//
		const colHeadForceRenderObj: Record<string, true> = {};
		//
		const colBodyForceRenderObj: Record<string, true> = {};
		//
		const colKey2Index = new Map<string, number>();
		const colIndex2Key = new Map<number, string>();
		//
		const splitColumnsArr: Array<Array<TableCoreColumnGroup<T> | TableCoreColumn<T>>> = [];
		// index，当前column所在index
		// size，当前column的宽度
		// stickySize，sticky时left，right的数值
		// pingedSize，参与scroll计算pinged使用的size
		// leftTotalSize，作为中转的参数，对外无用
		type FixedLeftItem = { key: string; index: number; size: number; stickySize: number; pingedSize: number };
		type FixedRightItem = { key: string; index: number; size: number; stickySize: number; pingedSize: number; leftTotalSize: number };
		const fixedRightArr: FixedRightItem[] = [];
		const fixedLeftMap = new Map<string, FixedLeftItem>();
		const fixedRightMap = new Map<string, FixedRightItem>();
		//
		let totalSize = 0;
		let leftCalcSize = 0;
		let leftPingedSize = leftCalcSize;
		//
		let index = 0;
		let deepLevel = 0;
		columnsCore.forEach((splitColumns) => {
			const leafColumn = getLeafColumn(splitColumns);
			const sizeCache = sizeCacheMap.get(leafColumn.key);
			if (typeof sizeCache === 'number') {
				splitColumnsArr.push(splitColumns);
				const colLevel = splitColumns.length - 1;
				if (colLevel > deepLevel) deepLevel = colLevel;

				totalSize += sizeCache;
				columnKeys += `_${leafColumn.key}_`;
				gridTemplateColumns += gridTemplateColumns === '' ? `${sizeCache}px` : ` ${sizeCache}px`;
				if (leafColumn.colHeadForceRender === true || leafColumn.fixed === 'left' || leafColumn.fixed === 'right') {
					colHeadForceRenderObj[leafColumn.key] = true;
				}
				if (leafColumn.colBodyForceRender === true || leafColumn.fixed === 'left' || leafColumn.fixed === 'right') {
					colBodyForceRenderObj[leafColumn.key] = true;
				}

				if (leafColumn.fixed === 'left') {
					fixedLeftMap.set(leafColumn.key, {
						index,
						key: leafColumn.key,
						size: sizeCache,
						stickySize: leftCalcSize,
						pingedSize: leftPingedSize,
					});
					leftCalcSize += sizeCache;
				} else {
					leftPingedSize += sizeCache;
				}

				if (leafColumn.fixed === 'right') {
					// stickySize, pingedSize 占位，避免ts报错
					fixedRightArr.unshift({
						index,
						stickySize: 0,
						pingedSize: 0,
						size: sizeCache,
						key: leafColumn.key,
						leftTotalSize: totalSize,
					});
				}

				colKey2Index.set(leafColumn.key, index);
				colIndex2Key.set(index, leafColumn.key);
				index++;
			}
		});

		let rightCalcSize = 0;
		fixedRightArr.forEach(({ key, size, leftTotalSize }, i) => {
			const stickySize = rightCalcSize;
			const pingedSize = totalSize - leftTotalSize - rightCalcSize;
			fixedRightArr[i].stickySize = stickySize;
			fixedRightArr[i].pingedSize = pingedSize;
			fixedRightMap.set(key, fixedRightArr[i]);
			rightCalcSize += size;
		});

		return {
			deepLevel,
			colKey2Index, // columns对应的key-index
			colIndex2Key, // columns对应的index-key
			columnKeys, // 渲染的columns的key组合string，用于判断某些地方的Memo

			fixedLeftMap, // 左固定的map
			fixedRightMap, // 右固定的map
			splitColumnsArr, // 渲染的columns
			gridTemplateColumns, // columns的grid的宽度css
			colBodyForceRenderObj, // colBody强制渲染
			colHeadForceRenderObj, // colHead强制渲染
		};
	}, [columnsCore, sizeCacheMap]);
	// ======================================== part2 ========================================

	return { columnsCore, ...colHandleRes };
};

export default useTableColumns;
