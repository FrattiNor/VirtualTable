import { useCallback } from 'react';

import useHVirtualCore from './useHVirtualCore';
import useRefValue from '../../../TableHooks/useRefValue';
import { getLeafColumn } from '../../../TableUtils';
import { defaultColWidth } from '../../../TableUtils/configValues';

import type useTableColumns from '../../useTableColumns';
import type useTableDomRef from '../../useTableDomRef';
import type useTableState from '../../useTableState';

type Props<T> = {
	tableState: ReturnType<typeof useTableState>;
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableColumns: ReturnType<typeof useTableColumns<T>>;
};

const useHTableVirtual = <T>({ tableColumns, tableState, tableDomRef }: Props<T>) => {
	const { sizeCacheMap } = tableState;
	const { finalColumnsArr, finalColumnsArrKeys, colBodyForceRenderMap, colHeadForceRenderMap, fixedLeftMap, fixedRightMap } = tableColumns;
	const getH_ItemKey = useCallback((index: number) => getLeafColumn(finalColumnsArr[index]).key, [finalColumnsArrKeys]);

	const h_virtual = useHVirtualCore({
		bodyRef: tableDomRef.bodyRef,
		headRef: tableDomRef.headRef,
		count: finalColumnsArr.length,
		getItemKey: getH_ItemKey,
		getItemSize: useCallback((index: number) => sizeCacheMap.get(getH_ItemKey(index)) ?? defaultColWidth, [sizeCacheMap, getH_ItemKey]),
	});

	const h_rangeEnd = h_virtual.rangeEnd;
	const h_rangeStart = h_virtual.rangeStart;
	const h_totalSize = h_virtual.totalSize;
	const [getH_virtualCore] = useRefValue(h_virtual.virtualCore);

	// 获取head的col显示情况
	const getHeadCellColShow = useCallback(
		({ colIndexStart, colIndexEnd }: { colIndexStart: number; colIndexEnd: number }) => {
			if (typeof h_rangeEnd === 'number' && typeof h_rangeStart === 'number') {
				for (let i = colIndexStart; i <= colIndexEnd; i++) {
					const key = getLeafColumn(finalColumnsArr[i]).key;
					if (colHeadForceRenderMap.get(key) === true) return true;
					if (fixedLeftMap.get(key) !== undefined || fixedRightMap.get(key) !== undefined) return true;
					if (i <= h_rangeEnd && i >= h_rangeStart) return true;
				}
			}
			return false;
		},
		[h_rangeStart, h_rangeEnd, finalColumnsArr, colHeadForceRenderMap, fixedLeftMap, fixedRightMap],
	);

	// 获取body的col的显示情况
	const getBodyCellColShow = useCallback(
		({ colIndexStart, colIndexEnd }: { colIndexStart: number; colIndexEnd: number }) => {
			if (typeof h_rangeEnd === 'number' && typeof h_rangeStart === 'number') {
				for (let i = colIndexStart; i <= colIndexEnd; i++) {
					const key = getLeafColumn(finalColumnsArr[i]).key;
					if (colBodyForceRenderMap.get(key) === true) return true;
					if (fixedLeftMap.get(key) !== undefined || fixedRightMap.get(key) !== undefined) return true;
					if (i <= h_rangeEnd && i >= h_rangeStart) return true;
				}
			}
			return false;
		},
		[h_rangeStart, h_rangeEnd, finalColumnsArr, colBodyForceRenderMap, fixedLeftMap, fixedRightMap],
	);

	// 获取body的col的强制显示情况
	const getBodyCellColForceShow = useCallback(
		({ colIndexStart, colIndexEnd }: { colIndexStart: number; colIndexEnd: number }) => {
			for (let i = colIndexStart; i <= colIndexEnd; i++) {
				const key = getLeafColumn(finalColumnsArr[i]).key;
				if (colBodyForceRenderMap.get(key) === true) return true;
			}
			return false;
		},
		[finalColumnsArr, colBodyForceRenderMap],
	);

	return {
		h_totalSize,
		getH_virtualCore,
		getHeadCellColShow,
		getBodyCellColShow,
		getBodyCellColForceShow,
	};
};

export default useHTableVirtual;
