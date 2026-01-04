import { useEffect, useRef } from 'react';

// 使用requestAnimationFrame防抖，一帧只执行一次
const useFrameDebounce = <T extends () => void>() => {
	const timeoutRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

	const debounce = (fn: T) => {
		if (timeoutRef.current) cancelAnimationFrame(timeoutRef.current);
		timeoutRef.current = requestAnimationFrame(() => {
			fn();
		});
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				cancelAnimationFrame(timeoutRef.current);
			}
		};
	}, []);

	return { debounce };
};

export default useFrameDebounce;
