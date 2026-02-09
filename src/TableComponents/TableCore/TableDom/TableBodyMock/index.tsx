import { memo } from 'react';

import classNames from 'classnames';

import ColSizeMeasure from './ColSizeMeasure';
import ColSizeObserver from './ColSizeObserver';
import styles from './index.module.less';
import { isMacOrFireFox } from '../../TableUtils';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';
import { type TableInstance } from '../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	| 'v_totalSize'
	| 'h_totalSize'
	| 'bordered'
	| 'resized'
	| 'resizeFlag'
	| 'columnsCore'
	| 'sizeCacheMap'
	| 'setSizeCacheMap'
	| 'colSizeObserverRef'
	| 'columnsKeys'
>;

// 模拟垂直滚动条是否显示
// 目的：使计算colSize和计算垂直滚动条保持同步
const TableBodyMock = <T,>(props: Props<T>) => {
	const { v_totalSize, h_totalSize, bordered, columnsKeys } = props;
	return (
		<div
			className={classNames(styles['table-body-mock'], {
				[scrollbarStyles['scrollbar']]: !isMacOrFireFox,
				[scrollbarStyles['table-body-mock']]: !isMacOrFireFox,
				[scrollbarStyles['bordered']]: !isMacOrFireFox && bordered,
			})}
		>
			<ColSizeObserver
				resized={props.resized}
				resizeFlag={props.resizeFlag}
				columnsCore={props.columnsCore}
				sizeCacheMap={props.sizeCacheMap}
				setSizeCacheMap={props.setSizeCacheMap}
				colSizeObserverRef={props.colSizeObserverRef}
			/>
			<ColSizeMeasure key={columnsKeys} setSizeCacheMap={props.setSizeCacheMap} colSizeObserverRef={props.colSizeObserverRef} />
			<div className={styles['body-scroll-mock-placeholder']} style={{ height: v_totalSize, width: h_totalSize }} />
		</div>
	);
};

export default memo(TableBodyMock) as typeof TableBodyMock;
