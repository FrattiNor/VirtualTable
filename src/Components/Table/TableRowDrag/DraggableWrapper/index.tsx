import { useMemo, type PropsWithChildren } from 'react';

import { DndContext, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableRowDraggable } from '../type';

type Props<T> = PropsWithChildren<{
	coreProps: TableCoreProps<T>;
	rowDraggable: TableRowDraggable;
	setDragActive: React.Dispatch<React.SetStateAction<{ rowKey: string; rowIndex: number } | null>>;
}>;

const DraggableWrapper = <T,>({ coreProps, rowDraggable, children, setDragActive }: Props<T>) => {
	const { data, rowKey } = coreProps;

	const sortableItems = useMemo(() => (data ?? []).map((itemData) => getRowKey(rowKey, itemData)), [data]);

	const onDragStart = ({ active }: DragStartEvent) => {
		const rowKey = (active.data.current as any).rowKey;
		const rowIndex = (active.data.current as any).rowIndex;
		if (active.id) {
			setDragActive({ rowKey, rowIndex });
		} else {
			setDragActive(null);
		}
	};

	const onDragEnd = (event: DragEndEvent) => {
		setDragActive(null);
		const { active, over } = event;
		const overId = over?.id as string;
		const activeId = active.id as string;
		if (overId && activeId && overId !== activeId) {
			if (typeof rowDraggable?.onDragEnd === 'function') {
				rowDraggable?.onDragEnd({ activeKey: activeId, overKey: overId, arrayMove });
			}
		}
	};

	return (
		<DndContext id="DndContext" onDragEnd={onDragEnd} onDragStart={onDragStart}>
			<SortableContext id="SortableContext" items={sortableItems} strategy={verticalListSortingStrategy}>
				{children}
			</SortableContext>
		</DndContext>
	);
};

export default DraggableWrapper;
