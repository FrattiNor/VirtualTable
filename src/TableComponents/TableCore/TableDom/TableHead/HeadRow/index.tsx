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

	const isLeaf = rowIndex === deepLevel;

	const renderRow = () => {
		let colSameCount = 0;
		let colNoRenderKey = '';
		return finalColumnsArr.map((splitColumns, colIndex) => {
			const leafColumn = getLeafColumn(splitColumns);
			if (isLeaf) {
				if (!leafColumn) return null;
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
				const column = getNotLeafColumnByIndex(splitColumns, rowIndex);
				if (!column) return null;
				if (finalColumnsArr[colIndex + 1] !== undefined) {
					const nextColumn = getNotLeafColumnByIndex(finalColumnsArr[colIndex + 1], rowIndex);
					const nextLeafColumn = getLeafColumn(finalColumnsArr[colIndex + 1]);
					if (column.key === nextColumn?.key && leafColumn.fixed === nextLeafColumn?.fixed) {
						colSameCount++;
						colNoRenderKey += `${leafColumn.key}_`;
						return null;
					}
				}
				const key = colNoRenderKey + leafColumn.key;
				const colIndexStart = colIndex - colSameCount;
				const colIndexEnd = colIndex;
				const rowIndexStart = rowIndex;
				const rowIndexEnd = rowIndex;
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
