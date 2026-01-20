import { useEffect, useLayoutEffect } from 'react';

import { useVirtualScroll } from './useScroll';
import useSetTimeoutDebounce from '../../TableHooks/useSetTimeoutDebounce';
import { getDisplayNone } from '../../TableUtils';
import calcBorderWidth from '../../TableUtils/calcBorderWidth';

import type useTableDomRef from '../useTableDomRef';
import type useTableState from '../useTableState';
import type useTableVirtual from '../useTableVirtual';

// 滚动时间
const _scrollDuration = 167;
// 滚动距离
const _scrollDistance = 167;

type Props<T> = {
	tableState: ReturnType<typeof useTableState>;
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableVirtual: ReturnType<typeof useTableVirtual<T>>;
};

const useTableObserver = <T>({ tableState, tableVirtual, tableDomRef }: Props<T>) => {
	const { headRef, bodyRef, bodyInnerRef, hScrollbarRef, vScrollbarRef } = tableDomRef;

	const { debounce } = useSetTimeoutDebounce();
	const { getH_virtualCore, getV_virtualCore } = tableVirtual;
	const { setV_scrollbar, setH_scrollbar, setTableWidth } = tableState;
	const scrollByTop = useVirtualScroll('scrollTop', () => vScrollbarRef.current);
	const scrollByLeft = useVirtualScroll('scrollLeft', () => hScrollbarRef.current);

	useLayoutEffect(() => {
		const body = bodyRef.current;
		const bodyInner = bodyInnerRef.current;
		const bodyWrapper = bodyRef.current?.parentElement;

		if (body && bodyInner && bodyWrapper) {
			// === ob body content resize ===
			const calcObserver = (entries?: ResizeObserverEntry[]) => {
				// display none的情况直接跳过执行
				if (entries && getDisplayNone(entries[0].contentRect)) return;
				// TODO BUG 如果display none时缩放导致的resize将导致无法更新scrollbar宽度，对于原生滚动条将会产生影响
				if (!entries && getDisplayNone(body.getBoundingClientRect())) return;
				// 更新Virtual的ContainerSize
				getH_virtualCore().updateContainerSize(body.clientWidth);
				getV_virtualCore().updateContainerSize(body.clientHeight);
				// 获取滚动条是否存在
				const hScrollbarHave = bodyInner.clientWidth > 0 && body.clientWidth > 0 && bodyInner.clientWidth > body.clientWidth;
				const vScrollbarHave = bodyInner.clientHeight > 0 && body.clientHeight > 0 && bodyInner.clientHeight > body.clientHeight;
				// 不存在entries，为直接调用
				if (!entries) {
					// 通过插入临时元素计算scrollBarWidth
					const { calcDom, hScrollbarWidth, vScrollbarWidth } = calcBorderWidth(body);
					setTableWidth(bodyWrapper.clientWidth);
					setV_scrollbar((old) => {
						const next = { have: vScrollbarHave, width: vScrollbarWidth };
						if (next.have !== old.have || next.width !== old.width) {
							return next;
						}
						return old;
					});
					setH_scrollbar((old) => {
						const next = { have: hScrollbarHave, width: hScrollbarWidth };
						if (next.have !== old.have || next.width !== old.width) {
							return next;
						}
						return old;
					});
					// 从DOM中移除临时元素
					calcDom.parentNode?.removeChild(calcDom);
				} else {
					setTableWidth(bodyWrapper.clientWidth);
					setV_scrollbar((old) => {
						const next = { ...old, have: vScrollbarHave };
						if (next.have !== old.have || next.width !== old.width) {
							return next;
						}
						return old;
					});
					debounce(() => {
						setH_scrollbar((old) => {
							const next = { ...old, have: hScrollbarHave };
							if (next.have !== old.have || next.width !== old.width) {
								return next;
							}
							return old;
						});
					});
				}
			};

			// 直接执行一次
			calcObserver();
			const ob = new ResizeObserver(calcObserver);
			ob.observe(body, { box: 'border-box' });
			ob.observe(bodyInner, { box: 'border-box' });
			// 如果没有浏览器滚动条样式，缩放会导致浏览器滚动条大小变更
			const onResize = () => calcObserver();
			window.addEventListener('resize', onResize);

			return () => {
				ob.disconnect();
				window.removeEventListener('resize', onResize);
			};
		}
	}, []);

	useEffect(() => {
		if (bodyRef.current) {
			const body = bodyRef.current;
			const handleWheel = (e: WheelEvent) => {
				const scrollCoefficient = -(((e as any).wheelDeltaY as number) ?? -e.deltaY) > 0 ? 1 : -1;
				const scrollDistance = scrollCoefficient * _scrollDistance;
				if (e.shiftKey === true) {
					scrollByLeft({ offset: scrollDistance, duration: _scrollDuration });
				} else {
					scrollByTop({ offset: scrollDistance, duration: _scrollDuration });
				}
			};
			body.addEventListener('wheel', handleWheel, { passive: true });

			return () => {
				body.removeEventListener('wheel', handleWheel);
			};
		}
	}, []);

	useEffect(() => {
		if (headRef.current) {
			const head = headRef.current;
			const handleWheel = (e: WheelEvent) => {
				const scrollCoefficient = -(((e as any).wheelDeltaY as number) ?? -e.deltaY) > 0 ? 1 : -1;
				const scrollDistance = scrollCoefficient * _scrollDistance;
				if (e.shiftKey === true) {
					scrollByLeft({ offset: scrollDistance, duration: _scrollDuration });
				} else {
					scrollByTop({ offset: scrollDistance, duration: _scrollDuration });
				}
			};
			head.addEventListener('wheel', handleWheel, { passive: true });

			return () => {
				head.removeEventListener('wheel', handleWheel);
			};
		}
	}, []);
};

export default useTableObserver;
