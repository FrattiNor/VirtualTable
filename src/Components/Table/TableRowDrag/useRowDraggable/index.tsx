import { type ReactNode, useState } from 'react';

import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import DraggableWrapper from '../DraggableWrapper';
import RowDraggableOverlay from '../RowDraggableOverlay';
import RowDraggableWrapper from '../RowDraggableWrapper';
import { type TableRowDraggable } from '../type';
import useRowDraggableColum from './useRowDraggableColum';
import { type RowKeyType } from '../../TableCore/TableTypes/type';

type Props<T> = {
	data: TableCoreProps<T>['data'];
	rowKey: TableCoreProps<T>['rowKey'];
	rowDraggable: TableRowDraggable;
};

const useRowDraggable = <T,>({ data, rowKey, rowDraggable }: Props<T>) => {
	const rowDraggableColum = useRowDraggableColum<T>({ rowDraggable });
	const [dragActive, setDragActive] = useState<{ rowKey: RowKeyType; rowIndex: number } | null>(null);

	const renderWidthDraggableWrapper = (children: ReactNode) => (
		<DraggableWrapper data={data} rowKey={rowKey} rowDraggable={rowDraggable} setDragActive={setDragActive}>
			{children}
			{dragActive && <RowDraggableOverlay dragActive={dragActive} />}
		</DraggableWrapper>
	);

	return {
		rowDraggableColum,
		RowDraggableWrapper,
		renderWidthDraggableWrapper,
		draggingRowKey: dragActive?.rowKey,
		draggingRowIndex: dragActive?.rowIndex,
	};
};

export default useRowDraggable;
