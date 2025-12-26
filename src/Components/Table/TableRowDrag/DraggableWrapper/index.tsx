import { type Dispatch, type SetStateAction, useMemo, type PropsWithChildren } from 'react';

import { DndContext, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { getRowKey } from '../../TableCore/TableUtils';
import { type TableRowDraggable, type TableRowDragProps } from '../type';

type Props<T> = PropsWithChildren<{
	data: TableRowDragProps<T>['data'];
	rowKey: TableRowDragProps<T>['rowKey'];
	rowDraggable: TableRowDraggable;
	setDragActiveKey: Dispatch<SetStateAction<string | null>>;
}>;

const DraggableWrapper = <T,>({ data, rowKey, rowDraggable, setDragActiveKey, children }: Props<T>) => {
	const sortableItems = useMemo(() => (data ?? []).map((itemData) => getRowKey(rowKey, itemData)), [data]);

	const onDragStart = ({ active }: DragStartEvent) => {
		const rowKey = (active.data.current as any).rowKey;
		// const rowData = (active.data.current as any).rowData;
		// const rowIndex = (active.data.current as any).rowIndex;
		if (active.id) {
			// setDragActiveItem({ rowData, rowIndex, rowKey });
			setDragActiveKey(rowKey);
		} else {
			setDragActiveKey(null);
		}
	};

	const onDragEnd = (event: DragEndEvent) => {
		setDragActiveKey(null);
		const { active, over } = event;
		const overId = over?.id as string;
		const activeId = active.id as string;
		if (overId && activeId && overId !== activeId) {
			if (typeof rowDraggable.onDragEnd === 'function') {
				rowDraggable.onDragEnd({ activeKey: activeId, overKey: overId, arrayMove });
			}
		}
	};

	return (
		<DndContext
			id="DndContext"
			onDragEnd={onDragEnd}
			onDragStart={onDragStart}
			modifiers={[restrictToVerticalAxis]}
			autoScroll={{ enabled: true, threshold: { x: -1, y: 0.1 }, acceleration: 20 }}
		>
			<SortableContext id="SortableContext" items={sortableItems} strategy={verticalListSortingStrategy}>
				{children}
			</SortableContext>
		</DndContext>
	);
};

export default DraggableWrapper;
