import { useLayoutEffect } from 'react';

import { useTableInstanceContext } from '../../../TableContext';
import { maxColWidth, minColWidth } from '../../../TableUtils/configValues';

const ColSizeMeasure = <T,>() => {
	const { setSizeCacheMap, colSizeObserverRef } = useTableInstanceContext<T>();

	const sizeCacheChangeBatch = <B,>(items: Array<B>, getKey: (item: B) => string | null, getSize: (item: B) => number) => {
		setSizeCacheMap((old) => {
			let changed = false;
			items.forEach((item) => {
				const key = getKey(item);
				if (typeof key === 'string') {
					const size = Math.min(Math.max(getSize(item), minColWidth), maxColWidth);
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

	useLayoutEffect(() => {
		if (colSizeObserverRef.current) {
			const element = colSizeObserverRef.current;
			sizeCacheChangeBatch(
				Array.from(element.children),
				(node) => node.getAttribute('data-key'),
				(node) => node.getBoundingClientRect().width,
			);
		}
	}, []);

	return null;
};

export default ColSizeMeasure;
