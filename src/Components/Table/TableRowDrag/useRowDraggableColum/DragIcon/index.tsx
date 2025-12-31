import { useEffect, useRef, type FC } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import classNames from 'classnames';

import styles from './index.module.less';

const DragIcon: FC<{ id: string }> = ({ id }) => {
	const ref = useRef<HTMLDivElement | null>(null);

	const { active, listeners, setActivatorNodeRef } = useSortable({ id });

	const isActive = active?.id === id;

	useEffect(() => {
		if (ref.current) {
			setActivatorNodeRef(ref.current);
			return () => setActivatorNodeRef(null);
		}
	}, []);

	return (
		<div className={classNames(styles['drag-icon'], { [styles['active']]: isActive })} ref={ref} {...listeners}>
			<svg viewBox="64 64 896 896" focusable="false" data-icon="holder" width="1em" height="1em" fill="currentColor" aria-hidden="true">
				<path d="M300 276.5a56 56 0 1056-97 56 56 0 00-56 97zm0 284a56 56 0 1056-97 56 56 0 00-56 97zM640 228a56 56 0 10112 0 56 56 0 00-112 0zm0 284a56 56 0 10112 0 56 56 0 00-112 0zM300 844.5a56 56 0 1056-97 56 56 0 00-56 97zM640 796a56 56 0 10112 0 56 56 0 00-112 0z"></path>
			</svg>
		</div>
	);
};

export default DragIcon;
