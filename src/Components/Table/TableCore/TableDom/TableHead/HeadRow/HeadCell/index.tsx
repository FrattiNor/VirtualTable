import { Fragment, memo, useMemo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import ResizeHandle from './ResizeHandle';
import SortIcon from './SortIcon';
import { getCellTitle, getResize, isEmptyRender, isStrNum } from '../../../../TableUtils';

import type { TableCoreColumn, TableCoreColumnGroup } from '../../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	| 'splitColumnsArr'
	| 'bordered'
	| 'rowHeight'
	| 'getHeadStickyStyle'
	| 'startResize'
	| 'resizeFlag'
	| 'getHeadCellBg'
	| 'renderHeadPrefix'
	| 'getColKeys'
	| 'sorter'
> & {
	rowIndexStart: number;
	rowIndexEnd: number;
	colIndexStart: number;
	colIndexEnd: number;
} & (
		| {
				isLeaf: true;
				column: TableCoreColumn<T>;
		  }
		| {
				isLeaf: false;
				column: TableCoreColumnGroup<T>;
		  }
	);

const HeadCell = <T,>(props: Props<T>) => {
	const {
		isLeaf,
		column,
		sorter,
		splitColumnsArr,
		bordered,
		rowIndexStart,
		rowIndexEnd,
		colIndexStart,
		colIndexEnd,
		rowHeight,
		getColKeys,
		getHeadStickyStyle,
		getHeadCellBg,
		renderHeadPrefix,
	} = props;

	// sort的一些参数
	const sortKey = sorter?.sortKey;
	const sortValue = sorter?.sortValue;
	const onSortChange = sorter?.onSortChange;
	// 是否可以sort
	const couldSort = isLeaf && column.sorter === true;
	// 当前cell的sort的值
	const currentSortValue = sortKey === column.key ? sortValue : undefined;
	// 是否可以resize
	const resize = useMemo(() => getResize(splitColumnsArr, colIndexStart, colIndexEnd), [splitColumnsArr, colIndexStart, colIndexEnd]);
	// 列keys
	const colKeys = useMemo(() => getColKeys(colIndexStart, colIndexEnd), [colIndexStart, colIndexEnd]);
	// 最终渲染结果
	const renderDom = !isEmptyRender(column.title) ? column.title : '-';
	// 筛选dom
	const filterDom = column.filter;
	// 当前head的title
	const title = getCellTitle(renderDom);
	// 是否可省略
	const canEllipsis = isStrNum(renderDom);
	// 当前head的背景色
	const backgroundColor = getHeadCellBg({ colKeys });
	// 当前head的sticky情况
	const { stickyStyle, hiddenLeftBorder, leftLastPinged, rightLastPinged } = getHeadStickyStyle({ colKeys });
	// 当前head配置的style
	const style = column.headStyle;
	// 当前head配置的align
	// 叶子节点默认为left
	// 父节点如果span为1默认为left，否则为center
	const align = column.align ?? (isLeaf ? 'left' : colIndexStart === colIndexEnd ? 'left' : 'center');
	// cell 点击触发sort变更
	const onClick = () => {
		if (couldSort) {
			const nextSortValue = currentSortValue === undefined ? 'asc' : currentSortValue === 'asc' ? 'desc' : undefined;
			if (typeof onSortChange === 'function') onSortChange({ sortKey: column.key, sortValue: nextSortValue });
		}
	};

	return (
		<div
			title={title}
			onClick={couldSort ? onClick : undefined}
			className={classNames(styles['head-cell'], {
				[styles['bordered']]: bordered,
				[styles['could-sort']]: couldSort,
				[styles['first-col']]: colIndexStart === 0,
				[styles['left-last-pinged']]: leftLastPinged,
				[styles['right-last-pinged']]: rightLastPinged,
				[styles['hidden-left-border']]: colIndexStart !== 0 && hiddenLeftBorder,
			})}
			style={{
				backgroundColor,
				gridRow: `${rowIndexStart + 1}/${rowIndexEnd + 2}`,
				gridColumn: `${colIndexStart + 1}/${colIndexEnd + 2}`,
				minHeight: (rowIndexEnd - rowIndexStart + 1) * rowHeight,
				justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
				...stickyStyle,
				...style,
			}}
		>
			{(() => {
				// head主要内容
				const content = (
					<Fragment>
						{isLeaf && typeof renderHeadPrefix === 'function' ? renderHeadPrefix(column.key) : undefined}
						{!canEllipsis ? (
							<div className={styles['block-wrapper']}>{renderDom}</div>
						) : (
							<div className={styles['text-wrapper']}>{renderDom}</div>
						)}
					</Fragment>
				);

				// 不存在filter 且 不存在sort
				if (!filterDom && !couldSort) return content;

				// 存在filter 或 操作sort
				return (
					<Fragment>
						<div
							className={classNames({
								[styles['head-cell-inner']]: align !== 'center',
								[styles['head-cell-inner-center']]: align === 'center',
							})}
						>
							{content}
						</div>

						{couldSort && (
							<div className={styles['sort-wrapper']}>
								<SortIcon sortValue={currentSortValue} />
							</div>
						)}

						{filterDom && (
							<div className={styles['filer-wrapper']} onClick={(e) => e.stopPropagation()}>
								{filterDom}
							</div>
						)}
					</Fragment>
				);
			})()}

			{resize === true && (
				<ResizeHandle
					columnKey={column.key}
					colIndexEnd={colIndexEnd}
					colIndexStart={colIndexStart}
					resizeFlag={props.resizeFlag}
					startResize={props.startResize}
				/>
			)}
		</div>
	);
};

export default memo(HeadCell) as typeof HeadCell;
