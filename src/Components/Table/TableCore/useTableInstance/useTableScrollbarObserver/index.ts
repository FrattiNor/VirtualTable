import { useLayoutEffect } from 'react';

import { type RowKeyType } from '../../TableTypes/type';
import { getDisplayNone } from '../../TableUtils';
import calcBorderWidth from '../../TableUtils/calcBorderWidth';

import type useTableDomRef from '../useTableDomRef';
import type useTableState from '../useTableState';
import type useTableVirtual from '../useTableVirtual';

type Props<T, K, S> = {
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableState: ReturnType<typeof useTableState<T, K, S>>;
	tableVirtual: ReturnType<typeof useTableVirtual<T, K, S>>;
};

// 监测滚动条状态
// 顺便监听TableWidth
const useTableScrollbarObserver = <T, K = RowKeyType, S = any>({ tableState, tableVirtual, tableDomRef }: Props<T, K, S>) => {
	const { getH_virtualCore, getV_virtualCore } = tableVirtual;
	const { bodyWrapperRef, bodyScrollPlaceholderRef, colSizeObserverRef } = tableDomRef;
	const { setV_scrollbar, setH_scrollbar, setTableWidth } = tableState;

	useLayoutEffect(() => {
		const bodyWrapper = bodyWrapperRef.current;
		const colMeasure = colSizeObserverRef.current;
		const bodyContainer = bodyWrapperRef.current?.parentElement;
		const bodyScrollPlaceholder = bodyScrollPlaceholderRef.current;

		if (bodyWrapper && bodyScrollPlaceholder && bodyContainer && colMeasure) {
			// 获取滚动条状态
			const getScrollbarState = () => {
				// 获取横向滚动条是否存在【判定逻辑由colMeasure的宽度判定】
				const hScrollbarHave = bodyScrollPlaceholder.clientWidth > bodyWrapper.clientWidth && colMeasure.scrollWidth > colMeasure.clientWidth;
				// 获取纵向滚动条是否存在【判定逻辑由body和bodyScrollPlaceholder的高度判定】
				const vScrollbarHave = bodyScrollPlaceholder.clientHeight > bodyWrapper.clientHeight;

				return { hScrollbarHave, vScrollbarHave };
			};

			// 更新virtualCore的ContainerSize
			const updateContainerSize = () => {
				getH_virtualCore().updateContainerSize(bodyWrapper.clientWidth);
				getV_virtualCore().updateContainerSize(bodyWrapper.clientHeight);
			};

			// 直接执行函数/window resize函数
			const calc = () => {
				// display none的情况直接跳过执行
				// TODO BUG 如果display none时缩放导致的resize将导致无法更新scrollbar宽度，对于原生滚动条将会产生影响
				if (getDisplayNone(bodyWrapper.getBoundingClientRect())) return;
				// 更新virtualCore的ContainerSize
				updateContainerSize();
				// 通过插入临时元素计算scrollBarWidth
				const { hScrollbarWidth, vScrollbarWidth } = calcBorderWidth(bodyWrapper);
				// 获取滚动条状态
				const { hScrollbarHave, vScrollbarHave } = getScrollbarState();
				// 更新state
				setTableWidth(bodyContainer.clientWidth);
				// 更新state
				setV_scrollbar((old) => {
					const next = { width: vScrollbarWidth, have: vScrollbarHave && vScrollbarWidth > 0 };
					if (next.have !== old.have || next.width !== old.width) {
						return next;
					}
					return old;
				});
				// 更新state
				setH_scrollbar((old) => {
					const next = { width: hScrollbarWidth, have: hScrollbarHave && hScrollbarWidth > 0 };
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
				setTableWidth(bodyContainer.clientWidth);
				// 更新state
				setV_scrollbar((old) => {
					const next = { ...old, have: vScrollbarHave && old.width > 0 };
					if (next.have !== old.have || next.width !== old.width) {
						return next;
					}
					return old;
				});
				// 更新state
				setH_scrollbar((old) => {
					const next = { ...old, have: hScrollbarHave && old.width > 0 };
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
			ob.observe(bodyWrapper, { box: 'border-box' });
			// 监听bodyScrollPlaceholder resize
			ob.observe(bodyScrollPlaceholder, { box: 'border-box' });
			// 监听window resize
			window.addEventListener('resize', calc);

			return () => {
				ob.disconnect();
				window.removeEventListener('resize', calc);
			};
		}
	}, []);
};

export default useTableScrollbarObserver;
