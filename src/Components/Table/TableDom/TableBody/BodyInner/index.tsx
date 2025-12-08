import { memo } from 'react';

import BodyCell from './BodyCell';
import BodyCellPlaceholder from './BodyCellPlaceholder';
import BodyEmpty from './BodyEmpty';
import styles from './index.module.less';
import { getLeafColumn, getRowKey } from '../../../TableUtils';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Required<
	Pick<
		TableInstance<T>,
		| 'splitColumnsArr'
		| 'bordered'
		| 'data'
		| 'rowKey'
		| 'gridTemplateColumns'
		| 'rowHeight'
		| 'getBodyStickyStyle'
		| 'getBodyCellBg'
		| 'bodyInnerRef'
		| 'tableWidth'
		| 'columnsKeyIndexMap'
		| 'bodyRowClick'
		| 'bodyRowMouseEnter'
		| 'bodyRowMouseLeave'
		| 'getBodyCellShow'
		| 'v_totalSize'
		| 'getV_OffsetTop'
		| 'v_measureItemRef'
	>
>;

const BodyInner = <T,>(props: Props<T>) => {
	const isEmpty = (props.data ?? []).length === 0;
	const { rowKey, data, gridTemplateColumns, bodyInnerRef, getV_OffsetTop, v_totalSize, splitColumnsArr, columnsKeyIndexMap, getBodyCellShow } =
		props;

	let firstRowIndex: number | null = null;
	const bodyDom = (() => {
		return data?.map((dataItem: T, rowIndex: number) => {
			let haveCell = false;
			const rowCells = splitColumnsArr.map((splitColumns) => {
				const leafColumn = getLeafColumn(splitColumns);
				const { rowSpan = 1, colSpan = 1 } = leafColumn.onCellSpan ? leafColumn.onCellSpan(dataItem, rowIndex) : {};
				if (rowSpan <= 0 || colSpan <= 0) return null;
				const colIndex = columnsKeyIndexMap.get(leafColumn.key) ?? Infinity;
				const rowIndexStart = rowIndex;
				const rowIndexEnd = rowIndex + rowSpan - 1;
				const colIndexStart = colIndex;
				const colIndexEnd = colIndex + colSpan - 1;
				if (!getBodyCellShow({ colIndexStart, colIndexEnd, rowIndexStart, rowIndexEnd })) return null;
				haveCell = true;
				return (
					<BodyCell
						data={props.data}
						dataItem={dataItem}
						key={leafColumn.key}
						rowKey={props.rowKey}
						leafColumn={leafColumn}
						colIndexEnd={colIndexEnd}
						rowIndexEnd={rowIndexEnd}
						bordered={props.bordered}
						rowHeight={props.rowHeight}
						rowIndexStart={rowIndexStart}
						colIndexStart={colIndexStart}
						bodyRowClick={props.bodyRowClick}
						splitColumnsArr={splitColumnsArr}
						getBodyCellBg={props.getBodyCellBg}
						bodyRowMouseEnter={props.bodyRowMouseEnter}
						bodyRowMouseLeave={props.bodyRowMouseLeave}
						getBodyStickyStyle={props.getBodyStickyStyle}
					/>
				);
			});
			if (haveCell === false) return null;
			if (firstRowIndex === null) firstRowIndex = rowIndex;
			return (
				<div key={getRowKey(rowKey, dataItem, rowIndex)} data-row={rowIndex + 1} style={{ display: 'contents' }}>
					{rowCells}
					<BodyCellPlaceholder
						rowIndex={rowIndex}
						bordered={props.bordered}
						rowHeight={props.rowHeight}
						colIndex={props.splitColumnsArr.length}
						v_measureItemRef={props.v_measureItemRef}
					/>
				</div>
			);
		});
	})();
	const offsetTop = getV_OffsetTop(firstRowIndex ?? 0);

	return (
		<div ref={bodyInnerRef} className={styles['body-inner']} style={{ minHeight: v_totalSize }}>
			{isEmpty && <BodyEmpty tableWidth={props.tableWidth} />}
			<div
				className={styles['body-content']}
				style={{ gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)`, transform: `translate3d(0,${offsetTop}px,0)` }}
			>
				{bodyDom}
			</div>
		</div>
	);
};

export default memo(BodyInner) as typeof BodyInner;
