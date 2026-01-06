import { memo, useMemo } from 'react';

import classNames from 'classnames';

import Highlight from './Highlight';
import styles from './index.module.less';
import { getMergeHighlightKeywords, getRenderDom } from './utils';
import { getCellTitle, isStrNum } from '../../../../../TableUtils';

import type { TableCoreColumn } from '../../../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	| 'bordered'
	| 'getBodyStickyStyle'
	| 'getBodyCellBg'
	| 'bodyRowClick'
	| 'bodyRowMouseEnter'
	| 'bodyRowMouseLeave'
	| 'highlightKeywords'
	| 'renderCellPrefix'
	| 'getRowKeys'
	| 'getColKeys'
> & {
	itemData: T;
	colIndexStart: number;
	colIndexEnd: number;
	rowIndexStart: number;
	rowIndexEnd: number;
	leafColumn: TableCoreColumn<T>;
};

const BodyCell = <T,>(props: Props<T>) => {
	const {
		leafColumn,
		bordered,
		itemData,
		colIndexStart,
		colIndexEnd,
		rowIndexStart,
		rowIndexEnd,
		highlightKeywords,
		getRowKeys,
		getColKeys,
		getBodyStickyStyle,
		getBodyCellBg,
		bodyRowClick,
		bodyRowMouseEnter,
		bodyRowMouseLeave,
		renderCellPrefix,
	} = props;

	const index = rowIndexStart;
	const colKey = leafColumn.key;
	const render = leafColumn.render;

	// 行keys
	const rowKeys = useMemo(() => getRowKeys(rowIndexStart, rowIndexEnd), [rowIndexStart, rowIndexEnd]);
	// 列keys
	const colKeys = useMemo(() => getColKeys(colIndexStart, colIndexEnd), [colIndexStart, colIndexEnd]);
	// 合并 全局高亮关键字 和 列高亮关键字
	const mergeHighlightKeywords = getMergeHighlightKeywords(highlightKeywords, leafColumn.highlightKeywords);
	// 最终渲染结果
	const renderDom = getRenderDom({ itemData, index, colKey, render, highlightKeywords: mergeHighlightKeywords });
	// 当前cell的title
	const title = typeof leafColumn.onCellTitle === 'function' ? leafColumn.onCellTitle(itemData, index) : getCellTitle(renderDom);
	// 是否可省略
	const canEllipsis = isStrNum(renderDom);
	// 当前cell的背景色
	const backgroundColor = getBodyCellBg({ rowKeys, colKeys });
	// 当前cell的sticky情况
	const { stickyStyle, hiddenLeftBorder, leftLastPinged, rightLastPinged } = getBodyStickyStyle({ colKeys });
	// 当前cell配置的style
	const style = typeof leafColumn.onCellStyle === 'function' ? leafColumn.onCellStyle(itemData, index) : undefined;
	// 当前cell配置的align
	const align = leafColumn.align;

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
				[styles['hidden-left-border']]: colIndexStart !== 0 && hiddenLeftBorder,
			})}
			style={{
				backgroundColor,
				gridRow: `${rowIndexStart + 1}/${rowIndexEnd + 2}`,
				gridColumn: `${colIndexStart + 1}/${colIndexEnd + 2}`,
				justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
				...stickyStyle,
				...style,
			}}
		>
			{typeof renderCellPrefix === 'function' && renderCellPrefix(colKey, itemData)}
			{canEllipsis ? (
				<div className={styles['text-wrapper']}>
					<Highlight keyword={mergeHighlightKeywords}>{renderDom.toString()}</Highlight>
				</div>
			) : (
				<div className={styles['block-wrapper']}>{renderDom}</div>
			)}
		</div>
	);
};

export default memo(BodyCell) as typeof BodyCell;
