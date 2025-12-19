import { memo } from 'react';

import BodyEmpty from './BodyEmpty';
import BodyInner from './BodyInner';
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
	| 'getBodyCellColShow'
	| 'getBodyCellRowShow'
	| 'v_totalSize'
	| 'getV_OffsetTop'
	| 'v_measureItemSize'
	| 'theme'
	| 'highlightKeywords'
>;

const TableBody = <T,>(props: Props<T>) => {
	const { bodyRef } = props;
	const isEmpty = (props.data ?? []).length === 0;

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
			<BodyInner
				data={props.data}
				rowKey={props.rowKey}
				bordered={props.bordered}
				rowHeight={props.rowHeight}
				v_totalSize={props.v_totalSize}
				bodyRowClick={props.bodyRowClick}
				bodyInnerRef={props.bodyInnerRef}
				getBodyCellBg={props.getBodyCellBg}
				getV_OffsetTop={props.getV_OffsetTop}
				splitColumnsArr={props.splitColumnsArr}
				highlightKeywords={props.highlightKeywords}
				v_measureItemSize={props.v_measureItemSize}
				bodyRowMouseEnter={props.bodyRowMouseEnter}
				bodyRowMouseLeave={props.bodyRowMouseLeave}
				getBodyStickyStyle={props.getBodyStickyStyle}
				gridTemplateColumns={props.gridTemplateColumns}
				getBodyCellColShow={props.getBodyCellColShow}
				getBodyCellRowShow={props.getBodyCellRowShow}
			/>
			{isEmpty && <BodyEmpty tableWidth={props.tableWidth} theme={props.theme} />}
		</div>
	);
};

export default memo(TableBody) as typeof TableBody;
