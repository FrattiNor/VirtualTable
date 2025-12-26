import { Fragment, memo, useMemo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import ResizeHandle from './ResizeHandle';
import { getCellTitle, getColKeys, getResize, isEmptyRender, isStrNum } from '../../../../TableUtils';

import type { TableCoreColumn, TableCoreColumnGroup } from '../../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	'splitColumnsArr' | 'bordered' | 'rowHeight' | 'getHeadStickyStyle' | 'startResize' | 'resizeFlag' | 'getHeadCellBg' | 'renderHeadPrefix'
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
		splitColumnsArr,
		bordered,
		rowIndexStart,
		rowIndexEnd,
		colIndexStart,
		colIndexEnd,
		rowHeight,
		getHeadStickyStyle,
		getHeadCellBg,
		renderHeadPrefix,
	} = props;
	// 是否可以resize
	const resize = useMemo(() => getResize(splitColumnsArr, colIndexStart, colIndexEnd), [splitColumnsArr, colIndexStart, colIndexEnd]);
	// 列keys
	const colKeys = useMemo(() => getColKeys(splitColumnsArr, colIndexStart, colIndexEnd), [splitColumnsArr, colIndexStart, colIndexEnd]);
	// 最终渲染结果
	const renderDom = !isEmptyRender(column.title) ? column.title : '-';
	// 筛选dom
	const filterDom = column.filter;
	// 是否存在筛选
	const haveFilter = isLeaf && filterDom;
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

	return (
		<div
			title={title}
			className={classNames(styles['head-cell'], {
				[styles['bordered']]: bordered,
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
				justifyContent: column.align === 'center' ? 'center' : column.align === 'right' ? 'flex-end' : 'flex-start',
				...stickyStyle,
				...style,
			}}
		>
			{(() => {
				// head主要内容
				const content = (
					<Fragment>
						{isLeaf && typeof renderHeadPrefix === 'function' && renderHeadPrefix(column.key)}
						{!canEllipsis ? (
							<div className={styles['block-wrapper']}>{renderDom}</div>
						) : (
							<div className={styles['text-wrapper']}>{renderDom}</div>
						)}
					</Fragment>
				);

				// 不存在filter
				if (!haveFilter) return content;

				// 存在filter
				return (
					<Fragment>
						<div className={styles['head-cell-inner']}>{content}</div>
						<Fragment>{filterDom}</Fragment>
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
