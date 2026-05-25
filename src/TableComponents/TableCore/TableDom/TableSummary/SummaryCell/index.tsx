import classNames from 'classnames';

import styles from './index.module.less';
import { getSummaryRenderDom } from './utils';
import { useTableInstanceContext } from '../../../TableContext';
import { getCellTitle, isStrNum } from '../../../TableUtils';

import type { RowKeyType } from '../../../TableTypes/type';
import type { TableCoreColumn } from '../../../TableTypes/typeColumn';

type CellSpecificProps = {
	itemData: any;
	itemRowKey: string;
	colIndexStart: number;
	colIndexEnd: number;
	rowIndexStart: number;
	rowIndexEnd: number;
	leafColumn: TableCoreColumn<any, any>;
};

const SummaryCell = (props: CellSpecificProps) => {
	const {
		leafColumn,
		itemData,
		colIndexStart,
		colIndexEnd,
		rowIndexStart,
		rowIndexEnd,
		itemRowKey,
	} = props;

	const ctx = useTableInstanceContext();
	const { bordered, getHeadStickyStyle, getBodyCellBg, bodyRowMouseEnter, bodyRowMouseLeave } = ctx;

	const index = rowIndexStart;
	const colKey = leafColumn.key;
	const summaryRender = leafColumn.summaryRender;

	const rowKeys = [itemRowKey] as RowKeyType[];
	const colKeys = [colKey];
	const renderDom = getSummaryRenderDom({ itemData, index, summaryRender });
	const title = getCellTitle(renderDom);
	const canEllipsis = isStrNum(renderDom);
	const backgroundColor = getBodyCellBg({ rowKeys, colKeys });
	const { stickyStyle, hiddenLeftBorder, leftLastPinged, rightLastPinged } = getHeadStickyStyle({ colKeys });
	const align = leafColumn.align;

	return (
		<div
			title={title}
			data-col-key={colKey}
			onMouseEnter={bodyRowMouseEnter ? () => bodyRowMouseEnter({ rowKeys }) : undefined}
			onMouseLeave={bodyRowMouseLeave ? () => bodyRowMouseLeave({ rowKeys }) : undefined}
			className={classNames(styles['summary-cell'], {
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
			}}
		>
			{canEllipsis ? <div className={styles['text-wrapper']}>{renderDom}</div> : <div className={styles['block-wrapper']}>{renderDom}</div>}
		</div>
	);
};

export default SummaryCell;
