/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { createContext } from 'react';

export type RowDraggableContextProps = {
	isDragging?: boolean;
	listeners?: Record<string, Function>;
	setActivatorNodeRef?: (element: HTMLElement | null) => void;
};

// 给DraggableIcon提供参数
export const RowDraggableContext = createContext<RowDraggableContextProps>({});
