import { memo } from 'react';

import TableCore from '../TableCore';
import { _dragHooksProps } from '../TableRowDrag';
import { type TableComponent, type TableProps } from './type';
import useRowDraggable from '../TableRowDrag/useRowDraggable';
import { _selectionHooksProps } from '../TableRowSelection';
import useTableRowSelection from '../TableRowSelection/useTableRowSelection';
import { _treeHookProps } from '../TableTree';
import useTableTree from '../TableTree/useTableTree';

const Table = <T extends Record<string, unknown>>(props: TableProps<T>) => {
	const { treeExpand, rowDraggable, rowSelection, ...coreProps } = props;

	// enabled
	const treeEnable = treeExpand !== undefined && (treeExpand?.enabled ?? true);
	const dragEnable = rowDraggable !== undefined && (rowDraggable?.enabled ?? true);
	const selectionEnable = rowSelection !== undefined && (rowSelection?.enabled ?? true);

	// tree hooks
	const treeHookProps: Parameters<typeof useTableTree<T>>[0] = treeEnable
		? { data: coreProps.data, rowKey: coreProps.rowKey, columns: coreProps.columns, treeExpand }
		: _treeHookProps;
	const treeExpandProps = useTableTree(treeHookProps);
	const showData = treeEnable ? treeExpandProps.showData : props.data;
	const totalData = treeEnable ? treeExpandProps.totalData : props.data;

	// draggable hooks【data替换成showData】
	const dragHooksProps: Parameters<typeof useRowDraggable<T>>[0] = dragEnable
		? { data: showData, rowKey: coreProps.rowKey, rowDraggable }
		: _dragHooksProps;
	const rowDraggableProps = useRowDraggable(dragHooksProps);

	// selection hooks【data替换成totalData】
	const selectionHooksProps: Parameters<typeof useTableRowSelection<T>>[0] = selectionEnable
		? { data: totalData, rowKey: coreProps.rowKey, rowSelection }
		: _selectionHooksProps;
	const rowSelectionProps = useTableRowSelection(selectionHooksProps);

	// 最终props【data替换成showData】
	const tableDomProps = {
		...coreProps,
		data: showData,
		treeExpandProps: treeEnable ? treeExpandProps : undefined,
		rowDraggableProps: dragEnable ? rowDraggableProps : undefined,
		rowSelectionProps: selectionEnable ? rowSelectionProps : undefined,
	};

	return <TableCore {...tableDomProps} />;
};

export default memo(Table) as TableComponent;
