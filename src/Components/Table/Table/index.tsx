import { memo } from 'react';

import { TableCore } from '../TableCore';
import TableRowDrag from '../TableRowDrag';
import TableRowSelection from '../TableRowSelection';
import TableTree from '../TableTree';
import { type TableProps } from './type';

const Table = <T extends Record<string, unknown>>(props: TableProps<T>) => {
	const { treeExpand, rowDraggable, rowSelection, ...coreProps } = props;

	if (rowDraggable) return <TableRowDrag {...coreProps} rowDraggable={rowDraggable} />;

	if (treeExpand) return <TableTree {...coreProps} treeExpand={treeExpand} />;

	if (rowSelection) return <TableRowSelection {...coreProps} rowSelection={rowSelection} />;

	return <TableCore {...coreProps} />;
};

export default memo(Table) as typeof Table;
