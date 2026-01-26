import { useMemo, type PropsWithChildren } from 'react';

import { DndContext, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { type RowKeyType } from '../../TableCore/TableTypes/type';
import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableRowDraggable } from '../type';

type Props<T> = PropsWithChildren<{
	data: TableCoreProps<T>['data'];
	rowKey: TableCoreProps<T>['rowKey'];
	rowDraggable: TableRowDraggable;
	setDragActive: React.Dispatch<React.SetStateAction<{ rowKey: RowKeyType; rowIndex: number } | null>>;
}>;

const DraggableWrapper = <T,>({ data, rowKey, rowDraggable, children, setDragActive }: Props<T>) => {
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
