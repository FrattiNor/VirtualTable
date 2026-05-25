import { useState, useEffect } from 'react';

import styles from './index.module.less';
import StickyObserverItem from './StickyObserverItem';
import { useTableInstanceContext } from '../../../TableContext';
import useFrameThrottle from '../../../TableHooks/useFrameThrottle';
import { type TableCoreColumnFixed } from '../../../TableTypes/type';
import { getLeafColumn } from '../../../TableUtils';

const StickyObserver = <T,>() => {
	const { throttle } = useFrameThrottle();
	const ctx = useTableInstanceContext<T>();
	const { finalColumnsArr, bodyRef, setPingedMap, gridTemplateColumns, fixedLeftMap, fixedRightMap } = ctx;
	const [intersectionObserver, setIntersectionObserver] = useState<IntersectionObserver | null>(null);

	// IntersectionObserver
	useEffect(() => {
		if (bodyRef.current) {
			const _observer = new IntersectionObserver(
				(entries) => {
					throttle(() => {
						setPingedMap((old) => {
							let changed = false;
							entries.forEach((entry) => {
								const key = entry.target.getAttribute('data-key');
								const _fixed = entry.target.getAttribute('data-fixed');
								if (key !== null && _fixed !== null) {
									const fixed = _fixed as TableCoreColumnFixed;
									// 触发pinged
									// 缩放 可能导致无法达到1
									// 确保left是左侧遮挡，right是右侧遮挡
									if (
										entry.intersectionRatio < 0.975 &&
										((fixed === 'left' && entry.boundingClientRect.left < (entry.rootBounds?.left ?? 0)) ||
											(fixed === 'right' && entry.boundingClientRect.right > (entry.rootBounds?.right ?? 0)))
									) {
										if (!old.has(key) || old.get(key)?.fixed !== fixed) {
											old.set(key, { key, fixed });
											changed = true;
										}
									}
									// 未触发pinged
									else if (old.has(key)) {
										old.delete(key);
										changed = true;
									}
								}
							});
							if (changed) return new Map(old);
							return old;
						});
					});
				},
				{
					// 缩放可能导致无法达到1
					threshold: [0.975],
					root: bodyRef.current,
				},
			);
			setIntersectionObserver(_observer);

			return () => {
				_observer.disconnect();
				setIntersectionObserver(null);
			};
		}
	}, []);

	return (
		<div
			data-row="sticky-observer"
			className={styles['sticky-observer']}
			style={{ gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)` }}
		>
			{finalColumnsArr.map((splitColumns, colIndex) => {
				const leafColumn = getLeafColumn(splitColumns);
				if (leafColumn.fixed === 'left' || leafColumn.fixed === 'right') {
					return (
						<StickyObserverItem
							colIndex={colIndex}
							key={leafColumn.key}
							leafColumn={leafColumn}
							setPingedMap={setPingedMap}
							fixedLeftMap={fixedLeftMap}
							fixedRightMap={fixedRightMap}
							intersectionObserver={intersectionObserver}
						/>
					);
				}
			})}
		</div>
	);
};

export default StickyObserver;
