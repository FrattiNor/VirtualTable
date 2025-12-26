import { memo } from 'react';

import { TableCore } from '../TableCore';
import { type TableRowSelectionProps } from './type';
import useTableRowSelection from './useTableRowSelection';

const TableRowSelection = <T extends Record<string, unknown>>(props: TableRowSelectionProps<T>) => {
	const { rowSelection, ...restProps } = props;
	const { rowSelectionColum, rowSelectionKeyMap } = useTableRowSelection({ rowSelection, props });
	return <TableCore {...restProps} rowSelectionProps={{ rowSelectionColum, rowSelectionKeyMap }} />;
};

export default memo(TableRowSelection) as typeof TableRowSelection;
