import { type RefObject } from 'react';

import styles from '../index.module.less';
import { type Table2Ref } from '../../../TableComponents';
import { type useTableConfig } from '../hooks/useTableConfig';
import { type useFilterState } from '../hooks/useFilterState';
import { type useDataManagement } from '../hooks/useDataManagement';
import { type useTreeState } from '../hooks/useTreeState';
import { type useSelectionState } from '../hooks/useSelectionState';
import { type useDragState } from '../hooks/useDragState';
import { type useHighlightState } from '../hooks/useHighlightState';
import { type useScrollToState } from '../hooks/useSortState';

const Toggle = ({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) => (
	<button className={`${styles.toggle} ${active ? styles.active : ''}`} onClick={() => onChange(!active)}>
		<span className={styles.knob} />
	</button>
);

type ControlPanelProps = {
	config: ReturnType<typeof useTableConfig>;
	filter: ReturnType<typeof useFilterState>;
	dataManagement: ReturnType<typeof useDataManagement>;
	tree: ReturnType<typeof useTreeState>;
	selection: ReturnType<typeof useSelectionState>;
	drag: ReturnType<typeof useDragState>;
	highlight: ReturnType<typeof useHighlightState>;
	scroll: ReturnType<typeof useScrollToState>;
	tableRef: RefObject<Table2Ref>;
};

const ControlPanel = ({ config, filter, dataManagement, tree, selection, drag, highlight, scroll, tableRef }: ControlPanelProps) => {
	return (
		<div className={styles.sidebar}>
			<div className={styles.section}>
				<div className={styles.sectionTitle}>🎨 主题与样式</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>深色主题</span>
					<Toggle active={config.theme === 'dark'} onChange={(v) => config.setTheme(v ? 'dark' : 'light')} />
				</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>显示边框</span>
					<Toggle active={config.bordered} onChange={config.setBordered} />
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>📊 数据控制</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>数据量</span>
					<select className={styles.select} value={dataManagement.dataCount} onChange={(e) => dataManagement.setDataCount(Number(e.target.value))}>
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
					<button className={styles.btn} onClick={() => dataManagement.regenerateData(tree.enabled)}>
						重新生成数据
					</button>
				</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>加载状态</span>
					<Toggle active={dataManagement.loading} onChange={dataManagement.setLoading} />
				</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>空数据</span>
					<Toggle active={dataManagement.showEmpty} onChange={dataManagement.setShowEmpty} />
				</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>分页器</span>
					<Toggle active={dataManagement.showPagination} onChange={dataManagement.setShowPagination} />
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>🔎 列筛选</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>启用列筛选</span>
					<Toggle active={filter.enabled} onChange={(v) => { filter.setEnabled(v); if (!v) filter.clearAll(); }} />
				</div>
				{filter.hasActiveFilters && (
					<div className={styles.controlRow}>
						<button className={styles.btn} onClick={filter.clearAll}>
							清除所有筛选
						</button>
					</div>
				)}
				{(['department', 'city', 'status'] as const).map((key) =>
					filter.state[key].length > 0 ? (
						<div key={key} className={styles.controlRow}>
							<span className={styles.label} style={{ color: '#1890ff' }}>
								{key === 'department' ? '部门' : key === 'city' ? '城市' : '状态'}: {filter.state[key].join('、')}
							</span>
						</div>
					) : null
				)}
				{(['id', 'name', 'age', 'salary', 'email', 'joinDate', 'score'] as const).map((key) =>
					filter.state[key] ? (
						<div key={key} className={styles.controlRow}>
							<span className={styles.label} style={{ color: '#1890ff' }}>
								{key === 'joinDate' ? '入职日期' : key === 'id' ? 'ID' : key === 'name' ? '姓名' : key === 'age' ? '年龄' : key === 'salary' ? '薪资' : key === 'email' ? '邮箱' : '评分'}: "{filter.state[key]}"
							</span>
						</div>
					) : null
				)}
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>🌳 树形展开</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>启用树形</span>
					<Toggle
						active={tree.enabled}
						onChange={(v) => {
							tree.setEnabled(v);
							dataManagement.regenerateData(v);
						}}
					/>
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>✅ 行选择</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>启用行选择</span>
					<Toggle active={selection.enabled} onChange={selection.setEnabled} />
				</div>
				{selection.enabled && (
					<div className={styles.controlRow}>
						<button className={styles.btn} onClick={() => selection.setSelectedKeys([])}>
							清空选择
						</button>
					</div>
				)}
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>🔀 行拖拽</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>启用拖拽</span>
					<Toggle active={drag.enabled} onChange={drag.setEnabled} />
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>🔍 关键字高亮</div>
				<div className={styles.controlRow}>
					<input
						className={styles.input}
						placeholder="输入关键字..."
						value={highlight.highlightInput}
						onChange={(e) => highlight.setHighlightInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && highlight.handleHighlightSearch()}
					/>
					<button className={styles.btn} onClick={highlight.handleHighlightSearch}>
						搜索
					</button>
				</div>
				{highlight.highlightKeywords.length > 0 && (
					<div className={styles.controlRow}>
						<span className={styles.label} style={{ color: '#1890ff' }}>
							高亮: "{highlight.highlightKeywords[0]}"
						</span>
						<button className={styles.btn} onClick={highlight.clearHighlight}>
							清除
						</button>
					</div>
				)}
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>📈 总结栏</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>显示总结栏</span>
					<Toggle active={config.showSummary} onChange={config.setShowSummary} />
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>🎨 行高亮</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>悬停高亮</span>
					<Toggle active={config.rowHoverHighlight} onChange={config.setRowHoverHighlight} />
				</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>点击高亮</span>
					<Toggle active={config.rowClickHighlight} onChange={config.setRowClickHighlight} />
				</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>选中高亮</span>
					<Toggle active={config.rowSelectHighlight} onChange={config.setRowSelectHighlight} />
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>🧩 高级功能</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>表头分组</span>
					<Toggle active={config.headerGroupEnabled} onChange={config.setHeaderGroupEnabled} />
				</div>
				<div className={styles.controlRow}>
					<span className={styles.label}>合并单元格</span>
					<Toggle active={config.cellSpanEnabled} onChange={config.setCellSpanEnabled} />
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.sectionTitle}>🔧 命令式 API</div>
				<div className={styles.controlRow}>
					<input
						className={styles.input}
						type="number"
						placeholder="滚动到..."
						value={scroll.scrollToTop}
						onChange={(e) => scroll.setScrollToTop(Number(e.target.value))}
					/>
					<button className={styles.btn} onClick={scroll.handleScrollTo}>
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
	);
};

export default ControlPanel;
