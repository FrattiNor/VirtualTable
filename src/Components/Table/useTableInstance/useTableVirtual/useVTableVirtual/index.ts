import { useMemo, useRef, useState } from 'react';

import VirtualCore from '../Core';
import useItemSizeObserver from './useItemSizeObserver';
import useSizeCacheMap from './useSizeCacheMap';
import useThrottle from '../../../TableHooks/useThrottle';
import { type VirtualProps } from '../Core/type';

import type useTableDomRef from '../../useTableDomRef';

type Props = Omit<VirtualProps, 'onRangeChange' | 'onTotalSizeChange'> & {
	bodyRef: ReturnType<typeof useTableDomRef>['bodyRef'];
};

const useVTableVirtual = (props: Props) => {
	const lockedRef = useRef(false);
	const { throttle } = useThrottle();
	const { enabled, count, overscan, gap, getItemKey, bodyRef } = props;
	const [virtualCore, setVirtualCore] = useState(() => new VirtualCore());

	const sizeCache = useSizeCacheMap(props);
	const { measureItemRef } = useItemSizeObserver({ sizeCache, props });

	const { rangeStart, rangeEnd, totalSize, offsetTop } = useMemo(() => {
		// 更新virtualCore参数
		virtualCore.updateProps({
			gap,
			count,
			enabled,
			overscan,
			getItemKey,
			getItemSize: sizeCache.getItemSizeCover,
			onScrollOffsetChange: (offset, changed) => {
				throttle(() => {
					if (changed) {
						lockedRef.current = true;
						setVirtualCore(new VirtualCore(virtualCore));
					}
					if (lockedRef.current === false && !changed) {
						if (bodyRef.current) bodyRef.current.scrollTop = offset;
					}
					if (lockedRef.current === true && !changed) {
						console.log('offset', offset);
					}
				});
			},
			onTotalSizeChange: () => {
				throttle(() => {
					setVirtualCore(new VirtualCore(virtualCore));
				});
			},
			onRangeChange: () => {
				throttle(() => {
					setVirtualCore(new VirtualCore(virtualCore));
				});
			},
		});

		const scrollTop = virtualCore.state.scrollOffset;
		if (bodyRef.current) bodyRef.current.scrollTop = scrollTop;
		lockedRef.current = false;

		const rangeStart = virtualCore.state.rangeStart;
		const rangeEnd = virtualCore.state.rangeEnd;
		const totalSize = virtualCore.state.totalSize ?? 0;
		const offsetTop = virtualCore.state.sizeList?.[rangeStart ?? 0]?.start ?? 0;
		return { rangeStart, rangeEnd, totalSize, offsetTop };
	}, [virtualCore, enabled, count, overscan, gap, getItemKey, sizeCache.getItemSizeCover]);

	return { virtualCore, measureItemRef, rangeStart, rangeEnd, totalSize, offsetTop };
};

export default useVTableVirtual;
