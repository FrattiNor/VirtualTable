import { cloneElement, type FC } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
	rowKey: string;
	rowIndex: number;
	children: JSX.Element;
};

const RowDraggableWrapper: FC<Props> = ({ rowIndex, rowKey, children }) => {
	const { attributes, setNodeRef, transform, transition, isSorting, isDragging } = useSortable({
		id: rowKey,
		data: { rowKey, rowIndex },
	});

	const _style: React.CSSProperties = {
		transition,
		zIndex: isDragging ? 2 : 1,
		transform: CSS.Translate.toString(transform),
		pointerEvents: isSorting ? 'none' : 'initial',
	};

	const coverProps = {
		draggableProps: attributes,
		draggableSetNodeRef: setNodeRef,
		style: { ...children.props.style, ..._style },
	};

	return cloneElement(children, coverProps);
};

export default RowDraggableWrapper;
