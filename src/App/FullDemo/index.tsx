import { type RefObject, type CSSProperties, useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

import styles from './index.module.less';
import { Table2, TableCoreFilterIcon, type Table2Ref, type Table2Columns, type Table2Sorter } from '../../TableComponents';

type DemoItem = {
	id: string;
	name: string;
	age: number;
	department: string;
	city: string;
	salary: number;
	status: string;
	email: string;
	joinDate: string;
	score: number;
	children?: DemoItem[];
};

type SummaryItem = {
	totalCount: number;
	avgAge: string;
	avgSalary: string;
	avgScore: string;
};

const departments = ['研发部', '市场部', '销售部', '人事部', '财务部', '运营部'];
const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京'];
const statuses = ['在职', '休假', '出差', '离职'];

const generateData = (count: number, haveChild: boolean): DemoItem[] => {
	const data: DemoItem[] = [];
	for (let i = 0; i < count; i++) {
		const item: DemoItem = {
			id: `emp_${i}`,
			name: `员工${i}`,
			age: 22 + Math.floor(Math.random() * 30),
			department: departments[i % departments.length],
			city: cities[i % cities.length],
			salary: 8000 + Math.floor(Math.random() * 20000),
			status: statuses[i % statuses.length],
			email: `emp${i}@company.com`,
			joinDate: `2020-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
			score: Math.floor(Math.random() * 100),
		};
		if (haveChild && i % 5 === 0 && i < count * 0.3) {
			item.children = [
				{
					id: `emp_${i}_sub1`,
					name: `员工${i}-子项1`,
					age: 22 + Math.floor(Math.random() * 10),
					department: departments[(i + 1) % departments.length],
					city: cities[(i + 1) % cities.length],
					salary: 6000 + Math.floor(Math.random() * 10000),
					status: '在职',
					email: `emp${i}_sub1@company.com`,
					joinDate: `2022-${String((i % 12) + 1).padStart(2, '0')}-15`,
					score: Math.floor(Math.random() * 100),
				},
				{
					id: `emp_${i}_sub2`,
					name: `员工${i}-子项2`,
					age: 25 + Math.floor(Math.random() * 10),
					department: departments[(i + 2) % departments.length],
					city: cities[(i + 2) % cities.length],
					salary: 7000 + Math.floor(Math.random() * 12000),
					status: '在职',
					email: `emp${i}_sub2@company.com`,
					joinDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-20`,
					score: Math.floor(Math.random() * 100),
					children: [
						{
							id: `emp_${i}_sub2_sub1`,
							name: `员工${i}-子项2-孙项1`,
							age: 22 + Math.floor(Math.random() * 5),
							department: '研发部',
							city: '北京',
							salary: 5000 + Math.floor(Math.random() * 8000),
							status: '在职',
							email: `emp${i}_sub2_sub1@company.com`,
							joinDate: `2024-01-10`,
							score: Math.floor(Math.random() * 100),
						},
					],
				},
			];
		}
		data.push(item);
	}
	return data;
};

const Toggle = ({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) => (
	<button className={`${styles.toggle} ${active ? styles.active : ''}`} onClick={() => onChange(!active)}>
		<span className={styles.knob} />
	</button>
);

type CheckboxFilterKeys = 'department' | 'city' | 'status';
type TextFilterKeys = 'id' | 'name' | 'age' | 'salary' | 'email' | 'joinDate' | 'score';

type FilterState = {
	department: string[];
	city: string[];
	status: string[];
	id: string;
	name: string;
	age: string;
	salary: string;
	email: string;
	joinDate: string;
	score: string;
};

const PAGE_SIZE = 50;

const FullDemo = () => {
	const tableRef = useRef<Table2Ref>(null) as RefObject<Table2Ref>;

	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [bordered, setBordered] = useState(true);
	const [loading, setLoading] = useState(false);
	const [dataCount, setDataCount] = useState(500);
	const [treeEnabled, setTreeEnabled] = useState(false);
	const [selectionEnabled, setSelectionEnabled] = useState(false);
	const [dragEnabled, setDragEnabled] = useState(false);
	const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
	const [highlightKeywords, setHighlightKeywords] = useState<string[]>([]);
	const [highlightInput, setHighlightInput] = useState('');
	const [sorter, setSorter] = useState<Table2Sorter>({ sortKey: undefined, sortValue: undefined });
	const [showSummary, setShowSummary] = useState(false);
	const [rowHoverHighlight, setRowHoverHighlight] = useState(true);
	const [rowClickHighlight, setRowClickHighlight] = useState(false);
	const [rowSelectHighlight, setRowSelectHighlight] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [showPagination, setShowPagination] = useState(false);
	const [showEmpty, setShowEmpty] = useState(false);
	const [cellSpanEnabled, setCellSpanEnabled] = useState(false);
	const [headerGroupEnabled, setHeaderGroupEnabled] = useState(false);
	const [scrollToTop, setScrollToTop] = useState(0);
	const [filterEnabled, setFilterEnabled] = useState(true);
	const [filterState, setFilterState] = useState<FilterState>({
		department: [], city: [], status: [],
		id: '', name: '', age: '', salary: '', email: '', joinDate: '', score: '',
	});
	const [filterDraft, setFilterDraft] = useState<FilterState>({
		department: [], city: [], status: [],
		id: '', name: '', age: '', salary: '', email: '', joinDate: '', score: '',
	});
	const [activeFilterKey, setActiveFilterKey] = useState<string | null>(null);

	const [data, setData] = useState<DemoItem[]>(() => generateData(500, false));

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target.closest('[data-filter-dropdown]') && !target.closest('[data-filter-trigger]')) {
				setActiveFilterKey(null);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	const regenerateData = useCallback(() => {
		setLoading(true);
		setTimeout(() => {
			setData(generateData(dataCount, treeEnabled));
			setLoading(false);
		}, 600);
	}, [dataCount, treeEnabled]);

	const filteredData = useMemo(() => {
		let result = data;
		if (filterState.department.length > 0) {
			result = result.filter((item) => filterState.department.includes(item.department));
		}
		if (filterState.city.length > 0) {
			result = result.filter((item) => filterState.city.includes(item.city));
		}
		if (filterState.status.length > 0) {
			result = result.filter((item) => filterState.status.includes(item.status));
		}
		if (filterState.id) {
			const kw = filterState.id.toLowerCase();
			result = result.filter((item) => String(item.id).toLowerCase().includes(kw));
		}
		if (filterState.name) {
			const kw = filterState.name.toLowerCase();
			result = result.filter((item) => item.name.toLowerCase().includes(kw));
		}
		if (filterState.age) {
			const kw = filterState.age.toLowerCase();
			result = result.filter((item) => String(item.age).includes(kw));
		}
		if (filterState.salary) {
			const kw = filterState.salary.toLowerCase();
			result = result.filter((item) => String(item.salary).includes(kw));
		}
		if (filterState.email) {
			const kw = filterState.email.toLowerCase();
			result = result.filter((item) => item.email.toLowerCase().includes(kw));
		}
		if (filterState.joinDate) {
			const kw = filterState.joinDate.toLowerCase();
			result = result.filter((item) => item.joinDate.toLowerCase().includes(kw));
		}
		if (filterState.score) {
			const kw = filterState.score.toLowerCase();
			result = result.filter((item) => String(item.score).includes(kw));
		}
		return result;
	}, [data, filterState]);

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

	const toggleFilterDraft = useCallback((colKey: CheckboxFilterKeys, value: string) => {
		setFilterDraft((prev) => {
			const arr = prev[colKey] as string[];
			const next = arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value];
			return { ...prev, [colKey]: next };
		});
	}, []);

	const confirmFilter = useCallback((colKey: keyof FilterState) => {
		setFilterState((prev) => ({ ...prev, [colKey]: filterDraft[colKey] }));
		setActiveFilterKey(null);
	}, [filterDraft]);

	const resetFilterDraft = useCallback((colKey: keyof FilterState) => {
		setFilterDraft((prev) => {
			const old = prev[colKey];
			return { ...prev, [colKey]: Array.isArray(old) ? [] : '' };
		});
	}, []);

	const clearAllFilters = useCallback(() => {
		setFilterState({
			department: [], city: [], status: [],
			id: '', name: '', age: '', salary: '', email: '', joinDate: '', score: '',
		});
		setFilterDraft({
			department: [], city: [], status: [],
			id: '', name: '', age: '', salary: '', email: '', joinDate: '', score: '',
		});
	}, []);

	const filterIconRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const getDropdownPosition = useCallback((colKey: string): CSSProperties => {
		const iconEl = filterIconRefs.current[colKey];
		if (!iconEl) return { display: 'none' };
		const rect = iconEl.getBoundingClientRect();
		return {
			position: 'fixed',
			top: rect.bottom + 4,
			left: rect.left,
			zIndex: 9999,
		};
	}, []);

	const renderFilterDropdown = useCallback(
		(colKey: CheckboxFilterKeys, options: string[]) => {
			if (!filterEnabled) return undefined;
			const isOpen = activeFilterKey === colKey;
			const selected = filterDraft[colKey] as string[];
			const filtered = (filterState[colKey] as string[]).length > 0;

			return (
				<div
					ref={(el) => { filterIconRefs.current[colKey] = el; }}
					data-filter-trigger
				>
					<TableCoreFilterIcon
						visible={isOpen}
						filtered={filtered}
						onClick={() => {
							if (isOpen) {
								setActiveFilterKey(null);
							} else {
								setFilterDraft((prev) => ({ ...prev, [colKey]: [...(filterState[colKey] as string[])] }));
								setActiveFilterKey(colKey);
							}
						}}
					>
						<svg viewBox="64 64 896 896" width="12" height="12" fill="currentColor">
							<path d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376.3V842c0 11 9 20 20 20h328c11 0 20-9 20-20V578.3L907.7 202c12.2-21.3-3.1-48-27.6-48z" />
						</svg>
					</TableCoreFilterIcon>
					{isOpen && createPortal(
						<div style={getDropdownPosition(colKey)} data-filter-dropdown>
							<div className={styles.filterDropdown}>
								<div className={styles.filterList}>
									{options.map((opt) => (
										<div
											key={opt}
											className={styles.filterItem}
											onClick={() => toggleFilterDraft(colKey, opt)}
										>
											<input
												type="checkbox"
												checked={selected.includes(opt)}
												readOnly
												style={{ pointerEvents: 'none' }}
											/>
											<span>{opt}</span>
										</div>
									))}
								</div>
								<div className={styles.filterFooter}>
									<button className={styles.filterFooterBtn} onClick={() => resetFilterDraft(colKey)}>
										重置
									</button>
									<button className={`${styles.filterFooterBtn} ${styles.confirm}`} onClick={() => confirmFilter(colKey)}>
										确定
									</button>
								</div>
							</div>
						</div>,
						document.body,
					)}
				</div>
			);
		},
		[filterEnabled, activeFilterKey, filterState, filterDraft, toggleFilterDraft, confirmFilter, resetFilterDraft, getDropdownPosition],
	);

	const renderTextFilter = useCallback(
		(colKey: TextFilterKeys, placeholder: string) => {
			if (!filterEnabled) return undefined;
			const isOpen = activeFilterKey === colKey;
			const draftValue = filterDraft[colKey] as string;
			const filtered = !!(filterState[colKey] as string);

			return (
				<div
					ref={(el) => { filterIconRefs.current[colKey] = el; }}
					data-filter-trigger
				>
					<TableCoreFilterIcon
						visible={isOpen}
						filtered={filtered}
						onClick={() => {
							if (isOpen) {
								setActiveFilterKey(null);
							} else {
								setFilterDraft((prev) => ({ ...prev, [colKey]: filterState[colKey] as string }));
								setActiveFilterKey(colKey);
							}
						}}
					>
						<svg viewBox="64 64 896 896" width="12" height="12" fill="currentColor">
							<path d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376.3V842c0 11 9 20 20 20h328c11 0 20-9 20-20V578.3L907.7 202c12.2-21.3-3.1-48-27.6-48z" />
						</svg>
					</TableCoreFilterIcon>
					{isOpen && createPortal(
						<div style={getDropdownPosition(colKey)} data-filter-dropdown>
							<div className={styles.filterDropdown}>
								<div className={styles.filterSearchBox}>
									<input
										className={styles.filterSearchInput}
										placeholder={placeholder}
										value={draftValue}
										onChange={(e) => setFilterDraft((prev) => ({ ...prev, [colKey]: e.target.value }))}
										onKeyDown={(e) => {
											if (e.key === 'Enter') confirmFilter(colKey);
										}}
									/>
								</div>
								<div className={styles.filterFooter}>
									<button className={styles.filterFooterBtn} onClick={() => resetFilterDraft(colKey)}>
										重置
									</button>
									<button className={`${styles.filterFooterBtn} ${styles.confirm}`} onClick={() => confirmFilter(colKey)}>
										确定
									</button>
								</div>
							</div>
						</div>,
						document.body,
					)}
				</div>
			);
		},
		[filterEnabled, activeFilterKey, filterState, filterDraft, confirmFilter, resetFilterDraft, getDropdownPosition],
	);

	const getColHighlight = useCallback((colKey: keyof FilterState): string[] | undefined => {
		const colFilter = filterState[colKey];
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
	}, [filterState, highlightKeywords]);

	const columns: Table2Columns<DemoItem, SummaryItem> = useMemo(() => {
		const baseColumns: Table2Columns<DemoItem, SummaryItem> = [
			{
				title: 'ID',
				key: 'id',
				width: 120,
				fixed: 'left',
				resize: true,
				filter: renderTextFilter('id', '搜索ID...'),
				highlightKeywords: getColHighlight('id'),
			},
			{
				title: '姓名',
				key: 'name',
				width: 150,
				resize: true,
				filter: renderTextFilter('name', '搜索姓名...'),
				highlightKeywords: getColHighlight('name'),
			},
			{
				title: '年龄',
				key: 'age',
				width: 100,
				align: 'center',
				resize: true,
				sorter: true,
				filter: renderTextFilter('age', '搜索年龄...'),
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
				filter: renderFilterDropdown('department', departments),
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
				filter: renderFilterDropdown('city', cities),
				highlightKeywords: getColHighlight('city'),
			},
			{
				title: '薪资',
				key: 'salary',
				width: 130,
				align: 'right',
				resize: true,
				sorter: true,
				filter: renderTextFilter('salary', '搜索薪资...'),
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
				filter: renderFilterDropdown('status', statuses),
				highlightKeywords: getColHighlight('status'),
				render: (item) => {
					const colorMap: Record<string, string> = { 在职: '#52c41a', 休假: '#faad14', 出差: '#1890ff', 离职: '#ff4d4f' };
					return <span style={{ color: colorMap[item.status] || '#999' }}>● {item.status}</span>;
				},
			},
			{
				title: '邮箱',
				key: 'email',
				width: 220,
				resize: true,
				filter: renderTextFilter('email', '搜索邮箱...'),
				highlightKeywords: getColHighlight('email'),
			},
			{
				title: '入职日期',
				key: 'joinDate',
				width: 140,
				resize: true,
				sorter: true,
				filter: renderTextFilter('joinDate', '搜索日期...'),
				highlightKeywords: getColHighlight('joinDate'),
			},
			{
				title: '评分',
				key: 'score',
				width: 100,
				align: 'center',
				resize: true,
				sorter: true,
				filter: renderTextFilter('score', '搜索评分...'),
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
					filter: renderTextFilter('id', '搜索ID...'),
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
							filter: renderTextFilter('name', '搜索姓名...'),
							highlightKeywords: getColHighlight('name'),
						},
						{
							title: '年龄',
							key: 'age',
							width: 100,
							align: 'center' as const,
							resize: true,
							sorter: true,
							filter: renderTextFilter('age', '搜索年龄...'),
							highlightKeywords: getColHighlight('age'),
							summaryRender: (item: SummaryItem) => <span style={{ fontWeight: 600 }}>{item.avgAge}</span>,
						},
						{
							title: '邮箱',
							key: 'email',
							width: 220,
							resize: true,
							filter: renderTextFilter('email', '搜索邮箱...'),
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
							filter: renderFilterDropdown('department', departments),
							highlightKeywords: getColHighlight('department'),
						},
						{
							title: '城市',
							key: 'city',
							width: 120,
							resize: true,
							sorter: true,
							filter: renderFilterDropdown('city', cities),
							highlightKeywords: getColHighlight('city'),
						},
						{
							title: '薪资',
							key: 'salary',
							width: 130,
							align: 'right' as const,
							resize: true,
							sorter: true,
							filter: renderTextFilter('salary', '搜索薪资...'),
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
							filter: renderFilterDropdown('status', statuses),
							highlightKeywords: getColHighlight('status'),
							render: (item: DemoItem) => {
								const colorMap: Record<string, string> = { 在职: '#52c41a', 休假: '#faad14', 出差: '#1890ff', 离职: '#ff4d4f' };
								return <span style={{ color: colorMap[item.status] || '#999' }}>● {item.status}</span>;
							},
						},
						{ title: '入职日期', key: 'joinDate', width: 140, resize: true, sorter: true, filter: renderTextFilter('joinDate', '搜索日期...'), highlightKeywords: getColHighlight('joinDate') },
						{
							title: '评分',
							key: 'score',
							width: 100,
							align: 'center' as const,
							resize: true,
							sorter: true,
							filter: renderTextFilter('score', '搜索评分...'),
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
	}, [cellSpanEnabled, filteredData, headerGroupEnabled, renderFilterDropdown, renderTextFilter, getColHighlight]);

	const treeExpand = useMemo(() => {
		if (!treeEnabled) return undefined;
		return {
			children: 'children' as const,
			renderIconKey: 'name',
			indentSize: 20,
			defaultExpandAll: false,
		};
	}, [treeEnabled]);

	const rowSelection = useMemo(() => {
		if (!selectionEnabled) return undefined;
		return {
			selectedKeys,
			setSelectedKeys,
			renderCheckbox: ({
				checked,
				indeterminate,
				disabled,
				onChange,
			}: {
				checked: boolean;
				indeterminate?: boolean;
				disabled?: boolean;
				onChange: (checked: boolean) => void;
			}) => (
				<input
					type="checkbox"
					checked={checked}
					ref={(el) => {
						if (el) el.indeterminate = !!indeterminate;
					}}
					disabled={disabled}
					onChange={(e) => onChange(e.target.checked)}
					style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
				/>
			),
			getDisabled: (item: DemoItem) => item.status === '离职',
		};
	}, [selectionEnabled, selectedKeys]);

	const rowDraggable = useMemo(() => {
		if (!dragEnabled) return undefined;
		return {
			onDragEnd: ({
				activeKey,
				overKey,
				arrayMove,
			}: {
				activeKey: string;
				overKey: string;
				arrayMove: <T>(array: T[], from: number, to: number) => T[];
			}) => {
				const activeIndex = data.findIndex((item) => item.id === activeKey);
				const overIndex = data.findIndex((item) => item.id === overKey);
				if (activeIndex !== -1 && overIndex !== -1) {
					setData(arrayMove(data, activeIndex, overIndex));
				}
			},
		};
	}, [dragEnabled, data]);

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
		[data],
	);

	const handleHighlightSearch = useCallback(() => {
		if (highlightInput.trim()) {
			setHighlightKeywords([highlightInput.trim()]);
		} else {
			setHighlightKeywords([]);
		}
	}, [highlightInput]);

	const handleScrollTo = useCallback(() => {
		tableRef.current?.scrollTo({ top: scrollToTop, behavior: 'smooth' });
	}, [scrollToTop]);

	const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

	const hasActiveFilters =
		filterState.department.length > 0 || filterState.city.length > 0 || filterState.status.length > 0 ||
		!!filterState.id || !!filterState.name || !!filterState.age || !!filterState.salary ||
		!!filterState.email || !!filterState.joinDate || !!filterState.score;

	return (
		<div className={styles.app} data-theme={theme}>
			<div className={styles.header}>
				<span className={styles.title}>VirtualTable 全功能演示</span>
				<div className={styles.headerRight}>
					<span style={{ fontSize: 12, color: '#888' }}>数据量: {displayData.length} 行</span>
					<span style={{ fontSize: 12, color: '#888' }}>选中: {selectedKeys.length} 行</span>
					{hasActiveFilters && <span style={{ fontSize: 12, color: '#1890ff' }}>筛选中</span>}
				</div>
			</div>

			<div className={styles.body}>
				<div className={styles.sidebar}>
					<div className={styles.section}>
						<div className={styles.sectionTitle}>🎨 主题与样式</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>深色主题</span>
							<Toggle active={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
						</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>显示边框</span>
							<Toggle active={bordered} onChange={setBordered} />
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>📊 数据控制</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>数据量</span>
							<select className={styles.select} value={dataCount} onChange={(e) => setDataCount(Number(e.target.value))}>
								<option value={10}>10</option>
								<option value={100}>100</option>
								<option value={500}>500</option>
								<option value={1000}>1,000</option>
								<option value={5000}>5,000</option>
								<option value={10000}>10,000</option>
								<option value={100000}>100,000</option>
							</select>
						</div>
						<div className={styles.controlRow}>
							<button className={styles.btn} onClick={regenerateData}>
								重新生成数据
							</button>
						</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>加载状态</span>
							<Toggle active={loading} onChange={setLoading} />
						</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>空数据</span>
							<Toggle active={showEmpty} onChange={setShowEmpty} />
						</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>分页器</span>
							<Toggle active={showPagination} onChange={setShowPagination} />
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>🔎 列筛选</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>启用列筛选</span>
							<Toggle active={filterEnabled} onChange={(v) => { setFilterEnabled(v); if (!v) clearAllFilters(); }} />
						</div>
						{hasActiveFilters && (
							<div className={styles.controlRow}>
								<button className={styles.btn} onClick={clearAllFilters}>
									清除所有筛选
								</button>
							</div>
						)}
						{filterState.department.length > 0 && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									部门: {filterState.department.join('、')}
								</span>
							</div>
						)}
						{filterState.city.length > 0 && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									城市: {filterState.city.join('、')}
								</span>
							</div>
						)}
						{filterState.status.length > 0 && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									状态: {filterState.status.join('、')}
								</span>
							</div>
						)}
						{filterState.id && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									ID: "{filterState.id}"
								</span>
							</div>
						)}
						{filterState.name && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									姓名: "{filterState.name}"
								</span>
							</div>
						)}
						{filterState.age && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									年龄: "{filterState.age}"
								</span>
							</div>
						)}
						{filterState.salary && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									薪资: "{filterState.salary}"
								</span>
							</div>
						)}
						{filterState.email && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									邮箱: "{filterState.email}"
								</span>
							</div>
						)}
						{filterState.joinDate && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									入职日期: "{filterState.joinDate}"
								</span>
							</div>
						)}
						{filterState.score && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									评分: "{filterState.score}"
								</span>
							</div>
						)}
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>🌳 树形展开</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>启用树形</span>
							<Toggle
								active={treeEnabled}
								onChange={(v) => {
									setTreeEnabled(v);
									regenerateData();
								}}
							/>
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>✅ 行选择</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>启用行选择</span>
							<Toggle active={selectionEnabled} onChange={setSelectionEnabled} />
						</div>
						{selectionEnabled && (
							<div className={styles.controlRow}>
								<button className={styles.btn} onClick={() => setSelectedKeys([])}>
									清空选择
								</button>
							</div>
						)}
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>🔀 行拖拽</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>启用拖拽</span>
							<Toggle active={dragEnabled} onChange={setDragEnabled} />
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>🔍 关键字高亮</div>
						<div className={styles.controlRow}>
							<input
								className={styles.input}
								placeholder="输入关键字..."
								value={highlightInput}
								onChange={(e) => setHighlightInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleHighlightSearch()}
							/>
							<button className={styles.btn} onClick={handleHighlightSearch}>
								搜索
							</button>
						</div>
						{highlightKeywords.length > 0 && (
							<div className={styles.controlRow}>
								<span className={styles.label} style={{ color: '#1890ff' }}>
									高亮: "{highlightKeywords[0]}"
								</span>
								<button
									className={styles.btn}
									onClick={() => {
										setHighlightKeywords([]);
										setHighlightInput('');
									}}
								>
									清除
								</button>
							</div>
						)}
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>📈 总结栏</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>显示总结栏</span>
							<Toggle active={showSummary} onChange={setShowSummary} />
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>🎨 行高亮</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>悬停高亮</span>
							<Toggle active={rowHoverHighlight} onChange={setRowHoverHighlight} />
						</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>点击高亮</span>
							<Toggle active={rowClickHighlight} onChange={setRowClickHighlight} />
						</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>选中高亮</span>
							<Toggle active={rowSelectHighlight} onChange={setRowSelectHighlight} />
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>🧩 高级功能</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>表头分组</span>
							<Toggle active={headerGroupEnabled} onChange={setHeaderGroupEnabled} />
						</div>
						<div className={styles.controlRow}>
							<span className={styles.label}>合并单元格</span>
							<Toggle active={cellSpanEnabled} onChange={setCellSpanEnabled} />
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>🔧 命令式 API</div>
						<div className={styles.controlRow}>
							<input
								className={styles.input}
								type="number"
								placeholder="滚动到..."
								value={scrollToTop}
								onChange={(e) => setScrollToTop(Number(e.target.value))}
							/>
							<button className={styles.btn} onClick={handleScrollTo}>
								scrollTo
							</button>
						</div>
						<div className={styles.controlRow}>
							<button className={styles.btn} onClick={() => tableRef.current?.clearResized()}>
								clearResized
							</button>
						</div>
					</div>
				</div>

				<div className={styles.main}>
					<div className={styles.tableWrapper}>
						<Table2<DemoItem, string, SummaryItem>
							tableRef={tableRef}
							rowKey="id"
							data={displayData}
							columns={columns}
							theme={theme}
							bordered={bordered}
							loading={loading}
							highlightKeywords={highlightKeywords.length > 0 ? highlightKeywords : undefined}
							sorter={{ ...sorter, onSortChange: handleSortChange }}
							summaryData={summaryData}
							treeExpand={treeExpand}
							rowSelection={rowSelection}
							rowDraggable={rowDraggable}
							rowBgHighlight={{
								rowHover: rowHoverHighlight,
								rowClick: rowClickHighlight,
								rowSelect: rowSelectHighlight,
							}}
							renderEmpty={<div style={{ padding: 40, textAlign: 'center', color: '#999' }}>暂无数据</div>}
							onResizeEnd={(widths) => console.log('列宽变更:', widths)}
							pagination={
								showPagination
									? (() => {
											const pages: number[] = [];
											const maxShow = 5;
											let start = Math.max(1, currentPage - Math.floor(maxShow / 2));
											const end = Math.min(totalPages, start + maxShow - 1);
											start = Math.max(1, end - maxShow + 1);
											for (let i = start; i <= end; i++) pages.push(i);
											return (
												<div className={styles.paginationWrapper}>
													<span className={styles.pageInfo}>
														共 {filteredData.length} 条，第 {currentPage}/{totalPages} 页
													</span>
													<button className={styles.pageBtn} disabled={currentPage <= 1} onClick={() => setCurrentPage(1)}>
														首页
													</button>
													<button
														className={styles.pageBtn}
														disabled={currentPage <= 1}
														onClick={() => setCurrentPage((p) => p - 1)}
													>
														上一页
													</button>
													{pages.map((p) => (
														<button
															key={p}
															className={`${styles.pageBtn} ${p === currentPage ? styles.active : ''}`}
															onClick={() => setCurrentPage(p)}
														>
															{p}
														</button>
													))}
													<button
														className={styles.pageBtn}
														disabled={currentPage >= totalPages}
														onClick={() => setCurrentPage((p) => p + 1)}
													>
														下一页
													</button>
													<button
														className={styles.pageBtn}
														disabled={currentPage >= totalPages}
														onClick={() => setCurrentPage(totalPages)}
													>
														末页
													</button>
												</div>
											);
										})()
									: undefined
							}
						/>
					</div>
				</div>
			</div>

			<div className={styles.infoBar}>
				<span>💡 左侧面板可控制所有功能开关</span>
				<span>列宽可拖拽调整 | 点击表头排序 | 固定列左右滚动 | 表头筛选图标筛选数据</span>
			</div>
		</div>
	);
};

export default FullDemo;
