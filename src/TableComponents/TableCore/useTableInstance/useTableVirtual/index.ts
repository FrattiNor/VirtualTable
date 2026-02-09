import useHTableVirtual from './useHTableVirtual';
import useVTableVirtual from './useVTableVirtual';
import { type RowKeyType } from '../../TableTypes/type';
import { type TableCoreProps } from '../../TableTypes/typeProps';

import type useTableColumns from '../useTableColumns';
import type useTableDomRef from '../useTableDomRef';
import type useTableInnerProps from '../useTableInnerProps';
import type useTableState from '../useTableState';

type Props<T, K, S> = {
	coreProps: TableCoreProps<T, K, S>;
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableState: ReturnType<typeof useTableState<T, K, S>>;
	tableColumns: ReturnType<typeof useTableColumns<T, K, S>>;
	tableInnerProps: ReturnType<typeof useTableInnerProps<T, K, S>>;
};

const useTableVirtual = <T, K = RowKeyType, S = any>({ coreProps, tableColumns, tableState, tableInnerProps, tableDomRef }: Props<T, K, S>) => {
	const { h_totalSize, getH_virtualCore, getHeadCellColShow, getBodyCellColShow, getSummaryCellColShow, getBodyCellColForceShow } =
		useHTableVirtual({
			tableState,
			tableDomRef,
			tableColumns,
		});

	const { v_totalSize, v_offsetTop, v_items, getPlaceholderRow, getV_virtualCore, v_measureItemSize, draggingRow_notShow, draggingRow_offsetTop } =
		useVTableVirtual({
			coreProps,
			tableDomRef,
			tableColumns,
			tableInnerProps,
		});

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
		draggingRow_notShow,
		draggingRow_offsetTop,
		getSummaryCellColShow,
		v_items,
		getPlaceholderRow,
	};
};

export default useTableVirtual;
