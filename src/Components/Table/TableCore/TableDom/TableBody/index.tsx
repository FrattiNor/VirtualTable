import { memo } from 'react';

import BodyContent from './BodyContent';
import BodyEmpty from './BodyEmpty';
import styles from './index.module.less';
import MeasureColSizeRow from './MeasureColSizeRow';
import ObserverStickyRow from './ObserverStickyRow';

import type { TableInstance } from '../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	| 'splitColumnsArr'
	| 'columnsCore'
	| 'bordered'
	| 'data'
	| 'rowKey'
	| 'gridTemplateColumns'
	| 'bodyRef'
	| 'bodyInnerRef'
	| 'rowHeight'
	| 'getBodyStickyStyle'
	| 'setSizeCacheMap'
	| 'setPingedMap'
	| 'fixedLeftMap'
	| 'fixedRightMap'
	| 'getBodyCellBg'
	| 'sizeCacheMap'
	| 'resized'
	| 'resizeFlag'
	| 'tableWidth'
	| 'bodyRowClick'
	| 'bodyRowMouseEnter'
	| 'bodyRowMouseLeave'
	| 'v_totalSize'
	| 'v_offsetTop'
	| 'v_measureItemSize'
	| 'theme'
	| 'highlightKeywords'
	| 'renderBodyDom'
	| 'renderCellPrefix'
	| 'renderEmpty'
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
>;

const TableBody = <T,>(props: Props<T>) => {
	const isEmpty = (props.data ?? []).length === 0;
	const { bodyRef, bodyInnerRef, v_totalSize } = props;

	return (
		<div ref={bodyRef} className={styles['body']}>
			<MeasureColSizeRow
				resized={props.resized}
				resizeFlag={props.resizeFlag}
				sizeCacheMap={props.sizeCacheMap}
				setSizeCacheMap={props.setSizeCacheMap}
				columnsCore={props.columnsCore}
			/>
			<ObserverStickyRow
				bodyRef={props.bodyRef}
				setPingedMap={props.setPingedMap}
				fixedLeftMap={props.fixedLeftMap}
				fixedRightMap={props.fixedRightMap}
				splitColumnsArr={props.splitColumnsArr}
				gridTemplateColumns={props.gridTemplateColumns}
			/>
			<div ref={bodyInnerRef} className={styles['body-inner']} style={{ minHeight: v_totalSize }}>
				<BodyContent
					data={props.data}
					rowKey={props.rowKey}
					bordered={props.bordered}
					rowHeight={props.rowHeight}
					getColKeys={props.getColKeys}
					getRowKeys={props.getRowKeys}
					v_offsetTop={props.v_offsetTop}
					bodyRowClick={props.bodyRowClick}
					getBodyCellBg={props.getBodyCellBg}
					renderBodyDom={props.renderBodyDom}
					draggingRowKey={props.draggingRowKey}
					splitColumnsArr={props.splitColumnsArr}
					renderCellPrefix={props.renderCellPrefix}
					draggingRowIndex={props.draggingRowIndex}
					rowDraggableMode={props.rowDraggableMode}
					highlightKeywords={props.highlightKeywords}
					v_measureItemSize={props.v_measureItemSize}
					bodyRowMouseEnter={props.bodyRowMouseEnter}
					bodyRowMouseLeave={props.bodyRowMouseLeave}
					getBodyCellColShow={props.getBodyCellColShow}
					getBodyStickyStyle={props.getBodyStickyStyle}
					draggingRow_notShow={props.draggingRow_notShow}
					RowDraggableWrapper={props.RowDraggableWrapper}
					gridTemplateColumns={props.gridTemplateColumns}
					draggingRow_offsetTop={props.draggingRow_offsetTop}
					getBodyCellColForceShow={props.getBodyCellColForceShow}
					renderWidthDraggableWrapper={props.renderWidthDraggableWrapper}
				/>
			</div>
			{isEmpty && <BodyEmpty tableWidth={props.tableWidth} theme={props.theme} renderEmpty={props.renderEmpty} />}
		</div>
	);
};

export default memo(TableBody) as typeof TableBody;
