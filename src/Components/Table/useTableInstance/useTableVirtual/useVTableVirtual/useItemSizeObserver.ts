import { useRef, useEffect, useCallback } from 'react';

import useRefValue from '../../../TableHooks/useRefValue';

import type useSizeCacheMap from './useSizeCacheMap';

const useItemSizeObserver = (props: ReturnType<typeof useSizeCacheMap>) => {
	const itemSizeObserverRef = useRef<ResizeObserver | null>(null);

	const [getUpdateItemSize] = useRefValue(props.updateItemSize);

	const getItemSizeObserver = () => {
		if (itemSizeObserverRef.current === null) {
			itemSizeObserverRef.current = new ResizeObserver((entries) => {
				entries.forEach((item) => {
					const index = parseInt(item.target.getAttribute('data-index') ?? '');
					if (!isNaN(index)) {
						const size = item.contentRect['height'];
						getUpdateItemSize()({ index, size, from: 'resize' });
					}
				});
			});
		}
		return itemSizeObserverRef.current;
	};

	// 清除itemSize Observer
	useEffect(() => {
		return () => {
			if (itemSizeObserverRef.current) itemSizeObserverRef.current.disconnect();
		};
	}, []);

	// 用于测量itemSize，在不定高情况使用
	// warning 【StrictMode会影响此运行，导致动态监测高度失效】
	const measureItemRef = useCallback((index: number, node: HTMLElement | null) => {
		if (node) {
			const size = node['clientHeight'];
			getUpdateItemSize()({ index, size, from: 'ref' });
			getItemSizeObserver().observe(node);
			return () => {
				getItemSizeObserver().unobserve(node);
			};
		}
	}, []);

	return { measureItemRef };
};

export default useItemSizeObserver;
