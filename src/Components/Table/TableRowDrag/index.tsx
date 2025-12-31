import { memo, useState } from 'react';

import { TableDom } from '../TableCore';
import DraggableWrapper from './DraggableWrapper';
import RowDraggableOverlay from './RowDraggableOverlay';
import RowDraggableWrapper from './RowDraggableWrapper';
import { type TableRowDragProps } from './type';
import useRowDraggableColum from './useRowDraggableColum';
import useTableInstance from '../TableCore/useTableInstance';

const TableRowDrag = <T extends Record<string, unknown>>(props: TableRowDragProps<T>) => {
	const { rowDraggable, ...coreProps } = props;
	const rowDraggableColum = useRowDraggableColum({ rowDraggable, coreProps });
	const [dragActive, setDragActive] = useState<{ rowKey: string; rowIndex: number } | null>(null);

	const instance = useTableInstance({
		...coreProps,
		rowDraggableProps: {
			rowDraggableColum,
			RowDraggableWrapper,
			draggingRowKey: dragActive?.rowKey,
			draggingRowIndex: dragActive?.rowIndex,
		},
	});

	return (
		<DraggableWrapper coreProps={coreProps} rowDraggable={rowDraggable} setDragActive={setDragActive}>
			<TableDom {...instance} />
			{dragActive && <RowDraggableOverlay dragActive={dragActive} />}
		</DraggableWrapper>
	);
};

export default memo(TableRowDrag) as typeof TableRowDrag;
