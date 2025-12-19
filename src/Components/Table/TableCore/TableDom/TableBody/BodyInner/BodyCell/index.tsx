import { Fragment, memo, useMemo } from 'react';

import classNames from 'classnames';

import Highlight from './Highlight';
import styles from './index.module.less';
import { getMergeHighlightKeywords, getRenderDom } from './utils';
import { getCellTitle, getColKeys, getRowKeys, isStrNum } from '../../../../TableUtils';

import type { TableCoreColumn } from '../../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	| 'splitColumnsArr'
	| 'bordered'
	| 'getBodyStickyStyle'
	| 'getBodyCellBg'
	| 'rowKey'
	| 'data'
	| 'bodyRowClick'
	| 'bodyRowMouseEnter'
	| 'bodyRowMouseLeave'
	| 'highlightKeywords'
> & {
	dataItem: T;
	colIndexStart: number;
	colIndexEnd: number;
	rowIndexStart: number;
	rowIndexEnd: number;
	leafColumn: TableCoreColumn<T>;
};

const BodyCell = <T,>(props: Props<T>) => {
	const {
		data,
		rowKey,
		leafColumn,
		splitColumnsArr,
		bordered,
		dataItem,
		colIndexStart,
		colIndexEnd,
		rowIndexStart,
		rowIndexEnd,
		highlightKeywords,
		getBodyStickyStyle,
		getBodyCellBg,
		bodyRowClick,
		bodyRowMouseEnter,
		bodyRowMouseLeave,
	} = props;

	// 行keys
	const rowKeys = useMemo(() => getRowKeys(rowKey, data, rowIndexStart, rowIndexEnd), [rowKey, data, rowIndexStart, rowIndexEnd]);
	// 列keys
	const colKeys = useMemo(() => getColKeys(splitColumnsArr, colIndexStart, colIndexEnd), [splitColumnsArr, colIndexStart, colIndexEnd]);
	// 合并 全局高亮关键字 和 列高亮关键字
	const mergeHighlightKeywords = getMergeHighlightKeywords(highlightKeywords, leafColumn.highlightKeywords);
	// 最终渲染结果
	const index = rowIndexStart;
	const colKey = leafColumn.key;
	const render = leafColumn.render;
	const renderDom = getRenderDom({ dataItem, index, colKey, render, highlightKeywords: mergeHighlightKeywords });
	// 当前cell的title
	const title = typeof leafColumn.onCellTitle === 'function' ? leafColumn.onCellTitle(dataItem, index) : getCellTitle(renderDom);
	// 是否可省略
	const canEllipsis = isStrNum(renderDom);
	// 当前cell的背景色
	const backgroundColor = getBodyCellBg({ rowKeys, colKeys });
	// 当前cell的sticky情况
	const { stickyStyle, rightLastPinged, leftFirstPinged, leftLastPinged } = getBodyStickyStyle({ colKeys });

	return (
		<div
			title={title}
			data-col-key={colKey}
			onClick={bodyRowClick ? () => bodyRowClick({ rowKeys }) : undefined}
			onMouseEnter={bodyRowMouseEnter ? () => bodyRowMouseEnter({ rowKeys }) : undefined}
			onMouseLeave={bodyRowMouseLeave ? () => bodyRowMouseLeave({ rowKeys }) : undefined}
			className={classNames(styles['body-cell'], {
				[styles['bordered']]: bordered,
				[styles['first-col']]: colIndexStart === 0,
				[styles['first-row']]: rowIndexStart === 0,
				[styles['left-last-pinged']]: leftLastPinged,
				[styles['right-last-pinged']]: rightLastPinged,
				[styles['not-first-col-and-left-first-pinged']]: colIndexStart !== 0 && leftFirstPinged,
				[styles['not-first-col-and-right-last-pinged']]: colIndexStart !== 0 && rightLastPinged,
			})}
			style={{
				...stickyStyle,
				backgroundColor,
				gridRow: `${rowIndexStart + 1}/${rowIndexEnd + 2}`,
				gridColumn: `${colIndexStart + 1}/${colIndexEnd + 2}`,
				justifyContent: leafColumn.align === 'center' ? 'center' : leafColumn.align === 'right' ? 'flex-end' : 'flex-start',
			}}
		>
			{canEllipsis ? (
				<div className={styles['ellipsis-wrapper']}>
					<Highlight keyword={mergeHighlightKeywords}>{renderDom.toString()}</Highlight>
				</div>
			) : (
				<Fragment>{renderDom}</Fragment>
			)}
		</div>
	);
};

export default memo(BodyCell) as typeof BodyCell;
