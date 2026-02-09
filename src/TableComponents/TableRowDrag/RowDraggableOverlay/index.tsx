import { type FC } from 'react';

import { DragOverlay, useDndContext } from '@dnd-kit/core';

import styles from './index.module.less';

type Props = {
	dragActive: { rowIndex: number };
};

const RowDraggableOverlay: FC<Props> = ({ dragActive }) => {
	const dnd = useDndContext();
	const activeIndex = dragActive.rowIndex;
	const overIndex = dnd.over?.data?.current?.rowIndex;
	const left = (dnd.activatorEvent as PointerEvent)?.pageX;

	return (
		<DragOverlay className={styles['overlay']} style={{ left: left - 12, width: 'max-content' }}>
			<svg width="1em" height="1em" focusable="false" fill="currentColor" viewBox="64 64 896 896" className={styles['icon']}>
				<path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
			</svg>
			{typeof activeIndex === 'number' && typeof overIndex === 'number' && activeIndex !== overIndex ? (
				<span>{`${activeIndex + 1}行 移动至 ${overIndex + 1}行`}</span>
			) : (
				<span>{'拖拽排序'}</span>
			)}
		</DragOverlay>
	);
};

export default RowDraggableOverlay;
