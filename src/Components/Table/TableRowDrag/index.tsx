/* eslint-disable react-refresh/only-export-components */
import { memo } from 'react';

import TableCore from '../TableCore';
import { type TableRowDragProps } from './type';
import useRowDraggable from './useRowDraggable';

export const _dragHooksProps: Parameters<typeof useRowDraggable<any>>[0] = {
	data: undefined,
	rowKey: '',
	rowDraggable: {},
};

const TableRowDrag = <T extends Record<string, unknown>>(props: TableRowDragProps<T>) => {
	const { rowDraggable, ...coreProps } = props;

	const enabled = rowDraggable?.enabled ?? true;

	const dragHooksProps: Parameters<typeof useRowDraggable<T>>[0] = { data: coreProps.data, rowKey: coreProps.rowKey, rowDraggable };

	const rowDraggableProps = useRowDraggable(enabled ? dragHooksProps : _dragHooksProps);

	const tableDomProps = {
		...coreProps,
		rowDraggableProps: enabled ? rowDraggableProps : undefined,
	};

	return <TableCore {...tableDomProps} />;
};

export default memo(TableRowDrag) as typeof TableRowDrag;
