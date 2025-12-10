import { memo, useEffect, useRef } from 'react';

import { minColWidth, maxColWidth } from '../../../../TableUtils/configValues';

import type { Table2Column } from '../../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'sizeCacheMap' | 'resized'> & {
	leafColumn: Table2Column<T>;
	resizeObserver: ResizeObserver | null;
};

const MeasureItem = <T,>(props: Props<T>) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { leafColumn, resizeObserver, resized, sizeCacheMap } = props;
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
			style={{
				flexShrink: 0,
				height: '100%',
				minWidth: minColWidth,
				maxWidth: maxColWidth,
				flexGrow: resizedAndHaveSizeCache ? 0 : (leafColumn.flexGrow ?? 1),
				width: resizedAndHaveSizeCache ? (sizeCacheMap.get(leafColumn.key) ?? 0) : leafColumn.width,
			}}
		/>
	);
};

export default memo(MeasureItem) as typeof MeasureItem;
