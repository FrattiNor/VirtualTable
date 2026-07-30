import { useState, useCallback, useEffect, useMemo } from 'react';

import { type CheckboxFilterKeys, type TextFilterKeys, type FilterState, type DemoItem, EMPTY_FILTER_STATE } from '../types';

const CHECKBOX_KEYS: CheckboxFilterKeys[] = ['department', 'city', 'status'];
const TEXT_KEYS: TextFilterKeys[] = ['id', 'name', 'age', 'salary', 'email', 'joinDate', 'score'];

export const useFilterState = () => {
	const [enabled, setEnabled] = useState(true);
	const [state, setState] = useState<FilterState>({ ...EMPTY_FILTER_STATE });
	const [draft, setDraft] = useState<FilterState>({ ...EMPTY_FILTER_STATE });
	const [activeKey, setActiveKey] = useState<string | null>(null);

	// 点击外部关闭下拉
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target.closest('[data-filter-dropdown]') && !target.closest('[data-filter-trigger]')) {
				setActiveKey(null);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	const toggleDraft = useCallback((colKey: CheckboxFilterKeys, value: string) => {
		setDraft((prev) => {
			const arr = prev[colKey] as string[];
			const next = arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value];
			return { ...prev, [colKey]: next };
		});
	}, []);

	const confirm = useCallback((colKey: keyof FilterState) => {
		setState((prev) => ({ ...prev, [colKey]: draft[colKey] }));
		setActiveKey(null);
	}, [draft]);

	const resetDraft = useCallback((colKey: keyof FilterState) => {
		setDraft((prev) => {
			const old = prev[colKey];
			return { ...prev, [colKey]: Array.isArray(old) ? [] : '' };
		});
	}, []);

	const clearAll = useCallback(() => {
		setState({ ...EMPTY_FILTER_STATE });
		setDraft({ ...EMPTY_FILTER_STATE });
	}, []);

	const openFilter = useCallback((colKey: string) => {
		const currentValue = state[colKey as keyof FilterState];
		setDraft((prev) => ({ ...prev, [colKey]: Array.isArray(currentValue) ? [...currentValue] : currentValue }));
		setActiveKey(colKey);
	}, [state]);

	const closeFilter = useCallback(() => {
		setActiveKey(null);
	}, []);

	const updateDraft = useCallback((colKey: keyof FilterState, value: string) => {
		setDraft((prev) => ({ ...prev, [colKey]: value }));
	}, []);

	const hasActiveFilters = useMemo(() => {
		return CHECKBOX_KEYS.some((key) => state[key].length > 0) ||
			TEXT_KEYS.some((key) => !!state[key]);
	}, [state]);

	// 通用数据筛选方法
	const filterData = useCallback((data: DemoItem[]): DemoItem[] => {
		return data.filter((item) => {
			for (const key of CHECKBOX_KEYS) {
				const values = state[key] as string[];
				if (values.length > 0 && !values.includes(item[key])) return false;
			}
			for (const key of TEXT_KEYS) {
				const keyword = state[key] as string;
				if (keyword && !String(item[key]).toLowerCase().includes(keyword.toLowerCase())) return false;
			}
			return true;
		});
	}, [state]);

	return {
		enabled,
		setEnabled,
		state,
		draft,
		activeKey,
		setActiveKey,
		toggleDraft,
		confirm,
		resetDraft,
		clearAll,
		openFilter,
		closeFilter,
		updateDraft,
		hasActiveFilters,
		filterData,
	};
};
