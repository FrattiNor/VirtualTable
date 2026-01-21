import { memo } from 'react';

import classNames from 'classnames';

import HeadCellPlaceholder from './HeadCellPlaceholder';
import HeadRow from './HeadRow';
import styles from './index.module.less';

import type { TableInstance } from '../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	| 'deepLevel'
	| 'finalColumnsArr'
	| 'bordered'
	| 'headRef'
	| 'gridTemplateColumns'
	| 'v_scrollbar'
	| 'rowHeight'
	| 'getHeadStickyStyle'
	| 'startResize'
	| 'resizeFlag'
	| 'getHeadCellBg'
	| 'getHeadCellColShow'
	| 'renderHeadPrefix'
	| 'getColKeys'
	| 'sorter'
>;

const TableHead = <T,>(props: Props<T>) => {
	const { headRef, gridTemplateColumns, v_scrollbar, deepLevel } = props;
	const headGridTemplateColumns = v_scrollbar.have ? gridTemplateColumns + ` minmax(${v_scrollbar.widthStr}, 1fr)` : gridTemplateColumns;

	return (
		<div ref={headRef} className={classNames(styles['head'])}>
			<div className={classNames(styles['head-inner'])} style={{ gridTemplateColumns: headGridTemplateColumns }}>
				{Array(deepLevel + 1)
					.fill(undefined)
					.map((_, rowIndex) => (
						<HeadRow
							key={rowIndex}
							rowIndex={rowIndex}
							sorter={props.sorter}
							bordered={props.bordered}
							rowHeight={props.rowHeight}
							deepLevel={props.deepLevel}
							resizeFlag={props.resizeFlag}
							getColKeys={props.getColKeys}
							startResize={props.startResize}
							getHeadCellBg={props.getHeadCellBg}
							finalColumnsArr={props.finalColumnsArr}
							renderHeadPrefix={props.renderHeadPrefix}
							getHeadCellColShow={props.getHeadCellColShow}
							getHeadStickyStyle={props.getHeadStickyStyle}
						/>
					))}

				<HeadCellPlaceholder
					rowIndexStart={0}
					rowIndexEnd={deepLevel}
					bordered={props.bordered}
					rowHeight={props.rowHeight}
					finalColumnsArr={props.finalColumnsArr}
				/>
			</div>
		</div>
	);
};

export default memo(TableHead) as typeof TableHead;
