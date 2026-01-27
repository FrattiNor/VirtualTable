import { useEffect, useRef } from 'react';

import styles from './index.module.less';

import type { TableCoreColumn } from '../../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'setPingedMap' | 'fixedLeftMap' | 'fixedRightMap'> & {
	colIndex: number;
	leafColumn: TableCoreColumn<T>;
	intersectionObserver: IntersectionObserver | null;
};

const StickyObserverItem = <T,>(props: Props<T>) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { leafColumn, intersectionObserver, setPingedMap, fixedLeftMap, fixedRightMap, colIndex } = props;

	const offsetX = (() => {
		if (leafColumn.fixed === 'left') {
			const stickySize = fixedLeftMap.get(leafColumn.key)?.stickySize;
			if (typeof stickySize === 'number') return -stickySize;
		}
		if (leafColumn.fixed === 'right') {
			const stickySize = fixedRightMap.get(leafColumn.key)?.stickySize;
			if (typeof stickySize === 'number') return stickySize;
		}
		return 0;
	})();

	useEffect(() => {
		// observer
		if (intersectionObserver && ref.current) {
			const item = ref.current;
			intersectionObserver.observe(item);
			return () => {
				intersectionObserver.unobserve(item);
				setPingedMap((old) => {
					const key = leafColumn.key;
					if (old.has(key)) {
						old.delete(key);
						return new Map(old);
					}
					return old;
				});
			};
		}
	}, [intersectionObserver]);

	return (
		<div
			ref={ref}
			data-key={leafColumn.key}
			data-fixed={leafColumn.fixed}
			className={styles['sticky-observer-item']}
			style={{ gridRow: `1/2`, gridColumn: `${colIndex + 1}/${colIndex + 2}`, transform: `translate3d(${offsetX}px, 0, 0)` }}
		/>
	);
};

export default StickyObserverItem;
