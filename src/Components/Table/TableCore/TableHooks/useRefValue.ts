import { useCallback, useRef } from 'react';

const useRefValue = <T>(value: T) => {
	const ref = useRef(value);
	if (ref.current !== value) ref.current = value;
	const getValue = useCallback(() => ref.current, []);
	return [getValue] as [() => T];
};

export default useRefValue;
