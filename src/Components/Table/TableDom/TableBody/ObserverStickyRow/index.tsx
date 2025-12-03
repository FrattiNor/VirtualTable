import { memo, useState, useEffect, startTransition } from 'react';

import styles from './index.module.less';
import ObserverItem from './ObserverItem';
import useThrottle from '../../../TableHooks/useThrottle';
import { type TableColumnFixed } from '../../../TableTypes/type';
import { getLeafColumn } from '../../../TableUtils';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Required<
	Pick<
		TableInstance<T>,
		'fixedLeftMap' | 'fixedRightMap' | 'splitColumnsArr' | 'bodyRef' | 'setPingedMap' | 'columnsKeyIndexMap' | 'gridTemplateColumns'
	>
>;

const ObserverStickyRow = <T,>(props: Props<T>) => {
	const { throttle } = useThrottle();
	const { splitColumnsArr, bodyRef, setPingedMap, columnsKeyIndexMap, gridTemplateColumns } = props;
	const [intersectionObserver, setIntersectionObserver] = useState<IntersectionObserver | null>(null);

	// IntersectionObserver
	useEffect(() => {
		if (bodyRef.current) {
			const _observer = new IntersectionObserver(
				(entries) => {
					throttle(() => {
						startTransition(() => {
							setPingedMap((old) => {
								let changed = false;
								entries.forEach((entry) => {
									const key = entry.target.getAttribute('data-key');
									const _fixed = entry.target.getAttribute('data-fixed');
									const _index = entry.target.getAttribute('data-index');
									if (key !== null && _index !== null && _fixed !== null) {
										const index = parseInt(_index);
										const fixed = _fixed as TableColumnFixed;
										// 触发pinged
										// 缩放可能导致无法达到1
										// 确保left是左侧遮挡，right是右侧遮挡
										if (
											entry.intersectionRatio < 0.975 &&
											((fixed === 'left' && entry.boundingClientRect.left < (entry.rootBounds?.left ?? 0)) ||
												(fixed === 'right' && entry.boundingClientRect.right > (entry.rootBounds?.right ?? 0)))
										) {
											if (!old.has(key) || old.get(key)?.fixed !== fixed || old.get(key)?.index !== index) {
												old.set(key, { fixed, index });
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
			data-row="observer-sticky"
			className={styles['observer-sticky']}
			style={{ gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)` }}
		>
			{splitColumnsArr.map((splitColumns) => {
				const leafColumn = getLeafColumn(splitColumns);
				const colIndex = columnsKeyIndexMap.get(leafColumn.key) ?? Infinity;
				if (leafColumn.fixed) {
					return (
						<ObserverItem
							colIndex={colIndex}
							leafColumn={leafColumn}
							bodyRef={props.bodyRef}
							setPingedMap={props.setPingedMap}
							fixedLeftMap={props.fixedLeftMap}
							fixedRightMap={props.fixedRightMap}
							key={`${leafColumn.key}-${colIndex}`}
							intersectionObserver={intersectionObserver}
						/>
					);
				}
			})}
		</div>
	);
};

export default memo(ObserverStickyRow) as typeof ObserverStickyRow;
