import { useRef } from 'react';

// 节流
const useFrameThrottle = <T extends () => void>() => {
	// 被防抖阻挡的最后一次fn
	const lastFnRef = useRef<T | null>(null);
	// 当前一帧执行完，再执行一帧来执行最后一次的fn
	const timeoutRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

	const start = () => {
		if (lastFnRef.current) {
			lastFnRef.current();
			lastFnRef.current = null;
			timeoutRef.current = requestAnimationFrame(start);
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

export default useFrameThrottle;
