import { memo } from 'react';

import { TableCore } from '../TableCore';
import { type TableRowSelectionProps } from './type';
import useTableRowSelection from './useTableRowSelection';

const TableRowSelection = <T,>(props: TableRowSelectionProps<T>) => {
	const { rowSelection, ...restProps } = props;
	const { rowSelectionColum, rowSelectionKeyMap } = useTableRowSelection({ rowSelection, props });
	return <TableCore {...restProps} rowSelectionColum={rowSelectionColum} rowSelectionKeyMap={rowSelectionKeyMap} />;
};

export default memo(TableRowSelection) as typeof TableRowSelection;
