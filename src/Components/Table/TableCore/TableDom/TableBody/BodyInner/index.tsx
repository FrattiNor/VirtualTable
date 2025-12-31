import { memo } from 'react';

import classNames from 'classnames';

import BodyRow from './BodyRow';
import styles from './index.module.less';
import { getRowKey } from '../../../TableUtils';

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
	| 'getRowKeys'
	| 'getColKeys'
>;

const BodyInner = <T,>(props: Props<T>) => {
	const { data, rowKey, v_offsetTop, v_totalSize, bodyInnerRef, renderBodyDom, rowDraggableMode, gridTemplateColumns, RowDraggableWrapper } = props;

	return (
		<div ref={bodyInnerRef} className={styles['body-inner']} style={{ minHeight: v_totalSize }}>
			<div
				style={{ gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)`, transform: `translate3d(0,${v_offsetTop}px,0)` }}
				className={classNames({ [styles['body-content']]: !rowDraggableMode, [styles['draggable-mode-content']]: rowDraggableMode })}
			>
				{renderBodyDom(({ rowIndex, isPlaceholder, getBodyCellColShow, getBodyCellColForceShow }) => {
					const itemData = data[rowIndex];

					if (itemData !== undefined) {
						const itemRowKey = getRowKey(rowKey, itemData);

						const row = (
							<BodyRow
								key={itemRowKey}
								itemData={itemData}
								rowIndex={rowIndex}
								itemRowKey={itemRowKey}
								bordered={props.bordered}
								rowHeight={props.rowHeight}
								getColKeys={props.getColKeys}
								getRowKeys={props.getRowKeys}
								isPlaceholder={isPlaceholder}
								bodyRowClick={props.bodyRowClick}
								getBodyCellBg={props.getBodyCellBg}
								getBodyCellColShow={getBodyCellColShow}
								splitColumnsArr={props.splitColumnsArr}
								rowDraggableMode={props.rowDraggableMode}
								renderCellPrefix={props.renderCellPrefix}
								highlightKeywords={props.highlightKeywords}
								v_measureItemSize={props.v_measureItemSize}
								bodyRowMouseEnter={props.bodyRowMouseEnter}
								bodyRowMouseLeave={props.bodyRowMouseLeave}
								getBodyStickyStyle={props.getBodyStickyStyle}
								getBodyCellColForceShow={getBodyCellColForceShow}
							/>
						);

						if (RowDraggableWrapper) {
							return (
								<RowDraggableWrapper key={`${isPlaceholder}-${itemRowKey}`} rowKey={itemRowKey} rowIndex={rowIndex}>
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
