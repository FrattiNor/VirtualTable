import { cloneElement, type FC } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
	rowKey: string;
	rowIndex: number;
	children: JSX.Element;
};

const RowDraggableWrapper: FC<Props> = ({ rowIndex, rowKey, children }) => {
	const { attributes, setNodeRef, transform, transition, isDragging } = useSortable({ id: rowKey, data: { rowKey, rowIndex } });

	const _style: React.CSSProperties = {
		transition,
		position: 'relative',
		zIndex: isDragging ? 2 : 1,
		// opacity: isDragging ? 0 : undefined,
		transform: CSS.Translate.toString(transform),
	};

	return cloneElement(children, { ref: setNodeRef, style: { ...children.props.style, ..._style }, ...attributes });
};

export default RowDraggableWrapper;
