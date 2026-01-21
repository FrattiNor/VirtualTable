import { useRef } from 'react';

const useTableDomRef = () => {
	const headRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const bodyInnerRef = useRef<HTMLDivElement>(null);
	const vScrollbarRef = useRef<HTMLDivElement>(null);
	const hScrollbarRef = useRef<HTMLDivElement>(null);
	const colSizeObserverRef = useRef<HTMLDivElement>(null);

	return { bodyRef, headRef, bodyInnerRef, vScrollbarRef, hScrollbarRef, colSizeObserverRef };
};

export default useTableDomRef;
