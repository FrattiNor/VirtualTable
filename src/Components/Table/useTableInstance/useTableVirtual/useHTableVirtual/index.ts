import { useMemo, useRef, useState } from 'react';

import useThrottle from '../../../TableHooks/useThrottle';
import VirtualCore from '../Core';
import { type VirtualProps } from '../Core/type';

import type useTableDomRef from '../../useTableDomRef';

type Props = Omit<VirtualProps, 'onRangeChange' | 'onTotalSizeChange'> & {
	bodyRef: ReturnType<typeof useTableDomRef>['bodyRef'];
	headRef: ReturnType<typeof useTableDomRef>['headRef'];
};

const useHTableVirtual = (props: Props) => {
	const lockedRef = useRef(false);
	const { throttle } = useThrottle();
	const { enabled, count, overscan, gap, getItemKey, getItemSize, bodyRef, headRef } = props;
	const [virtualCore, setVirtualCore] = useState(() => new VirtualCore());

	return useMemo(() => {
		// 更新virtualCore参数
		virtualCore.updateProps({
			gap,
			count,
			enabled,
			overscan,
			getItemKey,
			getItemSize,
			onScrollOffsetChange: (offset, changed) => {
				throttle(() => {
					if (changed) {
						lockedRef.current = true;
						setVirtualCore(new VirtualCore(virtualCore));
					}
					if (lockedRef.current === false && !changed) {
						if (bodyRef.current) bodyRef.current.scrollLeft = offset;
						if (headRef.current) headRef.current.scrollLeft = offset;
					}
				});
			},
			onTotalSizeChange: () => {
				throttle(() => {
					lockedRef.current = true;
					setVirtualCore(new VirtualCore(virtualCore));
				});
			},
			onRangeChange: () => {
				throttle(() => {
					lockedRef.current = true;
					setVirtualCore(new VirtualCore(virtualCore));
				});
			},
		});

		const scrollLeft = virtualCore.state.scrollOffset;
		if (bodyRef.current) bodyRef.current.scrollLeft = scrollLeft;
		if (headRef.current) headRef.current.scrollLeft = scrollLeft;
		lockedRef.current = false;

		const rangeStart = virtualCore.state.rangeStart;
		const rangeEnd = virtualCore.state.rangeEnd;
		return { virtualCore, rangeStart, rangeEnd };
	}, [virtualCore, enabled, count, overscan, gap, getItemKey, getItemSize]);
};

export default useHTableVirtual;
