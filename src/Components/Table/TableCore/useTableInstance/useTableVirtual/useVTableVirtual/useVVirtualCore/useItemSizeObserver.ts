import { useRef, useEffect, useCallback } from 'react';

import useRefValue from '../../../../TableHooks/useRefValue';
import { getDisplayNone } from '../../../../TableUtils/index';

import type useSizeCacheMap from './useSizeCacheMap';

type Props = {
	sizeCache: ReturnType<typeof useSizeCacheMap>;
};

const useItemSizeObserver = ({ sizeCache }: Props) => {
	const itemSizeObserverRef = useRef<ResizeObserver | null>(null);
	const [getUpdateItemSize] = useRefValue(sizeCache.updateItemSize);

	const getItemSizeObserver = useCallback(() => {
		if (itemSizeObserverRef.current === null) {
			itemSizeObserverRef.current = new ResizeObserver((entries) => {
				// display none的情况直接跳过执行
				if (getDisplayNone(entries[0].contentRect)) return;
				entries.forEach((entry) => {
					const index = parseInt(entry.target.getAttribute('data-index') ?? '');
					if (!isNaN(index)) {
						const size = entry.contentRect['height'];
						getUpdateItemSize()({ index, size, from: 'resize' });
					}
				});
			});
		}
		return itemSizeObserverRef.current;
	}, []);

	// 清除itemSize Observer
	useEffect(() => {
		return () => {
			if (itemSizeObserverRef.current) itemSizeObserverRef.current.disconnect();
		};
	}, []);

	// 用于测量itemSize，在不定高情况使用
	const measureItemSize = useCallback((index: number, node: HTMLElement) => {
		getUpdateItemSize()({ size: node['clientHeight'], index, from: 'ref' });
		getItemSizeObserver().observe(node);
		return () => {
			getItemSizeObserver().unobserve(node);
		};
	}, []);

	return { measureItemSize };
};

export default useItemSizeObserver;
