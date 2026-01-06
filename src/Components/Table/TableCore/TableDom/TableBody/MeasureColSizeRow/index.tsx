import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './index.module.less';
import MeasureItem from './MeasureItem';
import { FixedTwo, getDisplayNone, getLeafColumn } from '../../../TableUtils';
import { maxColWidth, minColWidth } from '../../../TableUtils/configValues';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'columnsCore' | 'setSizeCacheMap' | 'resizeFlag' | 'sizeCacheMap' | 'resized'>;

const MeasureColSizeRow = <T,>(props: Props<T>) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { columnsCore, setSizeCacheMap, resizeFlag, resized } = props;
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

	// first calc
	useLayoutEffect(() => {
		if (ref.current && resized === false) {
			const element = ref.current;
			// 直接执行一次
			sizeCacheChangeBatch(
				Array.from(element.children),
				(node) => node.getAttribute('data-key'),
				(node) => node.getBoundingClientRect().width,
			);
		}
	}, [resized]);

	// ResizeObserver
	useEffect(() => {
		if (!resizeFlag && ref.current) {
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
		<div ref={ref} data-row="measure-col-size" className={styles['measure-col-size']}>
			{columnsCore.map((splitColumns) => {
				const leafColumn = getLeafColumn(splitColumns);
				return (
					<MeasureItem
						key={leafColumn.key}
						leafColumn={leafColumn}
						resized={props.resized}
						resizeObserver={resizeObserver}
						sizeCacheMap={props.sizeCacheMap}
						sizeCacheChangeBatch={sizeCacheChangeBatch}
					/>
				);
			})}
		</div>
	);
};

export default memo(MeasureColSizeRow) as typeof MeasureColSizeRow;
