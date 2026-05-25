import styles from './index.module.less';
import SummaryCell from './SummaryCell';
import SummaryCellPlaceholder from './SummaryCellPlaceholder';
import { useTableInstanceContext } from '../../TableContext';
import { getLeafColumn } from '../../TableUtils';

const TableSummary = <T,>() => {
	const ctx = useTableInstanceContext<T>();
	const { summaryData, summaryRef, gridTemplateColumns, vScrollbarState, finalColumnsArr, getSummaryCellColShow } = ctx;

	if (!(Array.isArray(summaryData) && summaryData.length > 0)) return null;

	const summaryGridTemplateColumns = vScrollbarState.have
		? gridTemplateColumns + ` minmax(${vScrollbarState.widthStr}, 1fr)`
		: gridTemplateColumns + ` minmax(0px, 1fr)`;

	return (
		<div ref={summaryRef} className={styles['summary']}>
			<div className={styles['summary-inner']} style={{ gridTemplateColumns: summaryGridTemplateColumns }}>
				{summaryData.map((itemData, rowIndex) => {
					const itemRowKey = `summary_${rowIndex}`;
					return (
						<div key={itemRowKey} className={styles['summary-row']}>
							{finalColumnsArr.map((splitColumns, colIndex) => {
								const leafColumn = getLeafColumn(splitColumns);
								const { rowSpan = 1, colSpan = 1 } = leafColumn.onSummaryCellSpan
									? leafColumn.onSummaryCellSpan(itemData, rowIndex)
									: {};
								if (rowSpan <= 0 || colSpan <= 0) return null;
								const rowIndexStart = rowIndex;
								const rowIndexEnd = rowIndex + rowSpan - 1;
								const colIndexStart = colIndex;
								const colIndexEnd = colIndex + colSpan - 1;
								if (!getSummaryCellColShow({ colIndexStart, colIndexEnd })) return null;
								return (
									<SummaryCell
										key={leafColumn.key}
										itemData={itemData}
										itemRowKey={itemRowKey}
										leafColumn={leafColumn}
										colIndexEnd={colIndexEnd}
										rowIndexEnd={rowIndexEnd}
										rowIndexStart={rowIndexStart}
										colIndexStart={colIndexStart}
									/>
								);
							})}
							<SummaryCellPlaceholder
								rowIndex={rowIndex}
								itemRowKey={itemRowKey}
								colIndex={finalColumnsArr.length}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default TableSummary;
