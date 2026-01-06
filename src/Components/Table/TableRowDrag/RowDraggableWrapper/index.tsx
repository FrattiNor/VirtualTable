import { cloneElement, type CSSProperties, useMemo, type FC } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { RowDraggableContext, type RowDraggableContextProps } from './RowDraggableContext';

type Props = {
	rowKey: string;
	rowIndex: number;
	children: JSX.Element;
};

const RowDraggableWrapper: FC<Props> = ({ rowIndex, rowKey, children }) => {
	const sortable = useSortable({ id: rowKey, data: { rowKey, rowIndex } });

	const { attributes, transform, transition, isSorting, isDragging, listeners, setNodeRef, setActivatorNodeRef } = sortable;

	const contextValue = useMemo<RowDraggableContextProps>(
		() => ({ isDragging, setActivatorNodeRef, listeners }),
		[isDragging, setActivatorNodeRef, listeners],
	);

	const _style = useMemo<CSSProperties>(
		() => ({
			transition,
			zIndex: isDragging ? 2 : 1,
			transform: CSS.Translate.toString(transform),
			pointerEvents: isSorting ? 'none' : 'initial',
		}),
		[transition, transform, isDragging, isSorting],
	);

	const coverProps = {
		draggableProps: attributes,
		draggableSetNodeRef: setNodeRef,
		style: { ...children.props.style, ..._style },
	};

	return <RowDraggableContext.Provider value={contextValue}>{cloneElement(children, coverProps)}</RowDraggableContext.Provider>;
};

export default RowDraggableWrapper;
