import { memo } from 'react';

import BodyInner from './BodyInner';
import styles from './index.module.less';
import MeasureCol from './MeasureCol';

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
	>
>;

const TableBody = <T,>(props: Props<T>) => {
	const { bodyRef } = props;

	return (
		<div ref={bodyRef} className={styles['body']}>
			{/* 监测col宽度 */}
			<MeasureCol
				resized={props.resized}
				resizeFlag={props.resizeFlag}
				sizeCacheMap={props.sizeCacheMap}
				setSizeCacheMap={props.setSizeCacheMap}
				splitColumnsArr_01={props.splitColumnsArr_01}
			/>
			<BodyInner
				data={props.data}
				rowKey={props.rowKey}
				bodyRef={props.bodyRef}
				bordered={props.bordered}
				rowHeight={props.rowHeight}
				tableWidth={props.tableWidth}
				setPingedMap={props.setPingedMap}
				fixedLeftMap={props.fixedLeftMap}
				bodyRowClick={props.bodyRowClick}
				bodyInnerRef={props.bodyInnerRef}
				getBodyCellBg={props.getBodyCellBg}
				fixedRightMap={props.fixedRightMap}
				splitColumnsArr={props.splitColumnsArr}
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
