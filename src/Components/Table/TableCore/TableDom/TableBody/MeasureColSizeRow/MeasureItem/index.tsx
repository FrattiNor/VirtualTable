import { memo, useEffect, useLayoutEffect, useRef } from 'react';

import { minColWidth, maxColWidth, defaultColWidth } from '../../../../TableUtils/configValues';

import type { TableCoreColumn } from '../../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'sizeCacheMap' | 'resized'> & {
	leafColumn: TableCoreColumn<T>;
	resizeObserver: ResizeObserver | null;
	sizeCacheChangeBatch: <B>(items: Array<B>, getKey: (item: B) => string | null, getSize: (item: B) => number) => void;
};

const MeasureItem = <T,>(props: Props<T>) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { leafColumn, resizeObserver, resized, sizeCacheMap, sizeCacheChangeBatch } = props;
	// resize过、并且有size缓存【针对resize】
	const resizedAndHaveSizeCache = resized && typeof sizeCacheMap.get(leafColumn.key) === 'number';
	// 非第一获取size，并且没有size缓存【针对后加的column，获取size缓存较慢问题】
	const notFirstAndNoSizeCache = sizeCacheMap.size > 0 && sizeCacheMap.get(leafColumn.key) === undefined;

	// 对新加的列及时计算size
	useLayoutEffect(() => {
		if (notFirstAndNoSizeCache && ref.current) {
			sizeCacheChangeBatch(
				[ref.current],
				(node) => node.getAttribute('data-key'),
				(node) => node.getBoundingClientRect().width,
			);
		}
	}, []);

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
			style={{
				flexShrink: 0,
				height: '100%',
				minWidth: minColWidth,
				maxWidth: maxColWidth,
				flexGrow: resizedAndHaveSizeCache ? 0 : (leafColumn.flexGrow ?? 1),
				width: resizedAndHaveSizeCache ? (sizeCacheMap.get(leafColumn.key) ?? 0) : (leafColumn.width ?? defaultColWidth),
			}}
		/>
	);
};

export default memo(MeasureItem) as typeof MeasureItem;
