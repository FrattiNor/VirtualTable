import { cloneElement, type CSSProperties, useMemo, type FC, type ReactNode, isValidElement } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { RowDraggableContext, type RowDraggableContextProps } from './RowDraggableContext';
import { type RowKeyType } from '../../TableCore/TableTypes/type';

type Props = {
	rowKey: RowKeyType;
	rowIndex: number;
	children: ReactNode;
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

	if (!isValidElement(children)) return children;

	const coverProps = {
		draggableProps: attributes,
		draggableSetNodeRef: setNodeRef,
		style: { ...(children.props as any)?.style, ..._style },
	};

	return <RowDraggableContext.Provider value={contextValue}>{cloneElement(children, coverProps)}</RowDraggableContext.Provider>;
};

export default RowDraggableWrapper;
