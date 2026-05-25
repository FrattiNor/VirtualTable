import { type CSSProperties, Fragment } from 'react';

import classNames from 'classnames';

import { TableInstanceContext } from '../TableContext';
import useTableInstance, { type TableInstance } from '../useTableInstance';
import styles from './index.module.less';
import ScrollbarH from './ScrollbarH';
import ScrollbarV from './ScrollbarV';
import TableBody from './TableBody';
import TableBodyMock from './TableBodyMock';
import TableHead from './TableHead';
import TableLoading from './TableLoading';
import TableSummary from './TableSummary';
import themeStyles from '../TableTheme/index.theme.module.less';
import { type TableCoreComponent } from '../TableTypes/type';
import { type TableCoreProps } from '../TableTypes/typeProps';

const TableDom = <T,>(coreProps: TableCoreProps<T>) => {
	const props = useTableInstance(coreProps);
	const { pagination, style, loading, className, borderWidth } = coreProps;
	const { data, hScrollbarState, theme, bordered, resizeFlag, showSummary } = props;

	// 是空Table
	const isEmpty = (data ?? []).length === 0;
	// 存在分页器
	const havePagination = !isEmpty && pagination;
	// 存在横向滚动条
	const haveHScrollbar = hScrollbarState.have && hScrollbarState.width > 0;

	// Wrapper Class 样式
	const wrapperClassName = classNames(
		{
			[themeStyles['theme-dark']]: theme === 'dark',
			[themeStyles['theme-light']]: theme === 'light',
		},
		styles['table-wrapper'],
		className,
	);

	// Wrapper Style 样式
	const wrapperStyle: CSSProperties = { ...style };

	// 如果有传borderWidth参数，覆盖class内主题宽度
	if (typeof borderWidth === 'number') {
		// @ts-ignore
		wrapperStyle['--table-cell-border-width'] = `${borderWidth}px`;
	}

	return (
		<TableInstanceContext.Provider value={props as TableInstance<any>}>
			<TableLoading loading={loading} loadingMaxHeight={400} style={wrapperStyle} className={wrapperClassName}>
				<div
					className={classNames(styles['table'], {
						[styles['bordered']]: bordered,
						[styles['any-resize']]: !!resizeFlag,
						// bordered为false，但是显示border-bottom的情况，非空，没有横向滚动条
						[styles['no-bordered-and-show-border-bottom']]: showSummary || (!isEmpty && !bordered && !haveHScrollbar),
					})}
				>
					<TableHead />
					<div className={styles['table-body-container']}>
						<TableBodyMock />
						<div className={styles['table-body-container-inner']}>
							<TableBody />
							<ScrollbarV />
						</div>
						<ScrollbarH />
					</div>
					{showSummary && <TableSummary />}
				</div>
				{havePagination && <Fragment>{pagination}</Fragment>}
			</TableLoading>
		</TableInstanceContext.Provider>
	);
};

export default TableDom as TableCoreComponent;

