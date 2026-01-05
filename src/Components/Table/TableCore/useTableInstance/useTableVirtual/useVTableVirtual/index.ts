import { useCallback, useMemo } from 'react';

import useVVirtualCore from './useVVirtualCore';
import useRefValue from '../../../TableHooks/useRefValue';
import { type TableCoreProps } from '../../../TableTypes/typeProps';
import { getLeafColumn, getRowKey } from '../../../TableUtils';

import type useTableColumns from '../../useTableColumns';
import type useTableDomRef from '../../useTableDomRef';
import type useTableInnerProps from '../../useTableInnerProps';

type Props<T> = {
	coreProps: TableCoreProps<T>;
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableColumns: ReturnType<typeof useTableColumns<T>>;
	tableInnerProps: ReturnType<typeof useTableInnerProps<T>>;
};

const useTableVirtual = <T>({ coreProps, tableColumns, tableInnerProps, tableDomRef }: Props<T>) => {
	const { splitColumnsArr, existOnCellSpan } = tableColumns;
	const { data, rowKey, rowHeight, borderWidth, rowDraggableMode } = tableInnerProps;
	const draggingRowIndex = coreProps.rowDraggableProps?.draggingRowIndex;

	const v_virtual = useVVirtualCore({
		count: data?.length ?? 0,
		bodyRef: tableDomRef.bodyRef,
		getItemKey: useCallback((index: number) => getRowKey(rowKey, data?.[index] as T), [rowKey, data]),
		getItemSize: useCallback((index: number) => (index === 0 ? rowHeight - borderWidth : rowHeight), [rowHeight, borderWidth]),
	});

	const v_sizeList = v_virtual.sizeList;
	const v_totalSize = v_virtual.totalSize;
	const v_rangeEnd_origin = v_virtual.rangeEnd;
	const v_rangeStart_origin = v_virtual.rangeStart;
	const v_measureItemSize = v_virtual.measureItemSize;
	const [getV_virtualCore] = useRefValue(v_virtual.virtualCore);

	// 根据是否存在rowSpan，重新计算v_rangeStart，v_rangeEnd
	const { v_rangeStart, v_rangeEnd } = useMemo(() => {
		// 存在cellSpan
		// 根据rowCellSpan重新计算当前的v_rangeStart，v_rangeEnd
		if (existOnCellSpan === true) {
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
			data?.forEach((itemData, rowIndex) => {
				for (let i = 0; i < splitColumnsArr.length; i++) {
					const splitColumns = splitColumnsArr[i];
					const leafColumn = getLeafColumn(splitColumns);
					const { rowSpan = 1, colSpan = 1 } = leafColumn.onCellSpan ? leafColumn.onCellSpan(itemData, rowIndex) : {};
					if (rowSpan <= 0 || colSpan <= 0) continue;
					const rowIndexStart = rowIndex;
					const rowIndexEnd = rowIndex + rowSpan - 1;
					if (!getOriginBodyCellRowShow({ rowIndexStart, rowIndexEnd })) continue;
					if (v_rangeStart === null) v_rangeStart = rowIndexStart;
					if (v_rangeEnd === null || rowIndexEnd > v_rangeEnd) v_rangeEnd = rowIndexEnd;
				}
			});

			return { v_rangeStart, v_rangeEnd };
		}

		return { v_rangeStart: v_rangeStart_origin, v_rangeEnd: v_rangeEnd_origin };
	}, [v_rangeStart_origin, v_rangeEnd_origin, data, splitColumnsArr, existOnCellSpan, rowDraggableMode]);

	const v_offsetTop = useMemo(() => v_sizeList?.[v_rangeStart ?? -1]?.start ?? 0, [v_sizeList, v_rangeStart]);

	const draggingRow_offsetTop = useMemo(() => v_sizeList?.[draggingRowIndex ?? -1]?.start ?? 0, [v_sizeList, draggingRowIndex]);

	const draggingRow_notShow = useMemo(() => {
		if (typeof draggingRowIndex !== 'number' || typeof v_rangeStart !== 'number' || typeof v_rangeEnd !== 'number') return false;
		return !(draggingRowIndex >= v_rangeStart && draggingRowIndex <= v_rangeEnd);
	}, [v_rangeStart, v_rangeEnd, draggingRowIndex]);

	return {
		v_totalSize,
		v_offsetTop,
		v_rangeStart,
		v_rangeEnd,
		v_rangeStart_origin,
		v_rangeEnd_origin,
		getV_virtualCore,
		v_measureItemSize,
		draggingRow_offsetTop,
		draggingRow_notShow,
	};
};

export default useTableVirtual;
