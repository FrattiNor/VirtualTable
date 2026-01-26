import useTableCellBg from './useTableCellBg';
import useTableColumns from './useTableColumns';
import useTableDomRef from './useTableDomRef';
import useTableInnerProps from './useTableInnerProps';
import useTableObserver from './useTableObserver';
import useTableRef from './useTableRef';
import useTableResize from './useTableResize';
import useTableState from './useTableState';
import useTableSticky from './useTableSticky';
import useTableUtils from './useTableUtils';
import useTableVirtual from './useTableVirtual';
import { type RowKeyType } from '../TableTypes/type';

import type { TableCoreProps } from '../TableTypes/typeProps';

const useTableInstance = <T, K = RowKeyType, S = any>(coreProps: TableCoreProps<T, K, S>) => {
	const tableDomRef = useTableDomRef();
	const tableInnerProps = useTableInnerProps<T, K, S>(coreProps);
	const tableState = useTableState<T, K, S>({ coreProps, tableInnerProps });
	const tableCellBg = useTableCellBg<T, K, S>({ coreProps, tableState });
	const tableColumns = useTableColumns<T, K, S>({ coreProps, tableState });
	const tableSticky = useTableSticky<T, K, S>({ tableState, tableColumns });
	const tableResize = useTableResize<T, K, S>({ coreProps, tableState, tableColumns });
	const tableVirtual = useTableVirtual<T, K, S>({ coreProps, tableState, tableColumns, tableInnerProps, tableDomRef });
	const tableUtils = useTableUtils<T, K, S>({ tableInnerProps, tableColumns });

	useTableRef<T, K, S>({ coreProps, tableState, tableDomRef });
	useTableObserver<T, K, S>({ tableState, tableDomRef, tableVirtual, tableInnerProps });

	return {
		...tableState,
		...tableInnerProps,
		...tableDomRef,
		...tableColumns,
		...tableSticky,
		...tableResize,
		...tableCellBg,
		...tableVirtual,
		...tableUtils,
	};
};

export type TableInstance<T, K = RowKeyType, S = any> = ReturnType<typeof useTableInstance<T, K, S>>;
export default useTableInstance;
