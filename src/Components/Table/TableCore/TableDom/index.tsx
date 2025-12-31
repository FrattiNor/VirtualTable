import { Fragment, memo } from 'react';

import classNames from 'classnames';

import { type TableInstance } from '../useTableInstance';
import styles from './index.module.less';
import ScrollbarH from './ScrollbarH';
import ScrollbarV from './ScrollbarV';
import TableBody from './TableBody';
import TableHead from './TableHead';
import TableLoading from './TableLoading';
import themeStyles from '../TableTheme/index.theme.module.less';

const TableDom = <T,>(props: TableInstance<T>) => {
	const { data, pagination, h_scrollbar, style, loading, className } = props;

	const isEmpty = (data ?? []).length === 0;
	const havePagination = !isEmpty && pagination;
	const haveHScrollbar = h_scrollbar.have && h_scrollbar.width > 0;

	return (
		<TableLoading
			style={style}
			loading={loading}
			loadingMaxHeight={400}
			className={classNames(
				{ [themeStyles['theme-dark']]: props.theme === 'dark', [themeStyles['theme-light']]: props.theme === 'light' },
				styles['table-wrapper'],
				className,
			)}
		>
			<div
				className={classNames(styles['table'], {
					[styles['bordered']]: props.bordered,
					// bordered为false，但是显示border-bottom的情况，非空，没有横向滚动条
					[styles['no-bordered-and-show-border-bottom']]: !isEmpty && !props.bordered && !haveHScrollbar,
				})}
			>
				<TableHead
					headRef={props.headRef}
					bordered={props.bordered}
					deepLevel={props.deepLevel}
					rowHeight={props.rowHeight}
					resizeFlag={props.resizeFlag}
					getColKeys={props.getColKeys}
					v_scrollbar={props.v_scrollbar}
					startResize={props.startResize}
					getHeadCellBg={props.getHeadCellBg}
					splitColumnsArr={props.splitColumnsArr}
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
						renderEmpty={props.renderEmpty}
						v_offsetTop={props.v_offsetTop}
						columnsCore={props.columnsCore}
						v_totalSize={props.v_totalSize}
						sizeCacheMap={props.sizeCacheMap}
						bodyInnerRef={props.bodyInnerRef}
						fixedLeftMap={props.fixedLeftMap}
						setPingedMap={props.setPingedMap}
						bodyRowClick={props.bodyRowClick}
						fixedRightMap={props.fixedRightMap}
						getBodyCellBg={props.getBodyCellBg}
						renderBodyDom={props.renderBodyDom}
						setSizeCacheMap={props.setSizeCacheMap}
						splitColumnsArr={props.splitColumnsArr}
						rowDraggableMode={props.rowDraggableMode}
						renderCellPrefix={props.renderCellPrefix}
						highlightKeywords={props.highlightKeywords}
						v_measureItemSize={props.v_measureItemSize}
						bodyRowMouseEnter={props.bodyRowMouseEnter}
						bodyRowMouseLeave={props.bodyRowMouseLeave}
						getBodyStickyStyle={props.getBodyStickyStyle}
						gridTemplateColumns={props.gridTemplateColumns}
						RowDraggableWrapper={props.RowDraggableWrapper}
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
			</div>
			{havePagination && <Fragment>{pagination}</Fragment>}
		</TableLoading>
	);
};

export default memo(TableDom) as typeof TableDom;
