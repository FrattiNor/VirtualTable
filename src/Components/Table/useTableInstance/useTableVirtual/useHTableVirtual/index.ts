import { useLayoutEffect, useMemo, useState } from 'react';

import useFrameThrottle from '../../../TableHooks/useFrameThrottle';
import VirtualCore from '../Core';
import { type VirtualProps } from '../Core/type';

import type useTableDomRef from '../../useTableDomRef';

type Props = Omit<VirtualProps, 'onChange'> & {
	bodyRef: ReturnType<typeof useTableDomRef>['bodyRef'];
	headRef: ReturnType<typeof useTableDomRef>['headRef'];
};

const useHTableVirtual = (props: Props) => {
	const { enabled, count, overscan, gap, getItemKey, getItemSize, bodyRef, headRef } = props;

	const { throttle } = useFrameThrottle();
	const [virtualCore, setVirtualCore] = useState<VirtualCore>(() => new VirtualCore());

	useLayoutEffect(() => {
		const scrollOffset = virtualCore.state.scrollOffset;
		if (bodyRef.current && bodyRef.current.scrollLeft !== scrollOffset) bodyRef.current.scrollLeft = scrollOffset;
		if (headRef.current && headRef.current.scrollLeft !== scrollOffset) headRef.current.scrollLeft = scrollOffset;
	}, [virtualCore.state.scrollOffset]);

	useMemo(() => {
		virtualCore.updateProps({
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

	const rangeStart = virtualCore.state.rangeStart;
	const rangeEnd = virtualCore.state.rangeEnd;

	return { virtualCore, rangeStart, rangeEnd };
};

export default useHTableVirtual;
