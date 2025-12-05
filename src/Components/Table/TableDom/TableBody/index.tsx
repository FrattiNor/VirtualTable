import { memo } from 'react';

import BodyInner from './BodyInner';
import styles from './index.module.less';
import MeasureColSizeRow from './MeasureColSizeRow';
import ObserverStickyRow from './ObserverStickyRow';

import type { TableInstance } from '../../useTableInstance';

type Props<T> = Required<
	Pick<
		TableInstance<T>,
		| 'splitColumnsArr'
		| 'splitColumnsArr_01'
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
		| 'columnsKeyIndexMap'
		| 'bodyRowClick'
		| 'bodyRowMouseEnter'
		| 'bodyRowMouseLeave'
		| 'getBodyCellShow'
		| 'v_totalSize'
		| 'v_offsetTop'
		| 'v_measureItemRef'
	>
>;

const TableBody = <T,>(props: Props<T>) => {
	const { bodyRef } = props;

	return (
		<div ref={bodyRef} className={styles['body']}>
			<MeasureColSizeRow
				resized={props.resized}
				resizeFlag={props.resizeFlag}
				sizeCacheMap={props.sizeCacheMap}
				setSizeCacheMap={props.setSizeCacheMap}
				splitColumnsArr_01={props.splitColumnsArr_01}
			/>
			<ObserverStickyRow
				bodyRef={props.bodyRef}
				setPingedMap={props.setPingedMap}
				fixedLeftMap={props.fixedLeftMap}
				fixedRightMap={props.fixedRightMap}
				splitColumnsArr={props.splitColumnsArr}
				columnsKeyIndexMap={props.columnsKeyIndexMap}
				gridTemplateColumns={props.gridTemplateColumns}
			/>
			<BodyInner
				data={props.data}
				rowKey={props.rowKey}
				bordered={props.bordered}
				rowHeight={props.rowHeight}
				tableWidth={props.tableWidth}
				v_totalSize={props.v_totalSize}
				v_offsetTop={props.v_offsetTop}
				bodyRowClick={props.bodyRowClick}
				bodyInnerRef={props.bodyInnerRef}
				getBodyCellBg={props.getBodyCellBg}
				getBodyCellShow={props.getBodyCellShow}
				splitColumnsArr={props.splitColumnsArr}
				v_measureItemRef={props.v_measureItemRef}
				bodyRowMouseEnter={props.bodyRowMouseEnter}
				bodyRowMouseLeave={props.bodyRowMouseLeave}
				getBodyStickyStyle={props.getBodyStickyStyle}
				columnsKeyIndexMap={props.columnsKeyIndexMap}
				gridTemplateColumns={props.gridTemplateColumns}
			/>
		</div>
	);
};

export default memo(TableBody) as typeof TableBody;
