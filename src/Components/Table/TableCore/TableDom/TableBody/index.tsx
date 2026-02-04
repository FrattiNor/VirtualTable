import { memo } from 'react';

import classNames from 'classnames';

import BodyContent from './BodyContent';
import BodyEmpty from './BodyEmpty';
import styles from './index.module.less';
import StickyObserver from './StickyObserver';

import type { TableInstance } from '../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	| 'finalColumnsArr'
	| 'bordered'
	| 'data'
	| 'rowKey'
	| 'gridTemplateColumns'
	| 'bodyWrapperRef'
	| 'bodyScrollPlaceholderRef'
	| 'rowHeight'
	| 'getBodyStickyStyle'
	| 'setPingedMap'
	| 'fixedLeftMap'
	| 'fixedRightMap'
	| 'getBodyCellBg'
	| 'tableWidth'
	| 'bodyRowClick'
	| 'bodyRowMouseEnter'
	| 'bodyRowMouseLeave'
	| 'h_totalSize'
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
	| 'bodyRef'
	| 'hiddenBodyWrapperScrollbar'
	| 'dataId'
>;

const TableBody = <T,>(props: Props<T>) => {
	const isEmpty = (props.data ?? []).length === 0;
	const { bodyRef, bodyWrapperRef, bodyScrollPlaceholderRef, v_totalSize, h_totalSize, hiddenBodyWrapperScrollbar } = props;

	return (
		<div ref={bodyWrapperRef} className={classNames(styles['body-wrapper'], { [styles['hidden-scroll-bar']]: hiddenBodyWrapperScrollbar })}>
			<div ref={bodyScrollPlaceholderRef} className={styles['body-scroll-placeholder']} style={{ height: v_totalSize, width: h_totalSize }} />
			<div ref={bodyRef} className={styles['body']}>
				<StickyObserver
					bodyRef={props.bodyRef}
					setPingedMap={props.setPingedMap}
					fixedLeftMap={props.fixedLeftMap}
					fixedRightMap={props.fixedRightMap}
					finalColumnsArr={props.finalColumnsArr}
					gridTemplateColumns={props.gridTemplateColumns}
				/>
				<div className={styles['body-inner']} style={{ minHeight: v_totalSize }}>
					<BodyContent
						data={props.data}
						dataId={props.dataId}
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
						finalColumnsArr={props.finalColumnsArr}
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
		</div>
	);
};

export default memo(TableBody) as typeof TableBody;
