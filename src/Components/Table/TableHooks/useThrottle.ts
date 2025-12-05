import { useRef } from 'react';

type Props = {
	// 设置delayTime时，使用setTimeout节流，默认为requestAnimationFrame
	delayTime?: number;
	// 间隔几次
	multiple?: number;
	// 打印间隔
	consoleInterval?: boolean;
};

// 节流
const useThrottle = <T extends () => void>(opt?: Props) => {
	const delayTime = opt?.delayTime;
	const multiple = opt?.multiple ?? 0;
	const consoleInterval = opt?.consoleInterval ?? false;

	// 间隔时间
	const intervalRef = useRef<number | null>(null);
	// 计数
	const countRef = useRef(multiple);
	// 被防抖阻挡的最后一次fn
	const lastFnRef = useRef<T | null>(null);
	// 当前一帧执行完，再执行一帧来执行最后一次的fn
	const timeoutRef = useRef<ReturnType<typeof requestAnimationFrame> | ReturnType<typeof setTimeout> | null>(null);

	const start = () => {
		if (lastFnRef.current) {
			if (typeof delayTime === 'number') {
				timeoutRef.current = setTimeout(start, delayTime);
			} else {
				timeoutRef.current = requestAnimationFrame(start);
			}
			if (countRef.current === multiple) {
				lastFnRef.current();
				countRef.current = 0;
				lastFnRef.current = null;
				if (consoleInterval === true) {
					const now = performance.now();
					if (intervalRef.current !== null) console.log(Math.floor(now - (intervalRef.current ?? 0)));
					intervalRef.current = now;
				}
			} else {
				countRef.current++;
			}
		} else {
			countRef.current = 0;
			timeoutRef.current = null;
			intervalRef.current = null;
		}
	};

	const throttle = (fn: T) => {
		lastFnRef.current = fn;
		if (!timeoutRef.current) start();
	};

	return { throttle };
};

export default useThrottle;
