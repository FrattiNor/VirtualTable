import { useMemo, useState } from 'react';

import useFrameThrottle from '../../../../TableHooks/useFrameThrottle';
import VirtualCore from '../../Core';
import { type VirtualProps } from '../../Core/type';

import type useTableDomRef from '../../../useTableDomRef';

type Props = Omit<VirtualProps, 'onChange'> & {
	bodyRef: ReturnType<typeof useTableDomRef>['bodyRef'];
	headRef: ReturnType<typeof useTableDomRef>['headRef'];
};

const useHVirtualCore = (props: Props) => {
	const { enabled, count, overscan, gap, getItemKey, getItemSize, bodyRef, headRef } = props;

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
	const totalSize = virtualCore.state.totalSize ?? 0;
	const rangeStart = virtualCore.state.rangeStart;
	const scrollOffset = virtualCore.state.scrollOffset;

	useMemo(() => {
		if (bodyRef.current && bodyRef.current.scrollLeft !== scrollOffset) bodyRef.current.scrollLeft = scrollOffset;
		if (headRef.current && headRef.current.scrollLeft !== scrollOffset) headRef.current.scrollLeft = scrollOffset;
	}, [scrollOffset]);

	return { virtualCore, rangeStart, rangeEnd, totalSize };
};

export default useHVirtualCore;
