import { type CSSProperties, Fragment } from 'react';

import BodyRow from './BodyRow';
import styles from './index.module.less';
import { useTableInstanceContext } from '../../../TableContext';
import { type RowKeyType } from '../../../TableTypes/type';
import { getRowKey } from '../../../TableUtils';

const BodyContent = <T,>() => {
	const ctx = useTableInstanceContext<T>();
	const {
		data,
		rowKey,
		v_items,
		v_offsetTop,
		rowDraggableMode,
		gridTemplateColumns,
		RowDraggableWrapper,
		draggingRow_notShow,
		draggingRow_offsetTop,
		draggingRowIndex,
		draggingRowKey,
		getPlaceholderRow,
		renderWidthDraggableWrapper,
	} = ctx;

	// 渲染行
	type RenderRowProps = { itemData: T; rowIndex: number; itemRowKey: RowKeyType; isPlaceholder: boolean; style?: CSSProperties };
	const renderRow = ({ style, itemData, rowIndex, itemRowKey, isPlaceholder }: RenderRowProps) => {
		return (
			<BodyRow
				key={itemRowKey}
				style={style}
				itemData={itemData}
				rowIndex={rowIndex}
				itemRowKey={itemRowKey}
				isPlaceholder={isPlaceholder}
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
					{v_items.map(({ index: rowIndex }) => {
						const itemData = data[rowIndex];
						if (itemData) {
							const itemRowKey = getRowKey(rowKey, itemData);
							const isPlaceholder = getPlaceholderRow(rowIndex);
							return (
								<RowDraggableWrapper key={`${isPlaceholder}-${itemRowKey}`} rowKey={itemRowKey} rowIndex={rowIndex}>
									{renderRow({ itemData, rowIndex, itemRowKey, isPlaceholder })}
								</RowDraggableWrapper>
							);
						}
					})}
				</div>
				{renderDraggingRow()}
			</Fragment>,
		);
	}

	// 不存在行拖拽
	return (
		<div className={styles['body-content']} style={contentStyle}>
			{v_items.map(({ index: rowIndex }) => {
				const itemData = data[rowIndex];
				if (itemData) {
					const itemRowKey = getRowKey(rowKey, itemData);
					const isPlaceholder = getPlaceholderRow(rowIndex);
					return renderRow({ itemData, rowIndex, itemRowKey, isPlaceholder });
				}
			})}
		</div>
	);
};

export default BodyContent;
