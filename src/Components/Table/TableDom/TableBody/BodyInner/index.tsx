import { memo } from 'react';

import BodyEmpty from './BodyEmpty';
import BodyRow from './BodyRow';
import styles from './index.module.less';
import StickyObserverRow from './StickyObserverRow';
import { getRowKey } from '../../../TableUtils';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Required<
	Pick<
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
		| 'tableWidth'
		| 'columnsKeyIndexMap'
		| 'bodyRowClick'
		| 'bodyRowMouseEnter'
		| 'bodyRowMouseLeave'
		| 'bodyRef'
		| 'setPingedMap'
		| 'fixedLeftMap'
		| 'fixedRightMap'
	>
>;

const BodyInner = <T,>(props: Props<T>) => {
	const { data, rowKey, gridTemplateColumns, bodyInnerRef } = props;
	const isEmpty = (data ?? []).length === 0;

	return (
		<div ref={bodyInnerRef} className={styles['body-inner']} style={{ gridTemplateColumns: gridTemplateColumns + ` minmax(0px, 1fr)` }}>
			{isEmpty && <BodyEmpty tableWidth={props.tableWidth} />}
			{data?.map((dataItem, rowIndex) => (
				<BodyRow
					data={props.data}
					dataItem={dataItem}
					rowIndex={rowIndex}
					rowKey={props.rowKey}
					bordered={props.bordered}
					rowHeight={props.rowHeight}
					bodyRowClick={props.bodyRowClick}
					getBodyCellBg={props.getBodyCellBg}
					splitColumnsArr={props.splitColumnsArr}
					key={getRowKey(rowKey, dataItem, rowIndex)}
					bodyRowMouseEnter={props.bodyRowMouseEnter}
					bodyRowMouseLeave={props.bodyRowMouseLeave}
					getBodyStickyStyle={props.getBodyStickyStyle}
					columnsKeyIndexMap={props.columnsKeyIndexMap}
				/>
			))}
			<StickyObserverRow
				bodyRef={props.bodyRef}
				setPingedMap={props.setPingedMap}
				fixedLeftMap={props.fixedLeftMap}
				fixedRightMap={props.fixedRightMap}
				splitColumnsArr={props.splitColumnsArr}
				columnsKeyIndexMap={props.columnsKeyIndexMap}
			/>
		</div>
	);
};

export default memo(BodyInner) as typeof BodyInner;
