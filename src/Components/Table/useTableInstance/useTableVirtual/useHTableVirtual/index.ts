import { startTransition, useMemo, useState } from 'react';

import VirtualCore from '../Core';
import { type VirtualProps } from '../Core/type';

type Props = Omit<VirtualProps, 'onRangeChange' | 'onTotalSizeChange'>;

const useHTableVirtual = (props: Props) => {
	const { enabled, count, overscan, gap, getItemKey, getItemSize } = props;
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
		return { virtualCore, rangeStart, rangeEnd };
	}, [virtualCore, enabled, count, overscan, gap, getItemKey, getItemSize]);
};

export default useHTableVirtual;
