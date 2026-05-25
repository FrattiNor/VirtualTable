import { useMemo } from 'react';

import classNames from 'classnames';

import Highlight from './Highlight';
import styles from './index.module.less';
import { getMergeHighlightKeywords, getRenderDom } from './utils';
import { useTableInstanceContext } from '../../../../../TableContext';
import { getCellTitle, isStrNum } from '../../../../../TableUtils';

import type { TableCoreColumn } from '../../../../../TableTypes/typeColumn';

type CellSpecificProps = {
	itemData: any;
	colIndexStart: number;
	colIndexEnd: number;
	rowIndexStart: number;
	rowIndexEnd: number;
	leafColumn: TableCoreColumn<any>;
};

const BodyCell = <T,>(props: CellSpecificProps) => {
	const {
		leafColumn,
		itemData,
		colIndexStart,
		colIndexEnd,
		rowIndexStart,
		rowIndexEnd,
	} = props;

	const ctx = useTableInstanceContext<T>();
	const { bordered, highlightKeywords, getRowKeys, getColKeys, getBodyStickyStyle, getBodyCellBg, bodyRowClick, bodyRowMouseEnter, bodyRowMouseLeave, renderCellPrefix } = ctx;

	const index = rowIndexStart;
	const colKey = leafColumn.key;
	const render = leafColumn.render;

	const rowKeys = useMemo(() => getRowKeys(rowIndexStart, rowIndexEnd), [rowIndexStart, rowIndexEnd]);
	const colKeys = useMemo(() => getColKeys(colIndexStart, colIndexEnd), [colIndexStart, colIndexEnd]);
	const mergeHighlightKeywords = getMergeHighlightKeywords(highlightKeywords, leafColumn.highlightKeywords);
	const renderDom = getRenderDom({ itemData, index, colKey, render, highlightKeywords: mergeHighlightKeywords });
	const title = typeof leafColumn.onCellTitle === 'function' ? leafColumn.onCellTitle(itemData, index) : getCellTitle(renderDom);
	const canEllipsis = isStrNum(renderDom);
	const backgroundColor = getBodyCellBg({ rowKeys, colKeys });
	const { stickyStyle, hiddenLeftBorder, leftLastPinged, rightLastPinged } = getBodyStickyStyle({ colKeys });
	const style = typeof leafColumn.onCellStyle === 'function' ? leafColumn.onCellStyle(itemData, index) : undefined;
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

export default BodyCell as typeof BodyCell;
