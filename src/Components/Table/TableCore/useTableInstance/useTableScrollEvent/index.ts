import { useEffect, useRef } from 'react';

import { type RowKeyType } from '../../TableTypes/type';

import type useTableDomRef from '../useTableDomRef';
import type useTableState from '../useTableState';
import type useTableVirtual from '../useTableVirtual';

type Props<T, K, S> = {
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableState: ReturnType<typeof useTableState<T, K, S>>;
	tableVirtual: ReturnType<typeof useTableVirtual<T, K, S>>;
};

// 监听滚动条scrollEvent
// 监听body scrollEvent
const useTableScrollEvent = <T, K = RowKeyType, S = any>({ tableState, tableVirtual, tableDomRef }: Props<T, K, S>) => {
	const { vScrollbarState, hScrollbarState } = tableState;
	const { getH_virtualCore, getV_virtualCore } = tableVirtual;
	const { bodyWrapperRef, vScrollbarRef, hScrollbarRef } = tableDomRef;

	// 当前鼠标enter，避免相互触发scrollEvent
	const mouseEnterRef = useRef<null | 'bodyWrapper' | 'scrollbarV' | 'scrollbarH'>(null);

	// 横向滚动条scrollEvent监听
	useEffect(() => {
		const hScrollbar = hScrollbarRef.current;
		const bodyWrapper = bodyWrapperRef.current;
		if (hScrollbarState.have && hScrollbar && bodyWrapper) {
			// 同步一次滚动距离
			if (bodyWrapper && hScrollbar.scrollLeft !== bodyWrapper.scrollLeft) {
				hScrollbar.scrollLeft = bodyWrapper.scrollLeft;
			}

			const handleEnter = () => {
				mouseEnterRef.current = 'scrollbarH';
			};

			const handleLeave = () => {
				mouseEnterRef.current = null;
			};

			const handleScroll = () => {
				if (mouseEnterRef.current === 'scrollbarH' || mouseEnterRef.current === null) {
					if (bodyWrapper.scrollLeft !== hScrollbar.scrollLeft) bodyWrapper.scrollLeft = hScrollbar.scrollLeft;
					getH_virtualCore().updateScrollOffset(hScrollbar.scrollLeft);
				}
			};

			hScrollbar.addEventListener('mouseenter', handleEnter);
			hScrollbar.addEventListener('mouseleave', handleLeave);
			hScrollbar.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				getH_virtualCore().updateScrollOffset(0);
				hScrollbar.removeEventListener('mouseenter', handleEnter);
				hScrollbar.removeEventListener('mouseleave', handleLeave);
				hScrollbar.removeEventListener('scroll', handleScroll);
			};
		}
	}, [hScrollbarState.have]);

	// 纵向滚动条scrollEvent监听
	useEffect(() => {
		const vScrollbar = vScrollbarRef.current;
		const bodyWrapper = bodyWrapperRef.current;
		if (vScrollbarState.have && vScrollbar && bodyWrapper) {
			// 同步一次滚动距离
			if (bodyWrapper && vScrollbar.scrollTop !== bodyWrapper.scrollTop) {
				vScrollbar.scrollTop = bodyWrapper.scrollTop;
			}

			const handleEnter = () => {
				mouseEnterRef.current = 'scrollbarV';
			};

			const handleLeave = () => {
				mouseEnterRef.current = null;
			};

			const handleScroll = () => {
				if (mouseEnterRef.current === 'scrollbarV' || mouseEnterRef.current === null) {
					if (bodyWrapper.scrollTop !== vScrollbar.scrollTop) bodyWrapper.scrollTop = vScrollbar.scrollTop;
					getV_virtualCore().updateScrollOffset(vScrollbar.scrollTop);
				}
			};

			vScrollbar.addEventListener('mouseenter', handleEnter);
			vScrollbar.addEventListener('mouseleave', handleLeave);
			vScrollbar.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				getV_virtualCore().updateScrollOffset(0);
				vScrollbar.removeEventListener('mouseenter', handleEnter);
				vScrollbar.removeEventListener('mouseleave', handleLeave);
				vScrollbar.removeEventListener('scroll', handleScroll);
			};
		}
	}, [vScrollbarState.have]);

	// bodyWrapper scrollEvent监听
	useEffect(() => {
		const bodyWrapper = bodyWrapperRef.current;
		if (bodyWrapper) {
			const handleEnter = () => {
				mouseEnterRef.current = 'bodyWrapper';
			};

			const handleLeave = () => {
				mouseEnterRef.current = null;
			};

			const handleScroll = () => {
				if (mouseEnterRef.current === 'bodyWrapper' || mouseEnterRef.current === null) {
					if (vScrollbarRef.current && vScrollbarRef.current.scrollTop !== bodyWrapper.scrollTop)
						vScrollbarRef.current.scrollTop = bodyWrapper.scrollTop;
					if (hScrollbarRef.current && hScrollbarRef.current.scrollLeft !== bodyWrapper.scrollLeft)
						hScrollbarRef.current.scrollLeft = bodyWrapper.scrollLeft;
					getV_virtualCore().updateScrollOffset(bodyWrapper.scrollTop);
					getH_virtualCore().updateScrollOffset(bodyWrapper.scrollLeft);
				}
			};

			bodyWrapper.addEventListener('mouseenter', handleEnter);
			bodyWrapper.addEventListener('mouseleave', handleLeave);
			bodyWrapper.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				bodyWrapper.removeEventListener('mouseenter', handleEnter);
				bodyWrapper.removeEventListener('mouseleave', handleLeave);
				bodyWrapper.removeEventListener('scroll', handleScroll);
			};
		}
	}, []);
};

export default useTableScrollEvent;
