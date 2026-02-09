import { type ReactNode, useCallback } from 'react';

import useHTableVirtual from './useHTableVirtual';
import useVTableVirtual from './useVTableVirtual';
import { type RowKeyType } from '../../TableTypes/type';
import { type TableCoreProps } from '../../TableTypes/typeProps';
import { getRowKey } from '../../TableUtils';

import type useTableColumns from '../useTableColumns';
import type useTableDomRef from '../useTableDomRef';
import type useTableInnerProps from '../useTableInnerProps';
import type useTableState from '../useTableState';

type RenderRow<T, K> = (params: { itemData: T; itemRowKey: K; rowIndex: number; isPlaceholder: boolean }) => ReactNode;

type Props<T, K, S> = {
	coreProps: TableCoreProps<T, K, S>;
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableState: ReturnType<typeof useTableState<T, K, S>>;
	tableColumns: ReturnType<typeof useTableColumns<T, K, S>>;
	tableInnerProps: ReturnType<typeof useTableInnerProps<T, K, S>>;
};

const useTableVirtual = <T, K = RowKeyType, S = any>({ coreProps, tableColumns, tableState, tableInnerProps, tableDomRef }: Props<T, K, S>) => {
	const { data, rowKey } = tableInnerProps;

	const { h_totalSize, getH_virtualCore, getHeadCellColShow, getBodyCellColShow, getSummaryCellColShow, getBodyCellColForceShow } =
		useHTableVirtual({
			tableState,
			tableDomRef,
			tableColumns,
		});

	const {
		v_totalSize,
		v_offsetTop,
		v_rangeStart,
		v_rangeEnd,
		v_rangeEnd_origin,
		v_rangeStart_origin,
		getV_virtualCore,
		v_measureItemSize,
		draggingRow_notShow,
		draggingRow_offsetTop,
	} = useVTableVirtual({
		coreProps,
		tableDomRef,
		tableColumns,
		tableInnerProps,
	});

	const renderBodyDom = useCallback(
		(renderRow: RenderRow<T, K>) => {
			const bodyDom: ReactNode[] = [];
			if (
				typeof v_rangeStart === 'number' &&
				typeof v_rangeEnd === 'number' &&
				typeof v_rangeStart_origin === 'number' &&
				typeof v_rangeEnd_origin === 'number'
			) {
				for (let rowIndex = v_rangeStart; rowIndex <= v_rangeEnd; rowIndex++) {
					const isPlaceholder = !(rowIndex >= v_rangeStart_origin && rowIndex <= v_rangeEnd_origin);
					const itemData = data[rowIndex];
					if (itemData) {
						const itemRowKey = getRowKey(rowKey, itemData);
						bodyDom.push(renderRow({ itemData, itemRowKey, rowIndex, isPlaceholder }));
					}
				}
			}
			return bodyDom;
		},
		[data, rowKey, v_rangeStart, v_rangeEnd, v_rangeStart_origin, v_rangeEnd_origin],
	);

	return {
		h_totalSize,
		getH_virtualCore,
		getHeadCellColShow,
		v_totalSize,
		v_offsetTop,
		getV_virtualCore,
		v_measureItemSize,
		getBodyCellColShow,
		getBodyCellColForceShow,
		renderBodyDom,
		draggingRow_notShow,
		draggingRow_offsetTop,
		getSummaryCellColShow,
	};
};

export default useTableVirtual;
