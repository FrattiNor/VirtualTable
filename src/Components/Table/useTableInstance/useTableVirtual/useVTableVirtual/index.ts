import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import VirtualCore from '../Core';
import useItemSizeObserver from './useItemSizeObserver';
import useSizeCacheMap from './useSizeCacheMap';
import useAnimationThrottle from '../../../TableHooks/useAnimationThrottle';
import { type VirtualProps } from '../Core/type';

import type useTableDomRef from '../../useTableDomRef';

type Props = Omit<VirtualProps, 'onChange'> & {
	bodyRef: ReturnType<typeof useTableDomRef>['bodyRef'];
};

const useVTableVirtual = (props: Props) => {
	const { enabled, count, overscan, gap, getItemKey, bodyRef } = props;

	const sizeCache = useSizeCacheMap(props);
	const { throttle } = useAnimationThrottle();
	const getItemSize = sizeCache.getItemSizeCover;
	const { measureItemRef } = useItemSizeObserver({ sizeCache, props });
	const [virtualCore, setVirtualCore] = useState(() => {
		const core = new VirtualCore();
		core.updateProps({ gap, count, enabled, overscan, getItemKey, getItemSize });
		return core;
	});
	const onChange = useCallback(() => throttle(() => setVirtualCore(new VirtualCore(virtualCore))), []);

	useEffect(() => {
		virtualCore.updateProps({ gap, count, enabled, overscan, onChange, getItemKey, getItemSize });
	}, [enabled, count, overscan, gap, getItemKey, getItemSize, onChange]);

	useLayoutEffect(() => {
		const scrollOffset = virtualCore.state.scrollOffset;
		if (bodyRef.current && bodyRef.current.scrollTop !== scrollOffset) bodyRef.current.scrollTop = scrollOffset;
	}, [virtualCore.state.scrollOffset]);

	const rangeStart = virtualCore.state.rangeStart;
	const rangeEnd = virtualCore.state.rangeEnd;
	const totalSize = virtualCore.state.totalSize ?? 0;
	const sizeList = virtualCore.state.sizeList;

	return { virtualCore, measureItemRef, rangeStart, rangeEnd, totalSize, sizeList };
};

export default useVTableVirtual;
