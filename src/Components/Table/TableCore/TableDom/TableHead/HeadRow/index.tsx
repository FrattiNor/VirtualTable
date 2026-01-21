import { memo } from 'react';

import HeadCell from './HeadCell';
import { getNotLeafColumnByIndex, getLeafColumn } from '../../../TableUtils';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	| 'finalColumnsArr'
	| 'deepLevel'
	| 'bordered'
	| 'rowHeight'
	| 'getHeadStickyStyle'
	| 'startResize'
	| 'resizeFlag'
	| 'getHeadCellBg'
	| 'getHeadCellColShow'
	| 'renderHeadPrefix'
	| 'getColKeys'
	| 'sorter'
> & {
	rowIndex: number;
};

const HeadRow = <T,>(props: Props<T>) => {
	const { rowIndex, finalColumnsArr, deepLevel, getHeadCellColShow } = props;

	// 是否是叶子节点
	const isLeaf = rowIndex === deepLevel;

	const renderRow = () => {
		let colSameCount = 0;
		let colNoRenderKey = '';
		return finalColumnsArr.map((splitColumns, colIndex) => {
			const leafColumn = getLeafColumn(splitColumns);
			if (isLeaf) {
				// 不存在column
				if (!leafColumn) return null;
				// 开始渲染
				const colIndexStart = colIndex;
				const colIndexEnd = colIndex;
				const rowIndexStart = splitColumns.length - 1;
				const rowIndexEnd = rowIndex;

				if (!getHeadCellColShow({ colIndexStart, colIndexEnd })) return null;
				return (
					<HeadCell
						isLeaf={true}
						column={leafColumn}
						key={leafColumn.key}
						sorter={props.sorter}
						colIndexEnd={colIndexEnd}
						rowIndexEnd={rowIndexEnd}
						bordered={props.bordered}
						rowHeight={props.rowHeight}
						resizeFlag={props.resizeFlag}
						colIndexStart={colIndexStart}
						rowIndexStart={rowIndexStart}
						getColKeys={props.getColKeys}
						startResize={props.startResize}
						finalColumnsArr={finalColumnsArr}
						getHeadCellBg={props.getHeadCellBg}
						renderHeadPrefix={props.renderHeadPrefix}
						getHeadStickyStyle={props.getHeadStickyStyle}
					/>
				);
			} else {
				// 当前column
				const column = getNotLeafColumnByIndex(splitColumns, rowIndex);
				// 不存在column
				if (!column) return null;
				// 存在下一列
				if (finalColumnsArr[colIndex + 1] !== undefined) {
					// 同行下一列column
					const nextColumn = getNotLeafColumnByIndex(finalColumnsArr[colIndex + 1], rowIndex);
					// 同行下一列叶子节点
					const nextLeafColumn = getLeafColumn(finalColumnsArr[colIndex + 1]);
					// 同行下一列和当前列相同【key和fixed都相同】，跳过当前渲染
					if (column.key === nextColumn?.key && leafColumn.fixed === nextLeafColumn?.fixed) {
						colSameCount++;
						colNoRenderKey += `${leafColumn.key}_`;
						return null;
					}
				}
				// 开始渲染
				const key = colNoRenderKey + leafColumn.key;
				const colIndexStart = colIndex - colSameCount;
				const colIndexEnd = colIndex;
				const rowIndexStart = rowIndex;
				const rowIndexEnd = rowIndex;
				// 重置计数器
				colSameCount = 0;
				colNoRenderKey = '';

				if (!getHeadCellColShow({ colIndexStart, colIndexEnd })) return null;
				return (
					<HeadCell
						key={key}
						isLeaf={false}
						column={column}
						sorter={props.sorter}
						colIndexEnd={colIndexEnd}
						rowIndexEnd={rowIndexEnd}
						bordered={props.bordered}
						rowHeight={props.rowHeight}
						resizeFlag={props.resizeFlag}
						colIndexStart={colIndexStart}
						rowIndexStart={rowIndexStart}
						getColKeys={props.getColKeys}
						startResize={props.startResize}
						finalColumnsArr={finalColumnsArr}
						getHeadCellBg={props.getHeadCellBg}
						renderHeadPrefix={props.renderHeadPrefix}
						getHeadStickyStyle={props.getHeadStickyStyle}
					/>
				);
			}
		});
	};

	return (
		<div data-row={rowIndex + 1} style={{ display: 'contents' }}>
			{renderRow()}
		</div>
	);
};

export default memo(HeadRow) as typeof HeadRow;
