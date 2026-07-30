import { useMemo, useCallback } from 'react';

import { type Table2Columns } from '../../../TableComponents';
import { type DemoItem, type SummaryItem, type FilterState, departments, cities, statuses } from '../types';
import { type useFilterState } from '../hooks/useFilterState';
import FilterDropdown from '../components/FilterDropdown';
import TextFilter from '../components/TextFilter';

type UseColumnsDeps = {
	filter: ReturnType<typeof useFilterState>;
	highlightKeywords: string[];
	cellSpanEnabled: boolean;
	headerGroupEnabled: boolean;
	filteredData: DemoItem[];
};

export const useColumns = (deps: UseColumnsDeps) => {
	const { filter, highlightKeywords, cellSpanEnabled, headerGroupEnabled, filteredData } = deps;

	const getColHighlight = useCallback((colKey: keyof FilterState): string[] | undefined => {
		const colFilter = filter.state[colKey];
		const kws: string[] = [];
		if (Array.isArray(colFilter) && colFilter.length > 0) {
			kws.push(...colFilter);
		} else if (typeof colFilter === 'string' && colFilter) {
			kws.push(colFilter);
		}
		if (highlightKeywords.length > 0) {
			kws.push(...highlightKeywords);
		}
		return kws.length > 0 ? kws : undefined;
	}, [filter.state, highlightKeywords]);

	const columns: Table2Columns<DemoItem, SummaryItem> = useMemo(() => {
		const baseColumns: Table2Columns<DemoItem, SummaryItem> = [
			{
				title: 'ID',
				key: 'id',
				width: 120,
				fixed: 'left',
				resize: true,
				filter: (
					<TextFilter
						colKey="id"
						placeholder="搜索ID..."
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'id'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onDraftChange={filter.updateDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('id'),
			},
			{
				title: '姓名',
				key: 'name',
				width: 150,
				resize: true,
				filter: (
					<TextFilter
						colKey="name"
						placeholder="搜索姓名..."
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'name'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onDraftChange={filter.updateDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('name'),
			},
			{
				title: '年龄',
				key: 'age',
				width: 100,
				align: 'center',
				resize: true,
				sorter: true,
				filter: (
					<TextFilter
						colKey="age"
						placeholder="搜索年龄..."
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'age'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onDraftChange={filter.updateDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('age'),
				onCellStyle: (item) => {
					if (item.age > 45) return { color: '#f5222d', fontWeight: 600 };
					if (item.age < 25) return { color: '#1890ff' };
					return {};
				},
				summaryRender: (item) => <span style={{ fontWeight: 600 }}>{item.avgAge}</span>,
			},
			{
				title: '部门',
				key: 'department',
				width: 120,
				resize: true,
				sorter: true,
				filter: (
					<FilterDropdown
						colKey="department"
						options={departments}
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'department'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onToggle={filter.toggleDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('department'),
				onCellSpan: cellSpanEnabled
					? (item, index) => {
							if (index > 0 && item.department === filteredData[index - 1]?.department) {
								return { rowSpan: 0 };
							}
							let span = 1;
							for (let i = index + 1; i < filteredData.length; i++) {
								if (filteredData[i].department === item.department) span++;
								else break;
							}
							return { rowSpan: span };
						}
					: undefined,
			},
			{
				title: '城市',
				key: 'city',
				width: 120,
				resize: true,
				sorter: true,
				filter: (
					<FilterDropdown
						colKey="city"
						options={cities}
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'city'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onToggle={filter.toggleDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('city'),
			},
			{
				title: '薪资',
				key: 'salary',
				width: 130,
				align: 'right',
				resize: true,
				sorter: true,
				filter: (
					<TextFilter
						colKey="salary"
						placeholder="搜索薪资..."
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'salary'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onDraftChange={filter.updateDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('salary'),
				render: (item) => <span>¥{item.salary.toLocaleString()}</span>,
				onCellStyle: (item) => {
					if (item.salary > 20000) return { color: '#52c41a', fontWeight: 600 };
					return {};
				},
				summaryRender: (item) => <span style={{ fontWeight: 600 }}>¥{Number(item.avgSalary).toLocaleString()}</span>,
			},
			{
				title: '状态',
				key: 'status',
				width: 100,
				align: 'center',
				resize: true,
				filter: (
					<FilterDropdown
						colKey="status"
						options={statuses}
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'status'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onToggle={filter.toggleDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('status'),
				render: (item) => {
					const colorMap: Record<string, string> = { 在职: '#52c41a', 休假: '#faad14', 出差: '#1890ff', 职: '#ff4d4f' };
					return <span style={{ color: colorMap[item.status] || '#999' }}>● {item.status}</span>;
				},
			},
			{
				title: '邮箱',
				key: 'email',
				width: 220,
				resize: true,
				filter: (
					<TextFilter
						colKey="email"
						placeholder="搜索邮箱..."
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'email'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onDraftChange={filter.updateDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('email'),
			},
			{
				title: '入职日期',
				key: 'joinDate',
				width: 140,
				resize: true,
				sorter: true,
				filter: (
					<TextFilter
						colKey="joinDate"
						placeholder="搜索日期..."
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'joinDate'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onDraftChange={filter.updateDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('joinDate'),
			},
			{
				title: '评分',
				key: 'score',
				width: 100,
				align: 'center',
				resize: true,
				sorter: true,
				filter: (
					<TextFilter
						colKey="score"
						placeholder="搜索评分..."
						enabled={filter.enabled}
						state={filter.state}
						draft={filter.draft}
						isOpen={filter.activeKey === 'score'}
						onOpen={filter.openFilter}
						onClose={filter.closeFilter}
						onDraftChange={filter.updateDraft}
						onConfirm={filter.confirm}
						onReset={filter.resetDraft}
					/>
				),
				highlightKeywords: getColHighlight('score'),
				render: (item) => {
					const score = item.score;
					let color = '#52c41a';
					if (score < 60) color = '#ff4d4f';
					else if (score < 80) color = '#faad14';
					return <span style={{ color, fontWeight: 600 }}>{score}</span>;
				},
				summaryRender: (item) => <span style={{ fontWeight: 600 }}>{item.avgScore}</span>,
			},
			{
				title: '操作',
				key: 'action',
				width: 150,
				fixed: 'right',
				render: () => (
					<div style={{ display: 'flex', gap: 8 }}>
						<span style={{ color: '#1890ff', cursor: 'pointer', fontSize: 12 }}>编辑</span>
						<span style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: 12 }}>删除</span>
					</div>
				),
			},
		];

		if (headerGroupEnabled) {
			const groupedColumns: Table2Columns<DemoItem, SummaryItem> = [
				{
					title: 'ID',
					key: 'id',
					width: 120,
					fixed: 'left',
					resize: true,
					filter: (
						<TextFilter
							colKey="id"
							placeholder="搜索ID..."
							enabled={filter.enabled}
							state={filter.state}
							draft={filter.draft}
							isOpen={filter.activeKey === 'id'}
							onOpen={filter.openFilter}
							onClose={filter.closeFilter}
							onDraftChange={filter.updateDraft}
							onConfirm={filter.confirm}
							onReset={filter.resetDraft}
						/>
					),
					highlightKeywords: getColHighlight('id'),
				},
				{
					key: 'personalGroup',
					title: '个人信息',
					children: [
						{
							title: '姓名',
							key: 'name',
							width: 150,
							resize: true,
							filter: (
								<TextFilter
									colKey="name"
									placeholder="搜索姓名..."
									enabled={filter.enabled}
									state={filter.state}
									draft={filter.draft}
									isOpen={filter.activeKey === 'name'}
									onOpen={filter.openFilter}
									onClose={filter.closeFilter}
									onDraftChange={filter.updateDraft}
									onConfirm={filter.confirm}
									onReset={filter.resetDraft}
								/>
							),
							highlightKeywords: getColHighlight('name'),
						},
						{
							title: '年龄',
							key: 'age',
							width: 100,
							align: 'center' as const,
							resize: true,
							sorter: true,
							filter: (
								<TextFilter
									colKey="age"
									placeholder="搜索年龄..."
									enabled={filter.enabled}
									state={filter.state}
									draft={filter.draft}
									isOpen={filter.activeKey === 'age'}
									onOpen={filter.openFilter}
									onClose={filter.closeFilter}
									onDraftChange={filter.updateDraft}
									onConfirm={filter.confirm}
									onReset={filter.resetDraft}
								/>
							),
							highlightKeywords: getColHighlight('age'),
							summaryRender: (item: SummaryItem) => <span style={{ fontWeight: 600 }}>{item.avgAge}</span>,
						},
						{
							title: '邮箱',
							key: 'email',
							width: 220,
							resize: true,
							filter: (
								<TextFilter
									colKey="email"
									placeholder="搜索邮箱..."
									enabled={filter.enabled}
									state={filter.state}
									draft={filter.draft}
									isOpen={filter.activeKey === 'email'}
									onOpen={filter.openFilter}
									onClose={filter.closeFilter}
									onDraftChange={filter.updateDraft}
									onConfirm={filter.confirm}
									onReset={filter.resetDraft}
								/>
							),
							highlightKeywords: getColHighlight('email'),
						},
					],
				},
				{
					key: 'workGroup',
					title: '工作信息',
					children: [
						{
							title: '部门',
							key: 'department',
							width: 120,
							resize: true,
							sorter: true,
							filter: (
								<FilterDropdown
									colKey="department"
									options={departments}
									enabled={filter.enabled}
									state={filter.state}
									draft={filter.draft}
									isOpen={filter.activeKey === 'department'}
									onOpen={filter.openFilter}
									onClose={filter.closeFilter}
									onToggle={filter.toggleDraft}
									onConfirm={filter.confirm}
									onReset={filter.resetDraft}
								/>
							),
							highlightKeywords: getColHighlight('department'),
						},
						{
							title: '城市',
							key: 'city',
							width: 120,
							resize: true,
							sorter: true,
							filter: (
								<FilterDropdown
									colKey="city"
									options={cities}
									enabled={filter.enabled}
									state={filter.state}
									draft={filter.draft}
									isOpen={filter.activeKey === 'city'}
									onOpen={filter.openFilter}
									onClose={filter.closeFilter}
									onToggle={filter.toggleDraft}
									onConfirm={filter.confirm}
									onReset={filter.resetDraft}
								/>
							),
							highlightKeywords: getColHighlight('city'),
						},
						{
							title: '薪资',
							key: 'salary',
							width: 130,
							align: 'right' as const,
							resize: true,
							sorter: true,
							filter: (
								<TextFilter
									colKey="salary"
									placeholder="搜索薪资..."
									enabled={filter.enabled}
									state={filter.state}
									draft={filter.draft}
									isOpen={filter.activeKey === 'salary'}
									onOpen={filter.openFilter}
									onClose={filter.closeFilter}
									onDraftChange={filter.updateDraft}
									onConfirm={filter.confirm}
									onReset={filter.resetDraft}
								/>
							),
							highlightKeywords: getColHighlight('salary'),
							render: (item: DemoItem) => <span>¥{item.salary.toLocaleString()}</span>,
							summaryRender: (item: SummaryItem) => <span style={{ fontWeight: 600 }}>¥{Number(item.avgSalary).toLocaleString()}</span>,
						},
						{
							title: '状态',
							key: 'status',
							width: 100,
							align: 'center' as const,
							resize: true,
							filter: (
								<FilterDropdown
									colKey="status"
									options={statuses}
									enabled={filter.enabled}
									state={filter.state}
									draft={filter.draft}
									isOpen={filter.activeKey === 'status'}
									onOpen={filter.openFilter}
									onClose={filter.closeFilter}
									onToggle={filter.toggleDraft}
									onConfirm={filter.confirm}
									onReset={filter.resetDraft}
								/>
							),
							highlightKeywords: getColHighlight('status'),
							render: (item: DemoItem) => {
								const colorMap: Record<string, string> = { 在职: '#52c41a', 休假: '#faad14', 出差: '#1890ff', 职: '#ff4d4f' };
								return <span style={{ color: colorMap[item.status] || '#999' }}>● {item.status}</span>;
							},
						},
						{
							title: '入职日期',
							key: 'joinDate',
							width: 140,
							resize: true,
							sorter: true,
							filter: (
								<TextFilter
									colKey="joinDate"
									placeholder="搜索日期..."
									enabled={filter.enabled}
									state={filter.state}
									draft={filter.draft}
									isOpen={filter.activeKey === 'joinDate'}
									onOpen={filter.openFilter}
									onClose={filter.closeFilter}
									onDraftChange={filter.updateDraft}
									onConfirm={filter.confirm}
									onReset={filter.resetDraft}
								/>
							),
							highlightKeywords: getColHighlight('joinDate'),
						},
						{
							title: '评分',
							key: 'score',
							width: 100,
							align: 'center' as const,
							resize: true,
							sorter: true,
							filter: (
								<TextFilter
									colKey="score"
									placeholder="搜索评分..."
									enabled={filter.enabled}
									state={filter.state}
									draft={filter.draft}
									isOpen={filter.activeKey === 'score'}
									onOpen={filter.openFilter}
									onClose={filter.closeFilter}
									onDraftChange={filter.updateDraft}
									onConfirm={filter.confirm}
									onReset={filter.resetDraft}
								/>
							),
							highlightKeywords: getColHighlight('score'),
							render: (item: DemoItem) => {
								const s = item.score;
								let c = '#52c41a';
								if (s < 60) c = '#ff4d4f';
								else if (s < 80) c = '#faad14';
								return <span style={{ color: c, fontWeight: 600 }}>{s}</span>;
							},
							summaryRender: (item: SummaryItem) => <span style={{ fontWeight: 600 }}>{item.avgScore}</span>,
						},
					],
				},
				{
					title: '操作',
					key: 'action',
					width: 150,
					fixed: 'right',
					render: () => (
						<div style={{ display: 'flex', gap: 8 }}>
							<span style={{ color: '#1890ff', cursor: 'pointer', fontSize: 12 }}>编辑</span>
							<span style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: 12 }}>删除</span>
						</div>
					),
				},
			];
			return groupedColumns;
		}

		return baseColumns;
	}, [cellSpanEnabled, filteredData, headerGroupEnabled, filter, getColHighlight]);

	return { columns };
};
