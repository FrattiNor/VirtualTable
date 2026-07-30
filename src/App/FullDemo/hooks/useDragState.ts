import { useState, useMemo } from 'react';

import { type DemoItem } from '../types';

export const useDragState = (data: DemoItem[], setData: React.Dispatch<React.SetStateAction<DemoItem[]>>) => {
	const [enabled, setEnabled] = useState(false);

	const rowDraggable = useMemo(() => {
		if (!enabled) return undefined;
		return {
			onDragEnd: ({
				activeKey,
				overKey,
				arrayMove,
			}: {
				activeKey: string;
				overKey: string;
				arrayMove: <T>(array: T[], from: number, to: number) => T[];
			}) => {
				const activeIndex = data.findIndex((item) => item.id === activeKey);
				const overIndex = data.findIndex((item) => item.id === overKey);
				if (activeIndex !== -1 && overIndex !== -1) {
					setData(arrayMove(data, activeIndex, overIndex));
				}
			},
		};
	}, [enabled, data, setData]);

	return {
		enabled,
		setEnabled,
		rowDraggable,
	};
};
