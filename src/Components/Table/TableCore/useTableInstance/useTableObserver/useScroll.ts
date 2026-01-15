import { useRef } from 'react';

// 缓动函数
const linear = (x: number) => x;

export const useVirtualScroll = (direction: 'scrollTop' | 'scrollLeft', getElement: () => HTMLElement | null) => {
	const dateValueRef = useRef(0);
	const beforeRef = useRef<{ target: number; isAdd: boolean } | null>(null);
	const requestIdRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

	const virtualScroll = ({ offset, duration }: { offset: number; duration: number }) => {
		// 滚动元素
		const el = getElement();

		// 滚动元素存在
		if (el) {
			// 最小目标值
			const minTarget = 0;

			// 最大目标值
			const maxTarget = direction === 'scrollTop' ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;

			// 获取【真·目标值】，被最大最小值限制
			const getTrueTarget = (v: number) => Math.min(Math.max(v, minTarget), maxTarget);

			// 滚动方向
			const isAdd = offset > 0;

			// 开始值
			const startTarget = el[direction];

			// 【真·目标值】
			let target = getTrueTarget(startTarget + offset);

			// 之前的【真·目标值】和当前的【真·目标值】一致【按之前滚动执行，当前滚动不执行】
			if (beforeRef.current && beforeRef.current.target === target) return;

			// 和之前的滚动方向一致，之前的目标未完成、则继承之前未完成的滚动距离
			if (beforeRef.current && beforeRef.current.isAdd === isAdd) {
				const _target = isAdd ? Math.max(beforeRef.current.target + offset, target) : Math.min(beforeRef.current.target + offset, target);
				target = getTrueTarget(_target);
			}

			// 开始值和【真·目标值】一致
			if (startTarget === target) return;

			// 记录当前的滚动记录
			beforeRef.current = { isAdd, target };

			// 滚动距离
			const changeValue = target - startTarget;

			// 滚动函数
			const animateScroll = () => {
				// 滚动百分比
				const per = (performance.now() - dateValueRef.current) / duration;

				// 根据滚动百分比和缓动函数计算出滚动目标值
				const currentScrollTarget = startTarget + linear(per) * changeValue;

				// 执行滚动
				el[direction] = Number(currentScrollTarget.toFixed(3));

				// 如果当前滚动百分比未超过1，滚动目标值还在范围内
				if (per <= 1 && currentScrollTarget >= minTarget && currentScrollTarget <= maxTarget) {
					requestIdRef.current = requestAnimationFrame(animateScroll);
				} else if (requestIdRef.current) {
					cancelAnimationFrame(requestIdRef.current);
					requestIdRef.current = null;
					beforeRef.current = null;
				}
			};

			// 当前时间
			dateValueRef.current = performance.now();

			// 之前滚动还未结束、取消之前的滚动
			if (requestIdRef.current) {
				cancelAnimationFrame(requestIdRef.current);
				requestIdRef.current = null;
			}

			// 执行滚动
			requestIdRef.current = requestAnimationFrame(animateScroll);
		}
	};

	return virtualScroll;
};
