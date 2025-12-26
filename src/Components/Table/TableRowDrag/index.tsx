import { memo, useEffect, useState } from 'react';

import { TableCore } from '../TableCore';
import DraggableWrapper from './DraggableWrapper';
import RowDraggableWrapper from './RowDraggableWrapper';
import { type TableRowDragProps } from './type';
import useTableRowDraggable from './useTableRowDraggable';

const TableRowDrag = <T extends Record<string, unknown>>(props: TableRowDragProps<T>) => {
	const { rowDraggable, ...restProps } = props;
	const [dragActiveKey, setDragActiveKey] = useState<string | null>(null);
	const { rowDraggableColum } = useTableRowDraggable({ rowDraggable, props });

	useEffect(() => {
		console.log('dragActiveKey', dragActiveKey);
	}, [dragActiveKey]);

	return (
		<DraggableWrapper data={props.data} rowKey={props.rowKey} rowDraggable={rowDraggable} setDragActiveKey={setDragActiveKey}>
			<TableCore {...restProps} rowDraggableProps={{ rowDraggableColum, RowDraggableWrapper }} />
		</DraggableWrapper>
	);
};

export default memo(TableRowDrag) as typeof TableRowDrag;
