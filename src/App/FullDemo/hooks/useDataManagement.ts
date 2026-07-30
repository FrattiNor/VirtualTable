import { useState, useMemo, useCallback } from 'react';

import { type DemoItem, type SummaryItem, generateData, PAGE_SIZE } from '../types';

export const useDataManagement = (filterData: (data: DemoItem[]) => DemoItem[], showSummary: boolean) => {
	const [dataCount, setDataCount] = useState(500);
	const [loading, setLoading] = useState(false);
	const [showEmpty, setShowEmpty] = useState(false);
	const [showPagination, setShowPagination] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [data, setData] = useState<DemoItem[]>(() => generateData(500, false));

	const regenerateData = useCallback((treeEnabled: boolean) => {
		setLoading(true);
		setTimeout(() => {
			setData(generateData(dataCount, treeEnabled));
			setLoading(false);
		}, 600);
	}, [dataCount]);

	const filteredData = useMemo(() => {
		return filterData(data);
	}, [data, filterData]);

	const paginatedData = useMemo(() => {
		if (!showPagination) return filteredData;
		const start = (currentPage - 1) * PAGE_SIZE;
		return filteredData.slice(start, start + PAGE_SIZE);
	}, [filteredData, showPagination, currentPage]);

	const displayData = useMemo(() => {
		if (showEmpty) return [];
		return paginatedData;
	}, [paginatedData, showEmpty]);

	const summaryData: SummaryItem[] | undefined = useMemo(() => {
		if (!showSummary) return undefined;
		const src = filteredData;
		if (src.length === 0) return undefined;
		return [
			{
				totalCount: src.length,
				avgAge: (src.reduce((s, d) => s + d.age, 0) / src.length).toFixed(1),
				avgSalary: (src.reduce((s, d) => s + d.salary, 0) / src.length).toFixed(0),
				avgScore: (src.reduce((s, d) => s + d.score, 0) / src.length).toFixed(1),
			},
		];
	}, [showSummary, filteredData]);

	const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

	return {
		dataCount,
		setDataCount,
		data,
		setData,
		loading,
		setLoading,
		showEmpty,
		setShowEmpty,
		showPagination,
		setShowPagination,
		currentPage,
		setCurrentPage,
		regenerateData,
		filteredData,
		paginatedData,
		displayData,
		summaryData,
		totalPages,
	};
};
