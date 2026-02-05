import { useMemo, useState } from 'react';

import useFrameThrottle from '../../../../TableHooks/useFrameThrottle';
import VirtualCore from '../../Core';
import { type VirtualProps } from '../../Core/type';

import type useTableDomRef from '../../../useTableDomRef';

type Props = Omit<VirtualProps, 'onChange'> & {
	bodyRef: ReturnType<typeof useTableDomRef>['bodyRef'];
	headRef: ReturnType<typeof useTableDomRef>['headRef'];
	summaryRef: ReturnType<typeof useTableDomRef>['headRef'];
};

const useHVirtualCore = (props: Props) => {
	const { enabled, count, overscan, gap, getItemKey, getItemSize, bodyRef, headRef, summaryRef } = props;

	const { throttle } = useFrameThrottle();
	const [virtualCore, setVirtualCore] = useState<VirtualCore>(() => new VirtualCore());

	useMemo(() => {
		virtualCore.updateProps({
			keyName: 'col key',
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

	const rangeEnd = virtualCore.state.rangeEnd;
	const rangeStart = virtualCore.state.rangeStart;
	const scrollOffset = virtualCore.state.scrollOffset;
	// 通过observer计算出来的子size之和可能会超出父元素，执行Math.round避免这个问题
	const totalSize = Math.floor(virtualCore.state.totalSize ?? 0);

	useMemo(() => {
		if (bodyRef.current && bodyRef.current.scrollLeft !== scrollOffset) bodyRef.current.scrollLeft = scrollOffset;
		if (headRef.current && headRef.current.scrollLeft !== scrollOffset) headRef.current.scrollLeft = scrollOffset;
		if (summaryRef.current && summaryRef.current.scrollLeft !== scrollOffset) summaryRef.current.scrollLeft = scrollOffset;
	}, [scrollOffset]);

	return { virtualCore, rangeStart, rangeEnd, totalSize };
};

export default useHVirtualCore;
