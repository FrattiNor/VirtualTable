import { memo, useEffect, useState } from 'react';

import ColSizeObserverItem from './ColSizeObserverItem';
import styles from './index.module.less';
import { FixedTwo, getDisplayNone, getLeafColumn } from '../../../TableUtils';
import { maxColWidth, minColWidth } from '../../../TableUtils/configValues';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'columnsCore' | 'setSizeCacheMap' | 'resizeFlag' | 'sizeCacheMap' | 'resized' | 'colSizeObserverRef'>;

const ColSizeObserver = <T,>(props: Props<T>) => {
	const { columnsCore, setSizeCacheMap, resizeFlag, colSizeObserverRef } = props;
	const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(null);

	const sizeCacheChangeBatch = <B,>(items: Array<B>, getKey: (item: B) => string | null, getSize: (item: B) => number) => {
		setSizeCacheMap((old) => {
			let changed = false;
			items.forEach((item) => {
				const key = getKey(item);
				if (typeof key === 'string') {
					const size = Math.min(Math.max(FixedTwo(getSize(item)), minColWidth), maxColWidth);
					if (old.get(key) !== size) {
						old.set(key, size);
						changed = true;
					}
				}
			});
			if (changed) return new Map(old);
			return old;
		});
	};

	// ResizeObserver
	useEffect(() => {
		if (!resizeFlag && colSizeObserverRef.current) {
			const _observer = new ResizeObserver((entries) => {
				// display none的情况直接跳过执行
				if (getDisplayNone(entries[0].contentRect)) return;
				sizeCacheChangeBatch(
					entries,
					(entry) => entry.target.getAttribute('data-key'),
					(entry) => entry.contentRect.width,
				);
			});

			setResizeObserver(_observer);

			return () => {
				_observer.disconnect();
				setResizeObserver(null);
			};
		}
	}, [resizeFlag]);

	return (
		<div ref={colSizeObserverRef} data-row="col-size-observer" className={styles['col-size-observer']}>
			{columnsCore.map((splitColumns) => {
				const leafColumn = getLeafColumn(splitColumns);
				return (
					<ColSizeObserverItem
						key={leafColumn.key}
						leafColumn={leafColumn}
						resized={props.resized}
						resizeObserver={resizeObserver}
						sizeCacheMap={props.sizeCacheMap}
					/>
				);
			})}
		</div>
	);
};

export default memo(ColSizeObserver) as typeof ColSizeObserver;
