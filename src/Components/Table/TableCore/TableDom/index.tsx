import { Fragment, memo } from 'react';

import classNames from 'classnames';

import useTableInstance from '../useTableInstance';
import styles from './index.module.less';
import ScrollbarH from './ScrollbarH';
import ScrollbarV from './ScrollbarV';
import TableBody from './TableBody';
import TableHead from './TableHead';
import TableLoading from './TableLoading';
import { type TableComponent } from '../TableTypes/type';

import type { TableCoreProps } from '../TableTypes/typeProps';

const Table = <T,>(coreProps: TableCoreProps<T>) => {
	const props = useTableInstance(coreProps);
	const isEmpty = (props.data ?? []).length === 0;
	const havePagination = !isEmpty && coreProps.pagination;
	const haveHScrollbar = props.h_scrollbar.have && props.h_scrollbar.width > 0;

	return (
		<TableLoading
			loadingMaxHeight={400}
			style={coreProps.style}
			loading={coreProps.loading}
			className={classNames(styles['table-wrapper'], coreProps.className, {
				[styles['theme-dark']]: props.theme === 'dark',
				[styles['theme-light']]: props.theme === 'light',
			})}
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
						RowDraggableWrapper={props.RowDraggableWrapper}
						gridTemplateColumns={props.gridTemplateColumns}
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
			{havePagination && <Fragment>{coreProps.pagination}</Fragment>}
		</TableLoading>
	);
};

export default memo(Table) as TableComponent;
