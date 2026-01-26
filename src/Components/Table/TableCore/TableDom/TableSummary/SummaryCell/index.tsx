import { memo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import { getSummaryRenderDom } from './utils';
import { getCellTitle, isStrNum } from '../../../TableUtils';

import type { TableCoreColumn } from '../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../useTableInstance';

type Props<T, K, S> = Pick<
	TableInstance<T, K, S>,
	'bordered' | 'getHeadStickyStyle' | 'getBodyCellBg' | 'bodyRowMouseEnter' | 'bodyRowMouseLeave'
> & {
	itemData: S;
	itemRowKey: string;
	colIndex: number;
	rowIndex: number;
	leafColumn: TableCoreColumn<T, S>;
};

// summary使用body的hover和head的sticky
const SummaryCell = <T, K, S>(props: Props<T, K, S>) => {
	const {
		leafColumn,
		bordered,
		itemData,
		rowIndex,
		colIndex,
		itemRowKey,
		getHeadStickyStyle,
		getBodyCellBg,
		bodyRowMouseEnter,
		bodyRowMouseLeave,
	} = props;

	const index = rowIndex;
	const colKey = leafColumn.key;
	const summaryRender = leafColumn.summaryRender;

	// 行keys
	const rowKeys = [itemRowKey] as K[];
	// 列keys
	const colKeys = [colKey];
	// 最终渲染结果
	const renderDom = getSummaryRenderDom({ itemData, index, summaryRender });
	// 当前cell的title
	const title = getCellTitle(renderDom);
	// 是否可省略
	const canEllipsis = isStrNum(renderDom);
	// 当前cell的背景色
	const backgroundColor = getBodyCellBg({ rowKeys, colKeys });
	// 当前cell的sticky情况
	const { stickyStyle, hiddenLeftBorder, leftLastPinged, rightLastPinged } = getHeadStickyStyle({ colKeys });
	// 当前cell配置的align
	const align = leafColumn.align;

	return (
		<div
			title={title}
			data-col-key={colKey}
			onMouseEnter={bodyRowMouseEnter ? () => bodyRowMouseEnter({ rowKeys }) : undefined}
			onMouseLeave={bodyRowMouseLeave ? () => bodyRowMouseLeave({ rowKeys }) : undefined}
			className={classNames(styles['summary-cell'], {
				[styles['bordered']]: bordered,
				[styles['first-col']]: colIndex === 0,
				[styles['left-last-pinged']]: leftLastPinged,
				[styles['right-last-pinged']]: rightLastPinged,
				[styles['hidden-left-border']]: colIndex !== 0 && hiddenLeftBorder,
			})}
			style={{
				backgroundColor,
				gridRow: `${rowIndex + 1}/${rowIndex + 2}`,
				gridColumn: `${colIndex + 1}/${colIndex + 2}`,
				justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
				...stickyStyle,
			}}
		>
			{canEllipsis ? <div className={styles['text-wrapper']}>{renderDom}</div> : <div className={styles['block-wrapper']}>{renderDom}</div>}
		</div>
	);
};

export default memo(SummaryCell) as typeof SummaryCell;
