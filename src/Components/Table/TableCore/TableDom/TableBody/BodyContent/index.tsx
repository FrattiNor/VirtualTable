import { type CSSProperties, Fragment, memo } from 'react';

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
	| 'bodyRowClick'
	| 'bodyRowMouseEnter'
	| 'bodyRowMouseLeave'
	| 'v_offsetTop'
	| 'v_measureItemSize'
	| 'highlightKeywords'
	| 'renderBodyDom'
	| 'renderCellPrefix'
	| 'getRowKeys'
	| 'getColKeys'
	| 'getBodyCellColShow'
	| 'getBodyCellColForceShow'
	| 'renderWidthDraggableWrapper'
	| 'draggingRow_offsetTop'
	| 'draggingRow_notShow'
	| 'RowDraggableWrapper'
	| 'rowDraggableMode'
	| 'draggingRowIndex'
	| 'draggingRowKey'
	| 'borderWidth'
>;

const BodyContent = <T,>(props: Props<T>) => {
	const {
		data,
		rowKey,
		v_offsetTop,
		renderBodyDom,
		rowDraggableMode,
		gridTemplateColumns,
		RowDraggableWrapper,
		draggingRow_notShow,
		draggingRow_offsetTop,
		draggingRowIndex,
		draggingRowKey,
		getBodyCellColShow,
		getBodyCellColForceShow,
		renderWidthDraggableWrapper,
	} = props;

	// 渲染行
	type RenderRowProps = { itemData: T; rowIndex: number; itemRowKey: string; isPlaceholder: boolean; style?: CSSProperties };
	const renderRow = ({ style, itemData, rowIndex, itemRowKey, isPlaceholder }: RenderRowProps) => {
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
				borderWidth={props.borderWidth}
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

	// content样式
	const contentStyle = { gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)`, transform: `translate3d(0,${v_offsetTop}px,0)` };

	// 如果存在行拖拽
	if (rowDraggableMode && RowDraggableWrapper && typeof renderWidthDraggableWrapper === 'function') {
		// 渲染正在拖拽的行【当此行被虚拟列表隐藏】
		const renderDraggingRow = () => {
			if (typeof draggingRowIndex === 'number' && draggingRow_notShow && RowDraggableWrapper) {
				const itemData = data[draggingRowIndex];
				if (itemData) {
					const itemRowKey = getRowKey(rowKey, itemData);
					if (itemRowKey === draggingRowKey) {
						const rowIndex = draggingRowIndex;
						const style: CSSProperties = {
							left: 0,
							position: 'absolute',
							top: draggingRow_offsetTop,
							gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)`,
						};
						return (
							<RowDraggableWrapper rowKey={itemRowKey} rowIndex={rowIndex}>
								{renderRow({ style, itemData, rowIndex, itemRowKey, isPlaceholder: false })}
							</RowDraggableWrapper>
						);
					}
				}
			}
		};

		return renderWidthDraggableWrapper(
			<Fragment>
				<div className={styles['draggable-mode-content']} style={contentStyle}>
					{renderBodyDom(({ itemData, itemRowKey, rowIndex, isPlaceholder }) => {
						return (
							<RowDraggableWrapper key={`${isPlaceholder}-${itemRowKey}`} rowKey={itemRowKey} rowIndex={rowIndex}>
								{renderRow({ itemData, rowIndex, itemRowKey, isPlaceholder })}
							</RowDraggableWrapper>
						);
					})}
				</div>
				{renderDraggingRow()}
			</Fragment>,
		);
	}

	// 不存在行拖拽
	return (
		<div className={styles['body-content']} style={contentStyle}>
			{renderBodyDom(({ itemData, itemRowKey, rowIndex, isPlaceholder }) => {
				return renderRow({ itemData, rowIndex, itemRowKey, isPlaceholder });
			})}
		</div>
	);
};

export default memo(BodyContent) as typeof BodyContent;
