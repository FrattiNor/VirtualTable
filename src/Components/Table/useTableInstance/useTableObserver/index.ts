import { useEffect, useLayoutEffect } from 'react';

import { useScrollBy } from './useScroll';
import useFrameDebounce from '../../TableHooks/useFrameDebounce';
import calcBorderWidth from '../../TableUtils/calcBorderWidth';

import type useTableDomRef from '../useTableDomRef';
import type useTableState from '../useTableState';
import type useTableVirtual from '../useTableVirtual';

type Props<T> = {
	tableState: ReturnType<typeof useTableState>;
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableVirtual: ReturnType<typeof useTableVirtual<T>>;
};

const useTableObserver = <T>({ tableState, tableVirtual, tableDomRef }: Props<T>) => {
	const { headRef, bodyRef, bodyInnerRef, hScrollbarRef, vScrollbarRef } = tableDomRef;

	const { debounce } = useFrameDebounce();
	const scrollByTop = useScrollBy('scrollTop');
	const scrollByLeft = useScrollBy('scrollLeft');
	const { getH_virtualCore, getV_virtualCore } = tableVirtual;
	const { setV_scrollbar, setH_scrollbar, setTableWidth } = tableState;

	useLayoutEffect(() => {
		if (bodyRef.current && bodyInnerRef.current) {
			const body = bodyRef.current;
			const bodyInner = bodyInnerRef.current;

			// === ob body content resize ===
			const calcObserver = (entries?: ResizeObserverEntry[]) => {
				getH_virtualCore().updateContainerSize(body.clientWidth);
				getV_virtualCore().updateContainerSize(body.clientHeight);

				const hScrollbarHave = bodyInner.clientWidth > 0 && body.clientWidth > 0 && bodyInner.clientWidth > body.clientWidth;
				const vScrollbarHave = bodyInner.clientHeight > 0 && body.clientHeight > 0 && bodyInner.clientHeight > body.clientHeight;
				if (!entries) {
					const { calcDom, hScrollbarWidth, vScrollbarWidth } = calcBorderWidth(body);
					// 保存state
					setV_scrollbar((old) => {
						const next = { have: vScrollbarHave, width: vScrollbarWidth, innerSize: bodyInner.clientHeight };
						if (next.have !== old.have || next.width !== old.width || next.innerSize !== old.innerSize) {
							return next;
						}
						setTableWidth(next.have ? body.clientWidth + next.width : body.clientWidth);
						return old;
					});
					setH_scrollbar((old) => {
						const next = { have: hScrollbarHave, width: hScrollbarWidth, innerSize: bodyInner.clientWidth };
						if (next.have !== old.have || next.width !== old.width || next.innerSize !== old.innerSize) {
							return next;
						}
						return old;
					});
					// 从DOM中移除临时元素
					calcDom.parentNode?.removeChild(calcDom);
				} else {
					debounce(() => {
						setV_scrollbar((old) => {
							const next = { ...old, have: vScrollbarHave, innerSize: bodyInner.clientHeight };
							if (next.have !== old.have || next.width !== old.width || next.innerSize !== old.innerSize) {
								return next;
							}
							setTableWidth(next.have ? body.clientWidth + next.width : body.clientWidth);
							return old;
						});
						setH_scrollbar((old) => {
							const next = { ...old, have: hScrollbarHave, innerSize: bodyInner.clientWidth };
							if (next.have !== old.have || next.width !== old.width || next.innerSize !== old.innerSize) {
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
				const scrollDistance = scrollCoefficient * 167;
				if (e.shiftKey === true) {
					if (hScrollbarRef.current) {
						scrollByLeft({ el: hScrollbarRef.current, offset: scrollDistance, duration: 167 });
					}
				} else {
					if (vScrollbarRef.current) {
						scrollByTop({ el: vScrollbarRef.current, offset: scrollDistance, duration: 167 });
					}
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
				const scrollDistance = scrollCoefficient * 167;
				if (e.shiftKey === true) {
					if (hScrollbarRef.current) {
						scrollByLeft({ el: hScrollbarRef.current, offset: scrollDistance, duration: 167 });
					}
				} else {
					if (vScrollbarRef.current) {
						scrollByTop({ el: vScrollbarRef.current, offset: scrollDistance, duration: 167 });
					}
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
