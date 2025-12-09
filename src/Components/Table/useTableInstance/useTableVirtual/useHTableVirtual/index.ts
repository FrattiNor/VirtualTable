import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

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
		if (bodyRef.current && bodyRef.current.scrollLeft !== scrollOffset) bodyRef.current.scrollLeft = scrollOffset;
		if (headRef.current && headRef.current.scrollLeft !== scrollOffset) headRef.current.scrollLeft = scrollOffset;
	}, [virtualCore.state.scrollOffset]);

	const rangeStart = virtualCore.state.rangeStart;
	const rangeEnd = virtualCore.state.rangeEnd;

	return { virtualCore, rangeStart, rangeEnd };
};

export default useHTableVirtual;
