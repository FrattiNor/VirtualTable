import { useMemo, useState } from 'react';

import useItemSizeObserver from './useItemSizeObserver';
import useSizeCacheMap from './useSizeCacheMap';
import useFrameThrottle from '../../../../TableHooks/useFrameThrottle';
import VirtualCore from '../../Core';
import { type VirtualProps } from '../../Core/type';

import type useTableDomRef from '../../../useTableDomRef';

type Props = Omit<VirtualProps, 'onChange'> & {
	bodyRef: ReturnType<typeof useTableDomRef>['bodyRef'];
};

const useVVirtualCore = (props: Props) => {
	const { enabled, count, overscan, gap, getItemKey, bodyRef } = props;

	const { throttle } = useFrameThrottle();
	const sizeCache = useSizeCacheMap(props);
	const getItemSize = sizeCache.getItemSizeCover;
	const { measureItemSize } = useItemSizeObserver({ sizeCache });
	const [virtualCore, setVirtualCore] = useState(() => new VirtualCore());

	useMemo(() => {
		virtualCore.updateProps({
			keyName: 'row key',
			gap,
			count,
			enabled,
			overscan,
			getItemKey,
			getItemSize,
			onChange: () => throttle(() => setVirtualCore(new VirtualCore(virtualCore))),
		});
		return null;
	}, [enabled, count, overscan, gap, getItemKey, getItemSize]);

	const scrollOffset = virtualCore.state.scrollOffset;
	const rangeStart = virtualCore.state.rangeStart;
	const rangeEnd = virtualCore.state.rangeEnd;
	const totalSize = virtualCore.state.totalSize ?? 0;
	const sizeList = virtualCore.state.sizeList;

	useMemo(() => {
		if (bodyRef.current && bodyRef.current.scrollTop !== scrollOffset) bodyRef.current.scrollTop = scrollOffset;
	}, [scrollOffset]);

	return { virtualCore, rangeStart, rangeEnd, totalSize, sizeList, measureItemSize };
};

export default useVVirtualCore;
