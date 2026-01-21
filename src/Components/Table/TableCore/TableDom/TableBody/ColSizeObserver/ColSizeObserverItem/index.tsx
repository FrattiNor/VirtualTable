import { useEffect, useRef } from 'react';

import styles from './index.module.less';
import { minColWidth, maxColWidth, defaultColWidth } from '../../../../TableUtils/configValues';

import type { TableCoreColumn } from '../../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'sizeCacheMap' | 'resized'> & {
	leafColumn: TableCoreColumn<T>;
	resizeObserver: ResizeObserver | null;
};

const ColSizeObserverItem = <T,>(props: Props<T>) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { leafColumn, resizeObserver, resized, sizeCacheMap } = props;
	// resize过、并且有size缓存【针对resize】
	const resizedAndHaveSizeCache = resized && typeof sizeCacheMap.get(leafColumn.key) === 'number';

	useEffect(() => {
		if (resizeObserver && ref.current) {
			const item = ref.current;
			resizeObserver.observe(item);
			return () => {
				resizeObserver.unobserve(item);
			};
		}
	}, [resizeObserver]);

	return (
		<div
			ref={ref}
			data-key={leafColumn.key}
			className={styles['col-size-observer-item']}
			style={{
				flexShrink: 0,
				minWidth: minColWidth,
				maxWidth: maxColWidth,
				flexGrow: resizedAndHaveSizeCache ? 0 : (leafColumn.flexGrow ?? 1),
				width: resizedAndHaveSizeCache ? (sizeCacheMap.get(leafColumn.key) ?? 0) : (leafColumn.width ?? defaultColWidth),
			}}
		/>
	);
};

export default ColSizeObserverItem;
