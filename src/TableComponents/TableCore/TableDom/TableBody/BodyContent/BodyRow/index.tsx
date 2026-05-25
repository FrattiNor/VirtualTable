import { type CSSProperties } from 'react';

import classNames from 'classnames';

import BodyCell from './BodyCell';
import BodyCellPlaceholder from './BodyCellPlaceholder';
import styles from './index.module.less';
import { useTableInstanceContext } from '../../../../TableContext';
import useRefCallback from '../../../../TableHooks/useRefCallback';
import { type RowKeyType } from '../../../../TableTypes/type';
import { getLeafColumn } from '../../../../TableUtils';

type RowSpecificProps = {
	itemData: any;
	rowIndex: number;
	itemRowKey: RowKeyType;
	isPlaceholder: boolean;
	style?: CSSProperties;
	draggableProps?: Record<string, any>;
	draggableSetNodeRef?: (node: HTMLElement | null) => void;
};

const BodyRow = <T,>(props: RowSpecificProps) => {
	const {
		style,
		rowIndex,
		itemData,
		itemRowKey,
		isPlaceholder,
		draggableProps,
		draggableSetNodeRef,
	} = props;

	const ctx = useTableInstanceContext<T>();
	const { finalColumnsArr, rowDraggableMode, getBodyCellColShow, getBodyCellColForceShow } = ctx;

	const ref = useRefCallback<HTMLDivElement>(draggableSetNodeRef);

	return (
		<div
			ref={ref}
			style={style}
			{...draggableProps}
			data-row={rowIndex + 1}
			className={classNames({
				[styles['body-row']]: !rowDraggableMode,
				[styles['draggable-mode-row']]: rowDraggableMode,
			})}
		>
			{finalColumnsArr.map((splitColumns, colIndex) => {
				const leafColumn = getLeafColumn(splitColumns);
				const { rowSpan = 1, colSpan = 1 } = leafColumn.onCellSpan ? leafColumn.onCellSpan(itemData, rowIndex) : {};
				if (rowSpan <= 0 || colSpan <= 0) return null;
				const rowIndexStart = rowIndex;
				const rowIndexEnd = rowIndex + rowSpan - 1;
				const colIndexStart = colIndex;
				const colIndexEnd = colIndex + colSpan - 1;
				if (!getBodyCellColShow({ colIndexStart, colIndexEnd })) return null;
				if (isPlaceholder && rowSpan === 1 && !getBodyCellColForceShow({ colIndexStart, colIndexEnd })) return null;
				return (
					<BodyCell
						itemData={itemData}
						key={leafColumn.key}
						leafColumn={leafColumn}
						colIndexEnd={colIndexEnd}
						rowIndexEnd={rowIndexEnd}
						rowIndexStart={rowIndexStart}
						colIndexStart={colIndexStart}
					/>
				);
			})}
			<BodyCellPlaceholder
				rowIndex={rowIndex}
				itemRowKey={itemRowKey}
				colIndex={finalColumnsArr.length}
			/>
		</div>
	);
};

export default BodyRow;
