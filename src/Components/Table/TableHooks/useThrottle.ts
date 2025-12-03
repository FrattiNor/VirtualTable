import { useRef } from 'react';

type Props = {
	// 设置delayTime时，使用setTimeout节流，默认为requestAnimationFrame
	delayTime: number;
};

// 节流
const useThrottle = <T extends () => void>(opt?: Props) => {
	const delayTime = opt?.delayTime;

	// 被防抖阻挡的最后一次fn
	const lastFnRef = useRef<T | null>(null);
	// 当前一帧执行完，再执行一帧来执行最后一次的fn
	const timeoutRef = useRef<ReturnType<typeof requestAnimationFrame> | ReturnType<typeof setTimeout> | null>(null);

	const start = () => {
		if (lastFnRef.current) {
			lastFnRef.current();
			lastFnRef.current = null;
			if (typeof delayTime === 'function') {
				timeoutRef.current = setTimeout(start, delayTime);
			} else {
				timeoutRef.current = requestAnimationFrame(start);
			}
		} else {
			timeoutRef.current = null;
		}
	};

	const throttle = (fn: T) => {
		lastFnRef.current = fn;
		if (!timeoutRef.current) start();
	};

	return { throttle };
};

export default useThrottle;
