import { startTransition, useMemo, useState } from 'react';

import VirtualCore from '../Core';
import useItemSizeObserver from './useItemSizeObserver';
import useSizeCacheMap from './useSizeCacheMap';
import { type VirtualProps } from '../Core/type';

type Props = Omit<VirtualProps, 'onRangeChange' | 'onTotalSizeChange'>;

const useVTableVirtual = (props: Props) => {
	const { enabled, count, overscan, gap, getItemKey } = props;
	const [virtualCore, setVirtualCore] = useState(() => new VirtualCore());

	const sizeCache = useSizeCacheMap(props);
	const { measureItemRef } = useItemSizeObserver(sizeCache);

	const { rangeStart, rangeEnd, totalSize, offsetTop } = useMemo(() => {
		// 更新virtualCore参数
		virtualCore.updateProps({
			gap,
			count,
			enabled,
			overscan,
			getItemKey,
			getItemSize: sizeCache.getItemSizeCover,
			onTotalSizeChange: () => {
				startTransition(() => {
					setVirtualCore(new VirtualCore(virtualCore));
				});
			},
			onRangeChange: () => {
				startTransition(() => {
					setVirtualCore(new VirtualCore(virtualCore));
				});
				// if (isScroll) {
				// 	flushSync(() => setVirtualCore(new VirtualCore(virtualCore)));
				// } else {
				// 	setVirtualCore(new VirtualCore(virtualCore));
				// }
			},
		});

		const rangeStart = virtualCore.state.rangeStart;
		const rangeEnd = virtualCore.state.rangeEnd;
		const totalSize = virtualCore.state.totalSize ?? 0;
		const offsetTop = virtualCore.state.sizeList?.[rangeStart ?? 0]?.start ?? 0;
		return { rangeStart, rangeEnd, totalSize, offsetTop };
	}, [virtualCore, enabled, count, overscan, gap, getItemKey, sizeCache.getItemSizeCover]);

	return { virtualCore, measureItemRef, rangeStart, rangeEnd, totalSize, offsetTop };
};

export default useVTableVirtual;
