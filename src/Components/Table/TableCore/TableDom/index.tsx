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
	const { pagination, style, loading, className } = coreProps;
	const { data, hScrollbarState, theme, bordered, resizeFlag, showSummary, summaryData } = props;

	const isEmpty = (data ?? []).length === 0;
	const havePagination = !isEmpty && pagination;
	const haveHScrollbar = hScrollbarState.have && hScrollbarState.width > 0;

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
					vScrollbarState={props.vScrollbarState}
					startResize={props.startResize}
					getHeadCellBg={props.getHeadCellBg}
					finalColumnsArr={props.finalColumnsArr}
					renderHeadPrefix={props.renderHeadPrefix}
					getHeadCellColShow={props.getHeadCellColShow}
					getHeadStickyStyle={props.getHeadStickyStyle}
					gridTemplateColumns={props.gridTemplateColumns}
				/>
				<div className={styles['table-body-container']}>
					<TableBody
						data={props.data}
						theme={props.theme}
						rowKey={props.rowKey}
						resized={props.resized}
						bodyRef={props.bodyRef}
						bordered={props.bordered}
						rowHeight={props.rowHeight}
						tableWidth={props.tableWidth}
						resizeFlag={props.resizeFlag}
						getColKeys={props.getColKeys}
						getRowKeys={props.getRowKeys}
						h_totalSize={props.h_totalSize}
						columnsKeys={props.columnsKeys}
						renderEmpty={props.renderEmpty}
						v_offsetTop={props.v_offsetTop}
						columnsCore={props.columnsCore}
						v_totalSize={props.v_totalSize}
						borderWidth={props.borderWidth}
						sizeCacheMap={props.sizeCacheMap}
						fixedLeftMap={props.fixedLeftMap}
						setPingedMap={props.setPingedMap}
						bodyRowClick={props.bodyRowClick}
						fixedRightMap={props.fixedRightMap}
						getBodyCellBg={props.getBodyCellBg}
						renderBodyDom={props.renderBodyDom}
						bodyWrapperRef={props.bodyWrapperRef}
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
						bodyScrollPlaceholderRef={props.bodyScrollPlaceholderRef}
						hiddenBodyWrapperScrollbar={props.hiddenBodyWrapperScrollbar}
						renderWidthDraggableWrapper={props.renderWidthDraggableWrapper}
					/>
					<ScrollbarV
						bordered={props.bordered}
						v_totalSize={props.v_totalSize}
						vScrollbarState={props.vScrollbarState}
						vScrollbarRef={props.vScrollbarRef}
					/>
				</div>
				<ScrollbarH
					bordered={props.bordered}
					h_totalSize={props.h_totalSize}
					hScrollbarState={props.hScrollbarState}
					vScrollbarState={props.vScrollbarState}
					hScrollbarRef={props.hScrollbarRef}
				/>
				{showSummary && (
					<TableSummary
						bordered={props.bordered}
						summaryData={summaryData}
						rowHeight={props.rowHeight}
						summaryRef={props.summaryRef}
						vScrollbarState={props.vScrollbarState}
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
			{havePagination && <Fragment>{pagination}</Fragment>}
		</TableLoading>
	);
};

export default memo(TableDom) as TableCoreComponent;
