import { type RefObject, useRef } from 'react';

import styles from './index.module.less';
import { Table2, type Table2Ref } from '../../TableComponents';
import { type DemoItem, type SummaryItem } from './types';
import { useTableConfig } from './hooks/useTableConfig';
import { useFilterState } from './hooks/useFilterState';
import { useDataManagement } from './hooks/useDataManagement';
import { useTreeState } from './hooks/useTreeState';
import { useSelectionState } from './hooks/useSelectionState';
import { useDragState } from './hooks/useDragState';
import { useHighlightState } from './hooks/useHighlightState';
import { useSortState, useScrollToState } from './hooks/useSortState';
import { useColumns } from './hooks/useColumns';
import ControlPanel from './components/ControlPanel';

const FullDemo = () => {
	const tableRef = useRef<Table2Ref>(null) as RefObject<Table2Ref>;

	const config = useTableConfig();
	const filter = useFilterState();
	const dataManagement = useDataManagement(filter.filterData, config.showSummary);
	const tree = useTreeState();
	const selection = useSelectionState();
	const drag = useDragState(dataManagement.data, dataManagement.setData);
	const highlight = useHighlightState();
	const { sorter, handleSortChange } = useSortState(dataManagement.data, dataManagement.setData);
	const scroll = useScrollToState(tableRef);

	const { columns } = useColumns({
		filter,
		highlightKeywords: highlight.highlightKeywords,
		cellSpanEnabled: config.cellSpanEnabled,
		headerGroupEnabled: config.headerGroupEnabled,
		filteredData: dataManagement.filteredData,
	});

	return (
		<div className={styles.app} data-theme={config.theme}>
			<div className={styles.header}>
				<span className={styles.title}>VirtualTable 全功能演示</span>
				<div className={styles.headerRight}>
					<span style={{ fontSize: 12, color: '#888' }}>数据量: {dataManagement.displayData.length} 行</span>
					<span style={{ fontSize: 12, color: '#888' }}>选中: {selection.selectedKeys.length} 行</span>
					{filter.hasActiveFilters && <span style={{ fontSize: 12, color: '#1890ff' }}>筛选中</span>}
				</div>
			</div>

			<div className={styles.body}>
				<ControlPanel
					config={config}
					filter={filter}
					dataManagement={dataManagement}
					tree={tree}
					selection={selection}
					drag={drag}
					highlight={highlight}
					scroll={scroll}
					tableRef={tableRef}
				/>

				<div className={styles.main}>
					<div className={styles.tableWrapper}>
						<Table2<DemoItem, string, SummaryItem>
							tableRef={tableRef}
							rowKey="id"
							data={dataManagement.displayData}
							columns={columns}
							theme={config.theme}
							bordered={config.bordered}
							loading={dataManagement.loading}
							highlightKeywords={highlight.highlightKeywords.length > 0 ? highlight.highlightKeywords : undefined}
							sorter={{ ...sorter, onSortChange: handleSortChange }}
							summaryData={dataManagement.summaryData}
							treeExpand={tree.treeExpand}
							rowSelection={selection.rowSelection}
							rowDraggable={drag.rowDraggable}
							rowBgHighlight={config.rowBgHighlight}
							renderEmpty={<div style={{ padding: 40, textAlign: 'center', color: '#999' }}>暂无数据</div>}
							onResizeEnd={(widths) => console.log('列宽变更:', widths)}
							pagination={
								dataManagement.showPagination
									? (() => {
											const { currentPage, totalPages, setCurrentPage, filteredData } = dataManagement;
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
