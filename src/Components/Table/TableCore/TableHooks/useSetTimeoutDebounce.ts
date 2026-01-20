import { useEffect, useRef } from 'react';

// 使用setTimeout防抖
const useSetTimeoutDebounce = <T extends () => void>() => {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const debounce = (fn: T) => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			fn();
		}, 66);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return { debounce };
};

export default useSetTimeoutDebounce;
