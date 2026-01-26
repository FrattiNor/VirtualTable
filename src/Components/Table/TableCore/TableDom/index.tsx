import { Fragment, memo } from 'react';

import classNames from 'classnames';

import useTableInstance from '../useTableInstance';
import styles from './index.module.less';
import ScrollbarH from './ScrollbarH';
import ScrollbarV from './ScrollbarV';
import TableBody from './TableBody';
import TableHead from './TableHead';
import TableLoading from './TableLoading';
import TableSummary from './TableSummary';
import themeStyles from '../TableTheme/index.theme.module.less';
import { type TableCoreComponent } from '../TableTypes/type';
import { type TableCoreProps } from '../TableTypes/typeProps';

const TableDom = <T,>(coreProps: TableCoreProps<T>) => {
	const props = useTableInstance(coreProps);
	const { pagination, style, loading, className, enableScrollStopPropagation } = coreProps;
	const { data, v_scrollbar, h_scrollbar, theme, bordered, resizeFlag, showSummary, summaryData } = props;

	const isEmpty = (data ?? []).length === 0;
	const havePagination = !isEmpty && pagination;
	const haveHScrollbar = h_scrollbar.have && h_scrollbar.width > 0;

	let content = (
		<div
			className={classNames(styles['table'], {
				[styles['bordered']]: bordered,
				[styles['any-resize']]: !!resizeFlag,
				// bordered为false，但是显示border-bottom的情况，非空，没有横向滚动条
				[styles['no-bordered-and-show-border-bottom']]: !isEmpty && !bordered && !haveHScrollbar,
			})}
		>
			<TableHead
				sorter={props.sorter}
				headRef={props.headRef}
				bordered={props.bordered}
				deepLevel={props.deepLevel}
				rowHeight={props.rowHeight}
				resizeFlag={props.resizeFlag}
				getColKeys={props.getColKeys}
				v_scrollbar={props.v_scrollbar}
				startResize={props.startResize}
				getHeadCellBg={props.getHeadCellBg}
				finalColumnsArr={props.finalColumnsArr}
				renderHeadPrefix={props.renderHeadPrefix}
				getHeadCellColShow={props.getHeadCellColShow}
				getHeadStickyStyle={props.getHeadStickyStyle}
				gridTemplateColumns={props.gridTemplateColumns}
			/>
			<div className={styles['table-body-wrapper']}>
				<TableBody
					data={props.data}
					theme={props.theme}
					rowKey={props.rowKey}
					bodyRef={props.bodyRef}
					resized={props.resized}
					bordered={props.bordered}
					rowHeight={props.rowHeight}
					tableWidth={props.tableWidth}
					resizeFlag={props.resizeFlag}
					getColKeys={props.getColKeys}
					getRowKeys={props.getRowKeys}
					columnsKeys={props.columnsKeys}
					renderEmpty={props.renderEmpty}
					v_offsetTop={props.v_offsetTop}
					columnsCore={props.columnsCore}
					v_totalSize={props.v_totalSize}
					borderWidth={props.borderWidth}
					sizeCacheMap={props.sizeCacheMap}
					bodyInnerRef={props.bodyInnerRef}
					fixedLeftMap={props.fixedLeftMap}
					setPingedMap={props.setPingedMap}
					bodyRowClick={props.bodyRowClick}
					fixedRightMap={props.fixedRightMap}
					getBodyCellBg={props.getBodyCellBg}
					renderBodyDom={props.renderBodyDom}
					draggingRowKey={props.draggingRowKey}
					setSizeCacheMap={props.setSizeCacheMap}
					finalColumnsArr={props.finalColumnsArr}
					draggingRowIndex={props.draggingRowIndex}
					rowDraggableMode={props.rowDraggableMode}
					renderCellPrefix={props.renderCellPrefix}
					highlightKeywords={props.highlightKeywords}
					v_measureItemSize={props.v_measureItemSize}
					bodyRowMouseEnter={props.bodyRowMouseEnter}
					bodyRowMouseLeave={props.bodyRowMouseLeave}
					getBodyCellColShow={props.getBodyCellColShow}
					getBodyStickyStyle={props.getBodyStickyStyle}
					colSizeObserverRef={props.colSizeObserverRef}
					draggingRow_notShow={props.draggingRow_notShow}
					gridTemplateColumns={props.gridTemplateColumns}
					RowDraggableWrapper={props.RowDraggableWrapper}
					draggingRow_offsetTop={props.draggingRow_offsetTop}
					getBodyCellColForceShow={props.getBodyCellColForceShow}
					renderWidthDraggableWrapper={props.renderWidthDraggableWrapper}
				/>
				<ScrollbarV
					bodyRef={props.bodyRef}
					bordered={props.bordered}
					v_totalSize={props.v_totalSize}
					v_scrollbar={props.v_scrollbar}
					vScrollbarRef={props.vScrollbarRef}
					getV_virtualCore={props.getV_virtualCore}
				/>
			</div>
			<ScrollbarH
				bodyRef={props.bodyRef}
				bordered={props.bordered}
				h_totalSize={props.h_totalSize}
				h_scrollbar={props.h_scrollbar}
				v_scrollbar={props.v_scrollbar}
				hScrollbarRef={props.hScrollbarRef}
				getH_virtualCore={props.getH_virtualCore}
			/>
			{showSummary && (
				<TableSummary
					bordered={props.bordered}
					summaryData={summaryData}
					rowHeight={props.rowHeight}
					summaryRef={props.summaryRef}
					v_scrollbar={props.v_scrollbar}
					getBodyCellBg={props.getBodyCellBg}
					finalColumnsArr={props.finalColumnsArr}
					bodyRowMouseEnter={props.bodyRowMouseEnter}
					bodyRowMouseLeave={props.bodyRowMouseLeave}
					getHeadStickyStyle={props.getHeadStickyStyle}
					gridTemplateColumns={props.gridTemplateColumns}
					getSummaryCellColShow={props.getSummaryCellColShow}
				/>
			)}
		</div>
	);

	// 如果启用阻止滚动冒泡，额外增加一层dom，触发overflow:scroll，使用sticky固定子元素，隐藏滚动条，最后用overscroll-behavior: contain;阻止滚动穿透
	if (enableScrollStopPropagation) {
		content = (
			<div className={classNames(styles['scroll-stop-propagation'], { [styles['enable']]: !isEmpty && v_scrollbar.have })}>{content}</div>
		);
	}

	return (
		<TableLoading
			style={style}
			loading={loading}
			loadingMaxHeight={400}
			className={classNames(
				{
					[themeStyles['theme-dark']]: theme === 'dark',
					[themeStyles['theme-light']]: theme === 'light',
				},

				styles['table-wrapper'],
				className,
			)}
		>
			{content}
			{havePagination && <Fragment>{pagination}</Fragment>}
		</TableLoading>
	);
};

export default memo(TableDom) as TableCoreComponent;
