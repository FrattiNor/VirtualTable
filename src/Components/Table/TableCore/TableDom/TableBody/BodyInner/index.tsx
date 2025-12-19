import { memo } from 'react';

import BodyCell from './BodyCell';
import BodyCellPlaceholder from './BodyCellPlaceholder';
import styles from './index.module.less';
import { getLeafColumn, getRowKey } from '../../../TableUtils';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Pick<
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
	| 'bodyRowClick'
	| 'bodyRowMouseEnter'
	| 'bodyRowMouseLeave'
	| 'getBodyCellColShow'
	| 'getBodyCellRowShow'
	| 'v_totalSize'
	| 'getV_OffsetTop'
	| 'v_measureItemSize'
	| 'highlightKeywords'
>;

const BodyInner = <T,>(props: Props<T>) => {
	const { rowKey, data, gridTemplateColumns, bodyInnerRef, getV_OffsetTop, v_totalSize, splitColumnsArr, getBodyCellColShow, getBodyCellRowShow } =
		props;

	let firstRowIndex: number | null = null;
	const bodyDom = (() => {
		let lastRowIndex: number | null = null;
		let notRenderRowIndexs: number[] = [];
		const needRenderRowIndexs: number[] = [];

		// 检测重复的rowKey
		const rowKeysMap = new Map<string, number>();
		const checkSameKey = (key: string) => {
			if (rowKeysMap.get(key) === 1) console.error(`same row key: ${key}`);
			rowKeysMap.set(key, (rowKeysMap.get(key) ?? 0) + 1);
		};

		data?.forEach((dataItem, rowIndex) => {
			const dataRowKey = getRowKey(rowKey, dataItem, rowIndex);
			checkSameKey(dataRowKey);

			const showRow = splitColumnsArr.some((splitColumns, colIndex) => {
				const leafColumn = getLeafColumn(splitColumns);
				const { rowSpan = 1, colSpan = 1 } = leafColumn.onCellSpan ? leafColumn.onCellSpan(dataItem, rowIndex) : {};
				if (rowSpan <= 0 || colSpan <= 0) return false;
				const rowIndexStart = rowIndex;
				const rowIndexEnd = rowIndex + rowSpan - 1;
				const colIndexStart = colIndex;
				const colIndexEnd = colIndex + colSpan - 1;
				if (!getBodyCellRowShow({ rowIndexStart, rowIndexEnd })) return false;
				if (!getBodyCellColShow({ colIndexStart, colIndexEnd })) return false;
				return true;
			});

			if (showRow === true) {
				if (firstRowIndex === null) firstRowIndex = rowIndex;
				if (lastRowIndex === null || rowIndex > lastRowIndex) lastRowIndex = rowIndex;
				if (notRenderRowIndexs.length > 0) needRenderRowIndexs.push(...notRenderRowIndexs);
				needRenderRowIndexs.push(rowIndex);
				notRenderRowIndexs = [];
			} else {
				if (typeof firstRowIndex === 'number') notRenderRowIndexs.push(rowIndex);
			}
		});

		return needRenderRowIndexs.map((rowIndex) => {
			const dataItem = data[rowIndex];
			const dataRowKey = getRowKey(rowKey, dataItem, rowIndex);
			return (
				<div key={dataRowKey} data-row={rowIndex + 1} style={{ display: 'contents' }}>
					{splitColumnsArr.map((splitColumns, colIndex) => {
						const leafColumn = getLeafColumn(splitColumns);
						const { rowSpan = 1, colSpan = 1 } = leafColumn.onCellSpan ? leafColumn.onCellSpan(dataItem, rowIndex) : {};
						if (rowSpan <= 0 || colSpan <= 0) return null;
						const rowIndexStart = rowIndex;
						const rowIndexEnd = rowIndex + rowSpan - 1;
						const colIndexStart = colIndex;
						const colIndexEnd = colIndex + colSpan - 1;
						if (!getBodyCellColShow({ colIndexStart, colIndexEnd })) return null;
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
								rowIndexStart={rowIndexStart}
								colIndexStart={colIndexStart}
								bodyRowClick={props.bodyRowClick}
								splitColumnsArr={splitColumnsArr}
								getBodyCellBg={props.getBodyCellBg}
								highlightKeywords={props.highlightKeywords}
								bodyRowMouseEnter={props.bodyRowMouseEnter}
								bodyRowMouseLeave={props.bodyRowMouseLeave}
								getBodyStickyStyle={props.getBodyStickyStyle}
							/>
						);
					})}
					<BodyCellPlaceholder
						rowIndex={rowIndex}
						dataRowKey={dataRowKey}
						bordered={props.bordered}
						rowHeight={props.rowHeight}
						bodyRowClick={props.bodyRowClick}
						getBodyCellBg={props.getBodyCellBg}
						colIndex={props.splitColumnsArr.length}
						v_measureItemSize={props.v_measureItemSize}
						bodyRowMouseEnter={props.bodyRowMouseEnter}
						bodyRowMouseLeave={props.bodyRowMouseLeave}
					/>
				</div>
			);
		});
	})();

	const offsetTop = getV_OffsetTop(firstRowIndex ?? 0);

	return (
		<div ref={bodyInnerRef} className={styles['body-inner']} style={{ minHeight: v_totalSize }}>
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
