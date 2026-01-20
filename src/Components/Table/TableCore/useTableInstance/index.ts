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

import type { TableCoreProps } from '../TableTypes/typeProps';

const useTableInstance = <T>(coreProps: TableCoreProps<T>) => {
	const tableDomRef = useTableDomRef();
	const tableInnerProps = useTableInnerProps(coreProps);
	const tableState = useTableState({ coreProps, tableInnerProps });
	const tableCellBg = useTableCellBg({ coreProps, tableState });
	const tableColumns = useTableColumns({ coreProps, tableState });
	const tableSticky = useTableSticky({ tableState, tableColumns });
	const tableResize = useTableResize({ coreProps, tableState, tableColumns });
	const tableVirtual = useTableVirtual({ coreProps, tableState, tableColumns, tableInnerProps, tableDomRef });
	const tableUtils = useTableUtils({ tableInnerProps, tableColumns });

	useTableRef({ coreProps, tableState, tableDomRef });
	useTableObserver({ tableState, tableDomRef, tableVirtual });

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

export type TableInstance<T> = ReturnType<typeof useTableInstance<T>>;
export default useTableInstance;
