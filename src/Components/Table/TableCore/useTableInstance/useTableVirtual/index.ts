import { useCallback } from 'react';

import useHTableVirtual from './useHTableVirtual';
import useVTableVirtual from './useVTableVirtual';
import useRefValue from '../../TableHooks/useRefValue';
import { getLeafColumn, getRowKey } from '../../TableUtils';
import { defaultColWidth } from '../../TableUtils/configValues';

import type useTableColumns from '../useTableColumns';
import type useTableDomRef from '../useTableDomRef';
import type useTableInnerProps from '../useTableInnerProps';
import type useTableState from '../useTableState';

type Props<T> = {
	tableState: ReturnType<typeof useTableState>;
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableColumns: ReturnType<typeof useTableColumns<T>>;
	tableInnerProps: ReturnType<typeof useTableInnerProps<T>>;
};

const useTableVirtual = <T>({ tableColumns, tableState, tableInnerProps, tableDomRef }: Props<T>) => {
	const { sizeCacheMap } = tableState;
	const { data, rowKey, rowHeight } = tableInnerProps;
	const { splitColumnsArr, columnKeys, colBodyForceRenderObj, colHeadForceRenderObj } = tableColumns;
	const getH_ItemKey = useCallback((index: number) => getLeafColumn(splitColumnsArr[index]).key, [columnKeys]);
	const getH_ItemSize = useCallback((index: number) => sizeCacheMap.get(getH_ItemKey(index)) ?? defaultColWidth, [sizeCacheMap, getH_ItemKey]);

	const h_virtual = useHTableVirtual({
		getItemKey: getH_ItemKey,
		getItemSize: getH_ItemSize,
		count: splitColumnsArr.length,
		bodyRef: tableDomRef.bodyRef,
		headRef: tableDomRef.headRef,
	});

	const h_rangeEnd = h_virtual.rangeEnd;
	const h_rangeStart = h_virtual.rangeStart;
	const h_totalSize = h_virtual.totalSize;
	const [getH_virtualCore] = useRefValue(h_virtual.virtualCore);

	const getV_ItemKey = useCallback((index: number) => getRowKey(rowKey, data?.[index] as T, index), [rowKey, data]);
	const getV_ItemSize = useCallback(() => rowHeight, [rowHeight]);
	const v_virtual = useVTableVirtual({
		count: data?.length ?? 0,
		getItemKey: getV_ItemKey,
		getItemSize: getV_ItemSize,
		bodyRef: tableDomRef.bodyRef,
	});

	const v_sizeList = v_virtual.sizeList;
	const v_rangeStart = v_virtual.rangeStart;
	const v_rangeEnd = v_virtual.rangeEnd;
	const v_totalSize = v_virtual.totalSize;
	const v_measureItemSize = v_virtual.measureItemSize;
	const [getV_virtualCore] = useRefValue(v_virtual.virtualCore);
	const getV_OffsetTop = useCallback((rowIndex: number) => v_sizeList?.[rowIndex]?.start ?? 0, [v_sizeList]);

	const getHeadCellColShow = useCallback(
		({ colIndexStart, colIndexEnd }: { colIndexStart: number; colIndexEnd: number }) => {
			if (typeof h_rangeEnd === 'number' && typeof h_rangeStart === 'number') {
				for (let i = colIndexStart; i <= colIndexEnd; i++) {
					const key = getLeafColumn(splitColumnsArr[i]).key;
					if (colBodyForceRenderObj[key] === true) return true;
					if (i <= h_rangeEnd && i >= h_rangeStart) return true;
				}
			}
			return false;
		},
		[h_rangeStart, h_rangeEnd, splitColumnsArr, colHeadForceRenderObj],
	);

	const getBodyCellColShow = useCallback(
		({ colIndexStart, colIndexEnd }: { colIndexStart: number; colIndexEnd: number }) => {
			if (typeof h_rangeEnd === 'number' && typeof h_rangeStart === 'number') {
				for (let i = colIndexStart; i <= colIndexEnd; i++) {
					const key = getLeafColumn(splitColumnsArr[i]).key;
					if (colBodyForceRenderObj[key] === true) return true;
					if (i <= h_rangeEnd && i >= h_rangeStart) return true;
				}
			}
			return false;
		},
		[h_rangeStart, h_rangeEnd, v_rangeStart, v_rangeEnd, splitColumnsArr, colBodyForceRenderObj],
	);

	const getBodyCellRowShow = useCallback(
		({ rowIndexStart, rowIndexEnd }: { rowIndexStart: number; rowIndexEnd: number }) => {
			if (typeof v_rangeEnd === 'number' && typeof v_rangeStart === 'number') {
				if (typeof rowIndexStart === 'number' && typeof rowIndexEnd === 'number') {
					for (let i = rowIndexStart; i <= rowIndexEnd; i++) {
						if (i <= v_rangeEnd && i >= v_rangeStart) {
							return true;
						}
					}
				}
			}
			return false;
		},
		[h_rangeStart, h_rangeEnd, v_rangeStart, v_rangeEnd, splitColumnsArr, colBodyForceRenderObj],
	);

	return {
		v_totalSize,
		h_totalSize,
		getV_OffsetTop,
		getH_virtualCore,
		getV_virtualCore,
		v_measureItemSize,
		getHeadCellColShow,
		getBodyCellColShow,
		getBodyCellRowShow,
	};
};

export default useTableVirtual;
