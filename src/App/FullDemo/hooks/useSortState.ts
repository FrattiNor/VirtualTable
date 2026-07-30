import { useState, useCallback, useMemo, type RefObject } from 'react';

import { type Table2Sorter } from '../../../TableComponents';
import { type DemoItem } from '../types';

export const useSortState = (data: DemoItem[], setData: React.Dispatch<React.SetStateAction<DemoItem[]>>) => {
	const [sorter, setSorter] = useState<Table2Sorter>({ sortKey: undefined, sortValue: undefined });

	const handleSortChange = useCallback(
		(params: { sortKey: string | undefined; sortValue: 'asc' | 'desc' | undefined }) => {
			setSorter(params);
			if (params.sortKey && params.sortValue) {
				const sorted = [...data].sort((a, b) => {
					const aVal = (a as any)[params.sortKey!];
					const bVal = (b as any)[params.sortKey!];
					if (typeof aVal === 'number' && typeof bVal === 'number') {
						return params.sortValue === 'asc' ? aVal - bVal : bVal - aVal;
					}
					const aStr = String(aVal);
					const bStr = String(bVal);
					return params.sortValue === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
				});
				setData(sorted);
			}
		},
		[data, setData],
	);

	return { sorter, handleSortChange };
};

export const useScrollToState = (tableRef: RefObject<any>) => {
	const [scrollToTop, setScrollToTop] = useState(0);

	const handleScrollTo = useCallback(() => {
		tableRef.current?.scrollTo({ top: scrollToTop, behavior: 'smooth' });
	}, [scrollToTop, tableRef]);

	return { scrollToTop, setScrollToTop, handleScrollTo };
};
