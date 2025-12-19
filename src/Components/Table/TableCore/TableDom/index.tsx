import { Fragment, memo } from 'react';

import classNames from 'classnames';

import useTableInstance from '../useTableInstance';
import styles from './index.module.less';
import ScrollbarH from './ScrollbarH';
import ScrollbarV from './ScrollbarV';
import TableBody from './TableBody';
import TableHead from './TableHead';
import TableLoading from './TableLoading';

import type { TableCoreProps } from '../TableTypes/typeProps';

const Table = <T,>(coreProps: TableCoreProps<T>) => {
	const props = useTableInstance(coreProps);
	const isEmpty = (props.data ?? []).length === 0;
	const havePagination = !isEmpty && coreProps.pagination;

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
					[styles['no-bordered-and-no-h-scrollbar']]: !props.bordered && !(props.h_scrollbar.width > 0),
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
					getHeadCellColShow={props.getHeadCellColShow}
					splitColumnsArr={props.splitColumnsArr}
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
						columnsCore={props.columnsCore}
						v_totalSize={props.v_totalSize}
						bodyRowClick={props.bodyRowClick}
						sizeCacheMap={props.sizeCacheMap}
						bodyInnerRef={props.bodyInnerRef}
						setPingedMap={props.setPingedMap}
						fixedLeftMap={props.fixedLeftMap}
						fixedRightMap={props.fixedRightMap}
						getBodyCellBg={props.getBodyCellBg}
						getV_OffsetTop={props.getV_OffsetTop}
						setSizeCacheMap={props.setSizeCacheMap}
						splitColumnsArr={props.splitColumnsArr}
						highlightKeywords={props.highlightKeywords}
						v_measureItemSize={props.v_measureItemSize}
						bodyRowMouseEnter={props.bodyRowMouseEnter}
						bodyRowMouseLeave={props.bodyRowMouseLeave}
						getBodyCellColShow={props.getBodyCellColShow}
						getBodyCellRowShow={props.getBodyCellRowShow}
						getBodyStickyStyle={props.getBodyStickyStyle}
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

export default memo(Table) as typeof Table;
