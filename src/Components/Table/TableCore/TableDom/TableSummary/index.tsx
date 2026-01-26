import { memo } from 'react';

import styles from './index.module.less';
import SummaryCell from './SummaryCell';
import SummaryCellPlaceholder from './SummaryCellPlaceholder';
import { type RowKeyType } from '../../TableTypes/type';
import { getLeafColumn } from '../../TableUtils';

import type { TableInstance } from '../../useTableInstance';

type Props<T, K, S> = Pick<
	TableInstance<T, K, S>,
	| 'summaryRef'
	| 'summaryData'
	| 'finalColumnsArr'
	| 'gridTemplateColumns'
	| 'v_scrollbar'
	| 'getSummaryCellColShow'
	| 'bordered'
	| 'getHeadStickyStyle'
	| 'getBodyCellBg'
	| 'bodyRowMouseEnter'
	| 'bodyRowMouseLeave'
	| 'rowHeight'
>;

const TableSummary = <T, K = RowKeyType, S = any>(props: Props<T, K, S>) => {
	const { summaryData, summaryRef, gridTemplateColumns, v_scrollbar, finalColumnsArr, getSummaryCellColShow } = props;

	if (!(Array.isArray(summaryData) && summaryData.length > 0)) return null;

	const summaryGridTemplateColumns = v_scrollbar.have
		? gridTemplateColumns + ` minmax(${v_scrollbar.widthStr}, 1fr)`
		: gridTemplateColumns + ` minmax(0px, 1fr)`;

	return (
		<div ref={summaryRef} className={styles['summary']}>
			<div className={styles['summary-inner']} style={{ gridTemplateColumns: summaryGridTemplateColumns }}>
				{summaryData.map((itemData, rowIndex) => {
					const itemRowKey = `summary_${rowIndex}`;
					return (
						<div key={itemRowKey} className={styles['summary-row']}>
							{finalColumnsArr.map((splitColumns, colIndex) => {
								if (!getSummaryCellColShow({ colIndexStart: colIndex, colIndexEnd: colIndex })) return null;
								const leafColumn = getLeafColumn(splitColumns);
								return (
									<SummaryCell
										key={leafColumn.key}
										itemData={itemData}
										colIndex={colIndex}
										rowIndex={rowIndex}
										itemRowKey={itemRowKey}
										leafColumn={leafColumn}
										bordered={props.bordered}
										getBodyCellBg={props.getBodyCellBg}
										bodyRowMouseEnter={props.bodyRowMouseEnter}
										bodyRowMouseLeave={props.bodyRowMouseLeave}
										getHeadStickyStyle={props.getHeadStickyStyle}
									/>
								);
							})}
							<SummaryCellPlaceholder
								rowIndex={rowIndex}
								itemRowKey={itemRowKey}
								bordered={props.bordered}
								rowHeight={props.rowHeight}
								getBodyCellBg={props.getBodyCellBg}
								colIndex={props.finalColumnsArr.length}
								bodyRowMouseEnter={props.bodyRowMouseEnter}
								bodyRowMouseLeave={props.bodyRowMouseLeave}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default memo(TableSummary) as typeof TableSummary;
