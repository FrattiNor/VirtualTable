import { type CSSProperties, memo } from 'react';

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
	| 'getBodyCellColShow'
	| 'getBodyCellColForceShow'
	| 'draggingRow_offsetTop'
	| 'draggingRow_notShow'
	| 'draggingRowIndex'
>;

const BodyInner = <T,>(props: Props<T>) => {
	const {
		data,
		rowKey,
		v_offsetTop,
		v_totalSize,
		bodyInnerRef,
		renderBodyDom,
		rowDraggableMode,
		gridTemplateColumns,
		RowDraggableWrapper,
		draggingRow_notShow,
		draggingRow_offsetTop,
		draggingRowIndex,
		getBodyCellColShow,
		getBodyCellColForceShow,
	} = props;

	const renderRow = ({
		style,
		itemData,
		rowIndex,
		itemRowKey,
		isPlaceholder,
	}: {
		itemData: T;
		rowIndex: number;
		itemRowKey: string;
		isPlaceholder: boolean;
		style?: CSSProperties;
	}) => {
		return (
			<BodyRow
				style={style}
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
	};

	return (
		<div ref={bodyInnerRef} className={styles['body-inner']} style={{ minHeight: v_totalSize }}>
			<div
				style={{ gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)`, transform: `translate3d(0,${v_offsetTop}px,0)` }}
				className={classNames({ [styles['body-content']]: !rowDraggableMode, [styles['draggable-mode-content']]: rowDraggableMode })}
			>
				{renderBodyDom(({ rowIndex, isPlaceholder }) => {
					const itemData = data[rowIndex];
					if (itemData !== undefined) {
						const itemRowKey = getRowKey(rowKey, itemData);
						if (RowDraggableWrapper) {
							return (
								<RowDraggableWrapper key={`${isPlaceholder}-${itemRowKey}`} rowKey={itemRowKey} rowIndex={rowIndex}>
									{renderRow({ itemData, rowIndex, itemRowKey, isPlaceholder })}
								</RowDraggableWrapper>
							);
						}
						return renderRow({ itemData, rowIndex, itemRowKey, isPlaceholder });
					}
				})}
			</div>

			{(() => {
				if (typeof draggingRowIndex === 'number' && draggingRow_notShow && RowDraggableWrapper) {
					const itemData = data[draggingRowIndex];
					if (itemData) {
						const rowIndex = draggingRowIndex;
						const itemRowKey = getRowKey(rowKey, itemData);
						return (
							<RowDraggableWrapper rowKey={itemRowKey} rowIndex={rowIndex}>
								{renderRow({
									itemData,
									rowIndex,
									itemRowKey,
									isPlaceholder: false,
									style: {
										left: 0,
										position: 'absolute',
										top: draggingRow_offsetTop,
										gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)`,
									},
								})}
							</RowDraggableWrapper>
						);
					}
				}
			})()}
		</div>
	);
};

export default memo(BodyInner) as typeof BodyInner;
