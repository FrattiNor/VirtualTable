import { useRef } from 'react';

type Props = {
	frameInterval: number;
};

// 节流
const useThrottle = <T extends () => void>({ frameInterval }: Props) => {
	// 计数器
	const countRef = useRef(0);
	// 被防抖阻挡的最后一次fn
	const lastFnRef = useRef<T | null>(null);
	// 当前一帧执行完，再执行一帧来执行最后一次的fn
	const timeoutRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
	//
	// const nowRef = useRef(0);

	const start = () => {
		if (lastFnRef.current) {
			if (countRef.current === frameInterval) {
				lastFnRef.current();
				lastFnRef.current = null;
				countRef.current = 0;
				timeoutRef.current = requestAnimationFrame(start);

				// const now = performance.now();
				// console.log(Math.floor(now - nowRef.current));
				// nowRef.current = now;
			} else {
				countRef.current++;
				timeoutRef.current = requestAnimationFrame(start);
			}
		} else {
			countRef.current = 0;
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
