import { useCallback, useEffect, useMemo, useState } from 'react';

import { type VirtualProps } from '../../Core/type';

type Props = Omit<VirtualProps, 'onChange'>;

const useSizeCacheMap = ({ getItemKey, getItemSize, count }: Props) => {
	// itemSize缓存
	const [sizeCacheMap, setSizeCacheMap] = useState(() => new Map<string, number>());

	// 重写getItemSize，优先使用size缓存
	const getItemSizeCover = useCallback(
		(index: number) => {
			const key = getItemKey(index);
			const cacheSize = sizeCacheMap.get(key);
			if (typeof cacheSize === 'number') return cacheSize;
			return getItemSize(index);
		},
		[getItemKey, getItemSize, sizeCacheMap],
	);

	// 更新itemSize
	const updateItemSize = useCallback(
		({ index, size }: { index: number; size: number; from: string }) => {
			setSizeCacheMap((old) => {
				const key = getItemKey(index);
				if (size !== getItemSize(index) && size !== old.get(key)) {
					old.set(key, size);
					return new Map(old);
				}
				if (size === getItemSize(index) && old.get(key) !== undefined) {
					old.delete(key);
					return new Map(old);
				}
				return old;
			});
		},
		[getItemKey, getItemSize],
	);

	// 数据源keyMap
	const datasourceKeyMap = useMemo(() => {
		const keyMap = new Map<string, true>();
		for (let i = 0; i < count; i++) {
			keyMap.set(getItemKey(i), true);
		}
		return keyMap;
	}, [count, getItemKey]);

	// 当数据源变更时，清除不存在的keyCache
	useEffect(() => {
		let changed = false;
		Array.from(sizeCacheMap).forEach(([key]) => {
			if (datasourceKeyMap.get(key) !== true) {
				sizeCacheMap.delete(key);
				changed = true;
			}
		});
		if (changed) {
			setSizeCacheMap(new Map(sizeCacheMap));
		}
	}, [datasourceKeyMap, sizeCacheMap]);

	return { getItemSizeCover, updateItemSize };
};

export default useSizeCacheMap;
