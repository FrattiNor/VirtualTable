import { useEffect, useLayoutEffect } from 'react';

import { useVirtualScroll } from './useScroll';
import { type RowKeyType } from '../../TableTypes/type';
import { getDisplayNone } from '../../TableUtils';
import calcBorderWidth from '../../TableUtils/calcBorderWidth';

import type useTableDomRef from '../useTableDomRef';
import type useTableInnerProps from '../useTableInnerProps';
import type useTableState from '../useTableState';
import type useTableVirtual from '../useTableVirtual';

// 滚动时间
const _scrollDuration = 167;
// 滚动距离
const _scrollDistance = 167;

type Props<T, K, S> = {
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableState: ReturnType<typeof useTableState<T, K, S>>;
	tableVirtual: ReturnType<typeof useTableVirtual<T, K, S>>;
	tableInnerProps: ReturnType<typeof useTableInnerProps<T, K, S>>;
};

const useTableObserver = <T, K = RowKeyType, S = any>({ tableState, tableVirtual, tableDomRef, tableInnerProps }: Props<T, K, S>) => {
	const { showSummary } = tableInnerProps;
	const { headRef, bodyRef, bodyInnerRef, summaryRef, hScrollbarRef, vScrollbarRef, colSizeObserverRef } = tableDomRef;

	const { getH_virtualCore, getV_virtualCore } = tableVirtual;
	const { setV_scrollbar, setH_scrollbar, setTableWidth } = tableState;
	const scrollByTop = useVirtualScroll('scrollTop', () => vScrollbarRef.current);
	const scrollByLeft = useVirtualScroll('scrollLeft', () => hScrollbarRef.current);

	useLayoutEffect(() => {
		const body = bodyRef.current;
		const bodyInner = bodyInnerRef.current;
		const colMeasure = colSizeObserverRef.current;
		const bodyWrapper = bodyRef.current?.parentElement;

		if (body && bodyInner && bodyWrapper && colMeasure) {
			// 获取滚动条状态
			const getScrollbarState = () => {
				// 获取横向滚动条是否存在【判定逻辑由colMeasure的宽度判定】
				const hScrollbarHave = bodyInner.clientWidth > body.clientWidth && colMeasure.scrollWidth > colMeasure.clientWidth;
				// 获取纵向滚动条是否存在【判定逻辑由body和bodyInner的高度判定】
				const vScrollbarHave = bodyInner.clientHeight > body.clientHeight;

				return { hScrollbarHave, vScrollbarHave };
			};

			// 更新virtualCore的ContainerSize
			const updateContainerSize = () => {
				getH_virtualCore().updateContainerSize(body.clientWidth);
				getV_virtualCore().updateContainerSize(body.clientHeight);
			};

			// 直接执行函数/window resize函数
			const calc = () => {
				// display none的情况直接跳过执行
				// TODO BUG 如果display none时缩放导致的resize将导致无法更新scrollbar宽度，对于原生滚动条将会产生影响
				if (getDisplayNone(body.getBoundingClientRect())) return;
				// 更新virtualCore的ContainerSize
				updateContainerSize();
				// 获取滚动条状态
				const { hScrollbarHave, vScrollbarHave } = getScrollbarState();
				// 通过插入临时元素计算scrollBarWidth
				const { hScrollbarWidth, vScrollbarWidth } = calcBorderWidth(body);
				// 更新state
				setTableWidth(bodyWrapper.clientWidth);
				// 更新state
				setV_scrollbar((old) => {
					const next = { have: vScrollbarHave, width: vScrollbarWidth };
					if (next.have !== old.have || next.width !== old.width) {
						return next;
					}
					return old;
				});
				// 更新state
				setH_scrollbar((old) => {
					const next = { have: hScrollbarHave, width: hScrollbarWidth };
					if (next.have !== old.have || next.width !== old.width) {
						return next;
					}
					return old;
				});
			};

			// ResizeObserver 执行函数
			const calcObserver = (entries: ResizeObserverEntry[]) => {
				// display none的情况直接跳过执行
				if (entries && getDisplayNone(entries[0].contentRect)) return;
				// 更新virtualCore的ContainerSize
				updateContainerSize();
				// 获取滚动条状态
				const { hScrollbarHave, vScrollbarHave } = getScrollbarState();
				// 更新state
				setTableWidth(bodyWrapper.clientWidth);
				// 更新state
				setV_scrollbar((old) => {
					const next = { ...old, have: vScrollbarHave };
					if (next.have !== old.have || next.width !== old.width) {
						return next;
					}
					return old;
				});
				// 更新state
				setH_scrollbar((old) => {
					const next = { ...old, have: hScrollbarHave };
					if (next.have !== old.have || next.width !== old.width) {
						return next;
					}
					return old;
				});
			};

			// 直接执行一次计算
			calc();
			// 增加resize监听
			const ob = new ResizeObserver(calcObserver);
			// 监听body resize
			ob.observe(body, { box: 'border-box' });
			// 监听bodyInner resize
			ob.observe(bodyInner, { box: 'border-box' });
			// 监听window resize
			window.addEventListener('resize', calc);

			return () => {
				ob.disconnect();
				window.removeEventListener('resize', calc);
			};
		}
	}, []);

	// 增加body wheel滚动
	useEffect(() => {
		if (bodyRef.current) {
			const body = bodyRef.current;
			const handleWheel = (e: WheelEvent) => {
				if (e.ctrlKey !== true) {
					const scrollCoefficient = -(((e as any).wheelDeltaY as number) ?? -e.deltaY) > 0 ? 1 : -1;
					const scrollDistance = scrollCoefficient * _scrollDistance;
					if (e.shiftKey === true) {
						scrollByLeft({ offset: scrollDistance, duration: _scrollDuration });
					} else {
						scrollByTop({ offset: scrollDistance, duration: _scrollDuration });
					}
				}
			};
			body.addEventListener('wheel', handleWheel, { passive: true });

			return () => {
				body.removeEventListener('wheel', handleWheel);
			};
		}
	}, []);

	// 增加head wheel滚动
	useEffect(() => {
		if (headRef.current) {
			const head = headRef.current;
			const handleWheel = (e: WheelEvent) => {
				if (e.ctrlKey !== true) {
					const scrollCoefficient = -(((e as any).wheelDeltaY as number) ?? -e.deltaY) > 0 ? 1 : -1;
					const scrollDistance = scrollCoefficient * _scrollDistance;
					if (e.shiftKey === true) {
						scrollByLeft({ offset: scrollDistance, duration: _scrollDuration });
					}
				}
			};
			head.addEventListener('wheel', handleWheel, { passive: true });

			return () => {
				head.removeEventListener('wheel', handleWheel);
			};
		}
	}, []);

	// 增加summary wheel滚动
	useEffect(() => {
		if (showSummary && summaryRef.current) {
			console.log('summaryRef', summaryRef);
			const summary = summaryRef.current;
			const handleWheel = (e: WheelEvent) => {
				if (e.ctrlKey !== true) {
					const scrollCoefficient = -(((e as any).wheelDeltaY as number) ?? -e.deltaY) > 0 ? 1 : -1;
					const scrollDistance = scrollCoefficient * _scrollDistance;
					if (e.shiftKey === true) {
						scrollByLeft({ offset: scrollDistance, duration: _scrollDuration });
					}
				}
			};
			summary.addEventListener('wheel', handleWheel, { passive: true });

			return () => {
				summary.removeEventListener('wheel', handleWheel);
			};
		}
	}, [showSummary]);
};

export default useTableObserver;
