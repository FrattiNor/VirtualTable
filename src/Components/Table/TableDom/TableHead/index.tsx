import { memo } from 'react';

import classNames from 'classnames';

import HeadCellPlaceholder from './HeadCellPlaceholder';
import HeadRow from './HeadRow';
import styles from './index.module.less';

import type { TableInstance } from '../../useTableInstance';

type Props<T> = Required<
	Pick<
		TableInstance<T>,
		| 'deepLevel'
		| 'splitColumnsArr'
		| 'bordered'
		| 'headRef'
		| 'gridTemplateColumns'
		| 'v_scrollbar'
		| 'rowHeight'
		| 'getHeadStickyStyle'
		| 'startResize'
		| 'resizeFlag'
		| 'getHeadCellBg'
		| 'columnsKeyIndexMap'
		| 'getHeadCellShow'
	>
>;

const TableHead = <T,>(props: Props<T>) => {
	const { headRef, gridTemplateColumns, v_scrollbar, deepLevel, bordered } = props;
	const vScrollbarWidth =
		v_scrollbar.width !== 0 && bordered === true ? `calc(${v_scrollbar.width}px + var(--table-cell-border-width))` : `${v_scrollbar.width}px`;
	const headGridTemplateColumns = v_scrollbar.have ? gridTemplateColumns + ` minmax(${vScrollbarWidth}, 1fr)` : gridTemplateColumns;

	return (
		<div ref={headRef} className={classNames(styles['head'])}>
			<div className={classNames(styles['head-inner'])} style={{ gridTemplateColumns: headGridTemplateColumns }}>
				{Array(deepLevel + 1)
					.fill(undefined)
					.map((_, rowIndex) => (
						<HeadRow
							key={rowIndex}
							rowIndex={rowIndex}
							bordered={props.bordered}
							rowHeight={props.rowHeight}
							deepLevel={props.deepLevel}
							resizeFlag={props.resizeFlag}
							startResize={props.startResize}
							getHeadCellBg={props.getHeadCellBg}
							getHeadCellShow={props.getHeadCellShow}
							splitColumnsArr={props.splitColumnsArr}
							columnsKeyIndexMap={props.columnsKeyIndexMap}
							getHeadStickyStyle={props.getHeadStickyStyle}
						/>
					))}

				<HeadCellPlaceholder
					rowIndexStart={0}
					rowIndexEnd={deepLevel}
					bordered={props.bordered}
					rowHeight={props.rowHeight}
					splitColumnsArr={props.splitColumnsArr}
				/>
			</div>
		</div>
	);
};

export default memo(TableHead) as typeof TableHead;
