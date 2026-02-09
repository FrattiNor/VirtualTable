import { useEffect, useRef } from 'react';

const useRefCallback = <T extends HTMLElement>(callback: undefined | ((e: T | null) => void)) => {
	const ref = useRef<T | null>(null);

	useEffect(() => {
		if (ref.current && typeof callback === 'function') {
			callback(ref.current);
			return () => {
				callback(null);
			};
		}
	}, []);

	return ref;
};

export default useRefCallback;
