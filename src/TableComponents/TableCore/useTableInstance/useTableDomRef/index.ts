import { useRef } from 'react';

const useTableDomRef = () => {
	const headRef = useRef<HTMLDivElement>(null);
	const bodyWrapperRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const bodyScrollPlaceholderRef = useRef<HTMLDivElement>(null);
	const summaryRef = useRef<HTMLDivElement>(null);
	const vScrollbarRef = useRef<HTMLDivElement>(null);
	const hScrollbarRef = useRef<HTMLDivElement>(null);
	const colSizeObserverRef = useRef<HTMLDivElement>(null);

	return { headRef, bodyWrapperRef, bodyRef, bodyScrollPlaceholderRef, vScrollbarRef, hScrollbarRef, colSizeObserverRef, summaryRef };
};

export default useTableDomRef;
