import useTableCellBg from './useTableCellBg';
import useTableColumns from './useTableColumns';
import useTableDomRef from './useTableDomRef';
import useTableInnerProps from './useTableInnerProps';
import useTableObserver from './useTableObserver';
import useTableRef from './useTableRef';
import useTableResize from './useTableResize';
import useTableState from './useTableState';
import useTableSticky from './useTableSticky';
import useTableVirtual from './useTableVirtual';

import type { TableCoreProps } from '../TableTypes/typeProps';

const useTableInstance = <T>(props: TableCoreProps<T>) => {
	const tableDomRef = useTableDomRef();
	const tableInnerProps = useTableInnerProps(props);
	const tableState = useTableState({ tableInnerProps });
	const tableCellBg = useTableCellBg({ tableState, props });
	const tableColumns = useTableColumns({ tableState, props });
	const tableSticky = useTableSticky({ tableState, tableColumns });
	const tableResize = useTableResize({ tableState, props, tableColumns });
	const tableVirtual = useTableVirtual({ tableState, tableColumns, tableInnerProps, tableDomRef });

	useTableRef({ props, tableState, tableDomRef });
	useTableObserver({ tableState, tableDomRef, tableVirtual });

	return { ...tableState, ...tableInnerProps, ...tableDomRef, ...tableColumns, ...tableSticky, ...tableResize, ...tableCellBg, ...tableVirtual };
};

export type TableInstance<T> = ReturnType<typeof useTableInstance<T>>;
export default useTableInstance;
