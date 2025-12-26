import { memo } from 'react';

import classNames from 'classnames';

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
	| 'v_totalSize'
	| 'v_offsetTop'
	| 'v_measureItemSize'
	| 'highlightKeywords'
	| 'renderBodyDom'
	| 'renderCellPrefix'
	| 'rowDraggableMode'
	| 'RowDraggableWrapper'
>;

const BodyInner = <T,>(props: Props<T>) => {
	const {
		rowKey,
		data,
		gridTemplateColumns,
		bodyInnerRef,
		v_offsetTop,
		v_totalSize,
		splitColumnsArr,
		rowDraggableMode,
		RowDraggableWrapper,
		renderBodyDom,
	} = props;

	return (
		<div ref={bodyInnerRef} className={styles['body-inner']} style={{ minHeight: v_totalSize }}>
			<div
				className={classNames({ [styles['body-content']]: !rowDraggableMode, [styles['draggable-mode-content']]: rowDraggableMode })}
				style={{ gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)`, transform: `translate3d(0,${v_offsetTop}px,0)` }}
			>
				{renderBodyDom(({ rowIndex, isPlaceholder, getBodyCellColShow, getBodyCellColForceShow }) => {
					const itemData = data[rowIndex];
					if (itemData !== undefined) {
						const dataRowKey = getRowKey(rowKey, itemData);
						const row = (
							<div
								key={dataRowKey}
								data-row={rowIndex + 1}
								className={classNames({
									[styles['body-row']]: !rowDraggableMode,
									[styles['draggable-mode-row']]: rowDraggableMode,
								})}
							>
								{splitColumnsArr.map((splitColumns, colIndex) => {
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
											data={props.data}
											itemData={itemData}
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

						if (RowDraggableWrapper) {
							return (
								<RowDraggableWrapper key={dataRowKey} rowKey={dataRowKey} rowIndex={rowIndex}>
									{row}
								</RowDraggableWrapper>
							);
						}

						return row;
					}
				})}
			</div>
		</div>
	);
};

export default memo(BodyInner) as typeof BodyInner;
