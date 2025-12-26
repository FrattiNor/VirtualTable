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
	const { columns } = props;
	const { sizeCacheMap } = tableState;
	const rowSelectionColum = props.rowSelectionProps?.rowSelectionColum;
	const rowDraggableColum = props.rowDraggableProps?.rowDraggableColum;
	const { visibleConf, sortConf, widthConf, fixedConf, flexGrowConf } = props.columnConf ?? {};

	const columnsCore = useMemo(() => {
		let index = 0;
		const keyIndexMap = new Map<string, number>();

		const getColumnsCore = (c: TableCoreColumns<T>, opt?: { parents: Array<TableCoreColumnGroup<T>> }) => {
			const parents = opt?.parents ?? [];
			const splitColumnsArrInner: Array<Array<TableCoreColumn<T> | TableCoreColumnGroup<T>>> = [];
			c.forEach((column) => {
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

		// 增加行拖拽列
		if (rowDraggableColum) {
			columnsCore.unshift([rowDraggableColum]);
		}

		return columnsCore;
	}, [rowSelectionColum, rowDraggableColum, columns, widthConf, visibleConf, sortConf, fixedConf, flexGrowConf]);

	// ======================================== part2 ========================================
	const colHandleRes = useMemo(() => {
		// 存在onCellSpan
		let existOnCellSpan = false;
		// col的key的合集，用于判断一些Memo
		let columnKeys = '';
		// gridTemplateColumns
		let gridTemplateColumns = '';
		// headForceRender
		const colHeadForceRenderMap = new Map<string, true>();
		// bodyForceRender
		const colBodyForceRenderMap = new Map<string, true>();
		// col的key转index和index转key
		const colKey2Index = new Map<string, number>();
		const colIndex2Key = new Map<number, string>();
		// 最终columns
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
		let totalSize = 0;
		let leftCalcSize = 0;
		let leftPingedSize = leftCalcSize;
		let index = 0;
		let deepLevel = 0;

		columnsCore.forEach((splitColumns) => {
			const leafColumn = getLeafColumn(splitColumns);
			const sizeCache = sizeCacheMap.get(leafColumn.key);
			// col存在测量的size
			if (typeof sizeCache === 'number') {
				splitColumnsArr.push(splitColumns);
				// haveOnCellSpan
				if (typeof leafColumn.onCellSpan === 'function') existOnCellSpan = true;
				// 计算deepLevel【col的group层数】
				const colLevel = splitColumns.length - 1;
				if (colLevel > deepLevel) deepLevel = colLevel;
				// 计算totalSize
				totalSize += sizeCache;
				// 计算columnKeys
				columnKeys += `_${leafColumn.key}_`;
				// 计算gridTemplateColumns
				gridTemplateColumns += gridTemplateColumns === '' ? `${sizeCache}px` : ` ${sizeCache}px`;
				// 计算colHeadForceRenderObj
				if (leafColumn.colHeadForceRender === true) {
					colHeadForceRenderMap.set(leafColumn.key, true);
				}
				// 计算colBodyForceRenderObj
				if (leafColumn.colBodyForceRender === true) {
					colBodyForceRenderMap.set(leafColumn.key, true);
				}
				// 计算fixedLeftMap
				if (leafColumn.fixed === 'left') {
					fixedLeftMap.set(leafColumn.key, {
						index,
						size: sizeCache,
						key: leafColumn.key,
						stickySize: leftCalcSize,
						pingedSize: leftPingedSize,
					});
					leftCalcSize += sizeCache;
				} else {
					leftPingedSize += sizeCache;
				}
				// 计算fixedRightArr
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
				// 计算colKey2Index和colIndex2Key
				colKey2Index.set(leafColumn.key, index);
				colIndex2Key.set(index, leafColumn.key);
				// 计算index变化
				index++;
			}
		});
		// 计算fixedRightMap
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
			existOnCellSpan,
			colKey2Index, // columns对应的key-index
			colIndex2Key, // columns对应的index-key
			columnKeys, // 渲染的columns的key组合string，用于判断某些地方的Memo

			fixedLeftMap, // 左固定的map
			fixedRightMap, // 右固定的map
			splitColumnsArr, // 渲染的columns
			gridTemplateColumns, // columns的grid的宽度css
			colBodyForceRenderMap, // colBody强制渲染
			colHeadForceRenderMap, // colHead强制渲染
		};
	}, [columnsCore, sizeCacheMap]);
	// ======================================== part2 ========================================

	return { columnsCore, ...colHandleRes };
};

export default useTableColumns;
