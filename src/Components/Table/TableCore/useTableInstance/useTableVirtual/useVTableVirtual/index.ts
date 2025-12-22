import { useCallback, useMemo } from 'react';

import useVVirtualCore from './useVVirtualCore';
import useRefValue from '../../../TableHooks/useRefValue';
import { getLeafColumn, getRowKey } from '../../../TableUtils';

import type useTableColumns from '../../useTableColumns';
import type useTableDomRef from '../../useTableDomRef';
import type useTableInnerProps from '../../useTableInnerProps';

type Props<T> = {
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableColumns: ReturnType<typeof useTableColumns<T>>;
	tableInnerProps: ReturnType<typeof useTableInnerProps<T>>;
};

const useTableVirtual = <T>({ tableColumns, tableInnerProps, tableDomRef }: Props<T>) => {
	const { data, rowKey, rowHeight } = tableInnerProps;
	const { splitColumnsArr, existOnCellSpan } = tableColumns;

	const v_virtual = useVVirtualCore({
		count: data?.length ?? 0,
		bodyRef: tableDomRef.bodyRef,
		getItemSize: useCallback(() => rowHeight, [rowHeight]),
		getItemKey: useCallback((index: number) => getRowKey(rowKey, data?.[index] as T, index), [rowKey, data]),
	});

	const v_sizeList = v_virtual.sizeList;
	const v_totalSize = v_virtual.totalSize;
	const v_rangeEnd_origin = v_virtual.rangeEnd;
	const v_rangeStart_origin = v_virtual.rangeStart;
	const v_measureItemSize = v_virtual.measureItemSize;
	const [getV_virtualCore] = useRefValue(v_virtual.virtualCore);

	// 根据是否存在rowSpan，重新计算v_rangeStart，v_rangeEnd
	const { v_rangeStart, v_rangeEnd } = useMemo(() => {
		if (existOnCellSpan !== true) {
			return { v_rangeStart: v_rangeStart_origin, v_rangeEnd: v_rangeEnd_origin };
		}

		// 根据原始v_rangeStart，v_rangeEnd计算row是否显示
		const getOriginBodyCellRowShow = ({ rowIndexStart, rowIndexEnd }: { rowIndexStart: number; rowIndexEnd: number }) => {
			if (typeof v_rangeEnd_origin === 'number' && typeof v_rangeStart_origin === 'number') {
				for (let i = rowIndexStart; i <= rowIndexEnd; i++) {
					if (i <= v_rangeEnd_origin && i >= v_rangeStart_origin) {
						return true;
					}
				}
			}
			return false;
		};

		let v_rangeEnd: number | null = null;
		let v_rangeStart: number | null = null;

		// 遍历重新计算v_rangeStart，v_rangeEnd
		data?.forEach((dataItem, rowIndex) => {
			for (let i = 0; i < splitColumnsArr.length; i++) {
				const splitColumns = splitColumnsArr[i];
				const leafColumn = getLeafColumn(splitColumns);
				const { rowSpan = 1, colSpan = 1 } = leafColumn.onCellSpan ? leafColumn.onCellSpan(dataItem, rowIndex) : {};
				if (rowSpan <= 0 || colSpan <= 0) continue;
				const rowIndexStart = rowIndex;
				const rowIndexEnd = rowIndex + rowSpan - 1;
				if (!getOriginBodyCellRowShow({ rowIndexStart, rowIndexEnd })) continue;
				if (v_rangeStart === null) v_rangeStart = rowIndexStart;
				if (v_rangeEnd === null || rowIndexEnd > v_rangeEnd) v_rangeEnd = rowIndexEnd;
			}
		});

		return { v_rangeStart, v_rangeEnd };
	}, [v_rangeStart_origin, v_rangeEnd_origin, data, splitColumnsArr, existOnCellSpan]);

	const v_offsetTop = useMemo(() => v_sizeList?.[v_rangeStart ?? -1]?.start ?? 0, [v_sizeList, v_rangeStart]);

	return {
		v_totalSize,
		v_offsetTop,
		v_rangeStart,
		v_rangeEnd,
		v_rangeStart_origin,
		v_rangeEnd_origin,
		getV_virtualCore,
		v_measureItemSize,
	};
};

export default useTableVirtual;
