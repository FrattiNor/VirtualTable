import { type CSSProperties, memo } from 'react';

import classNames from 'classnames';

import BodyCell from './BodyCell';
import BodyCellPlaceholder from './BodyCellPlaceholder';
import styles from './index.module.less';
import useRefCallback from '../../../../TableHooks/useRefCallback';
import { type RowKeyType } from '../../../../TableTypes/type';
import { getLeafColumn } from '../../../../TableUtils';

import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	| 'finalColumnsArr'
	| 'bordered'
	| 'rowHeight'
	| 'getBodyStickyStyle'
	| 'getBodyCellBg'
	| 'bodyRowClick'
	| 'bodyRowMouseEnter'
	| 'bodyRowMouseLeave'
	| 'v_measureItemSize'
	| 'highlightKeywords'
	| 'renderCellPrefix'
	| 'rowDraggableMode'
	| 'getRowKeys'
	| 'getColKeys'
	| 'getBodyCellColShow'
	| 'getBodyCellColForceShow'
	| 'borderWidth'
> & {
	itemData: T;
	rowIndex: number;
	itemRowKey: RowKeyType;
	isPlaceholder: boolean;
	// ==== 给RowDraggableWrapper组件注入使用 ====
	style?: CSSProperties;
	draggableProps?: Record<string, any>;
	draggableSetNodeRef?: (node: HTMLElement | null) => void;
	// ==== 给RowDraggableWrapper组件注入使用 ====
};

const BodyRow = <T,>(props: Props<T>) => {
	const {
		style,
		rowIndex,
		itemData,
		itemRowKey,
		isPlaceholder,
		draggableProps,
		finalColumnsArr,
		rowDraggableMode,
		getBodyCellColShow,
		draggableSetNodeRef,
		getBodyCellColForceShow,
	} = props;

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
				// span为0，不渲染
				if (rowSpan <= 0 || colSpan <= 0) return null;
				const rowIndexStart = rowIndex;
				const rowIndexEnd = rowIndex + rowSpan - 1;
				const colIndexStart = colIndex;
				const colIndexEnd = colIndex + colSpan - 1;
				// colVirtual，不渲染
				if (!getBodyCellColShow({ colIndexStart, colIndexEnd })) return null;
				// 占位行且rowSpan为1和非强制渲染，不渲染
				if (isPlaceholder && rowSpan === 1 && !getBodyCellColForceShow({ colIndexStart, colIndexEnd })) return null;
				return (
					<BodyCell
						itemData={itemData}
						key={leafColumn.key}
						leafColumn={leafColumn}
						colIndexEnd={colIndexEnd}
						rowIndexEnd={rowIndexEnd}
						bordered={props.bordered}
						rowIndexStart={rowIndexStart}
						colIndexStart={colIndexStart}
						getColKeys={props.getColKeys}
						getRowKeys={props.getRowKeys}
						bodyRowClick={props.bodyRowClick}
						getBodyCellBg={props.getBodyCellBg}
						renderCellPrefix={props.renderCellPrefix}
						highlightKeywords={props.highlightKeywords}
						bodyRowMouseEnter={props.bodyRowMouseEnter}
						bodyRowMouseLeave={props.bodyRowMouseLeave}
						getBodyStickyStyle={props.getBodyStickyStyle}
					/>
				);
			})}
			<BodyCellPlaceholder
				rowIndex={rowIndex}
				itemRowKey={itemRowKey}
				bordered={props.bordered}
				rowHeight={props.rowHeight}
				borderWidth={props.borderWidth}
				bodyRowClick={props.bodyRowClick}
				getBodyCellBg={props.getBodyCellBg}
				colIndex={props.finalColumnsArr.length}
				v_measureItemSize={props.v_measureItemSize}
				bodyRowMouseEnter={props.bodyRowMouseEnter}
				bodyRowMouseLeave={props.bodyRowMouseLeave}
			/>
		</div>
	);
};

export default memo(BodyRow) as typeof BodyRow;
