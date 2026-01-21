import { memo, useLayoutEffect } from 'react';

import { FixedTwo } from '../../../TableUtils';
import { maxColWidth, minColWidth } from '../../../TableUtils/configValues';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'setSizeCacheMap' | 'resized' | 'colSizeObserverRef'>;

// 单独提取组件目的为通过key强制触发useLayoutEffect执行计算colSize
// 如果在外层使用key触发强制渲染会导致colSizeObserverRef无法获取到dom
const ColSizeMeasure = <T,>(props: Props<T>) => {
	const { setSizeCacheMap, resized, colSizeObserverRef } = props;

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
		if (colSizeObserverRef.current && resized === false) {
			const element = colSizeObserverRef.current;
			// 直接执行一次
			sizeCacheChangeBatch(
				Array.from(element.children),
				(node) => node.getAttribute('data-key'),
				(node) => node.getBoundingClientRect().width,
			);
		}
	}, [resized]);

	return null;
};

export default memo(ColSizeMeasure) as typeof ColSizeMeasure;
