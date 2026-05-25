import HeadCell from './HeadCell';
import { useTableInstanceContext } from '../../../TableContext';
import { getNotLeafColumnByIndex, getLeafColumn } from '../../../TableUtils';

type Props = {
	rowIndex: number;
};

const HeadRow = <T,>(props: Props) => {
	const { rowIndex } = props;
	const ctx = useTableInstanceContext<T>();
	const { finalColumnsArr, deepLevel, getHeadCellColShow } = ctx;

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
						colIndexEnd={colIndexEnd}
						rowIndexEnd={rowIndexEnd}
						colIndexStart={colIndexStart}
						rowIndexStart={rowIndexStart}
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
						colIndexEnd={colIndexEnd}
						rowIndexEnd={rowIndexEnd}
						colIndexStart={colIndexStart}
						rowIndexStart={rowIndexStart}
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

export default HeadRow as typeof HeadRow;
