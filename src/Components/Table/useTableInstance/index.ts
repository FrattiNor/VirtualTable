import useTableCellBg from './useTableCellBg';
import useTableColumns from './useTableColumns';
import useTableDomRef from './useTableDomRef';
import useTableInnerProps from './useTableInnerProps';
import useTableObserver from './useTableObserver';
import useTableResize from './useTableResize';
import useTableState from './useTableState';
import useTableSticky from './useTableSticky';
import useTableVirtual from './useTableVirtual';

import type { TableProps } from '../TableTypes/typeProps';

const useTableInstance = <T>(props: TableProps<T>) => {
	const tableDomRef = useTableDomRef();
	const tableInnerProps = useTableInnerProps(props);
	const tableState = useTableState({ tableInnerProps });
	const tableColumns = useTableColumns({ tableState, props });
	const tableSticky = useTableSticky({ tableState, tableColumns });
	const tableCellBg = useTableCellBg({ tableState, tableInnerProps });
	const tableResize = useTableResize({ tableState, tableInnerProps, tableColumns });
	const tableVirtual = useTableVirtual({ tableState, tableColumns, tableInnerProps, tableDomRef });
	useTableObserver({ tableState, tableDomRef, tableVirtual });

	return { ...tableState, ...tableInnerProps, ...tableDomRef, ...tableColumns, ...tableSticky, ...tableResize, ...tableCellBg, ...tableVirtual };
};

export type TableInstance<T> = ReturnType<typeof useTableInstance<T>>;
export default useTableInstance;
