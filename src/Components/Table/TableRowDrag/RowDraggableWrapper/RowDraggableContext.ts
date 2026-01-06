import { createContext } from 'react';

import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

export type RowDraggableContextProps = {
	isDragging?: boolean;
	listeners?: SyntheticListenerMap;
	setActivatorNodeRef?: (element: HTMLElement | null) => void;
};

// 给DraggableIcon提供参数
export const RowDraggableContext = createContext<RowDraggableContextProps>({});
