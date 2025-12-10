import { type CSSProperties, Fragment, memo, useMemo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import ResizeHandle from './ResizeHandle';
import { getCellTitle, getColKeys, getResize, isStrNum } from '../../../../TableUtils';

import type { Table2Column, Table2ColumnGroup } from '../../../../TableTypes/typeColumn';
import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	'splitColumnsArr' | 'bordered' | 'rowHeight' | 'getHeadStickyStyle' | 'startResize' | 'resizeFlag' | 'getHeadCellBg'
> & {
	rowIndexStart: number;
	rowIndexEnd: number;
	colIndexStart: number;
	colIndexEnd: number;
} & (
		| {
				isLeaf: true;
				column: Table2Column<T>;
		  }
		| {
				isLeaf: false;
				column: Table2ColumnGroup<T>;
		  }
	);

const HeadCell = <T,>(props: Props<T>) => {
	const {
		isLeaf,
		column,
		splitColumnsArr,
		bordered,
		rowIndexStart,
		rowIndexEnd,
		colIndexStart,
		colIndexEnd,
		rowHeight,
		getHeadStickyStyle,
		getHeadCellBg,
	} = props;

	const resize = useMemo(() => getResize(splitColumnsArr, colIndexStart, colIndexEnd), [splitColumnsArr, colIndexStart, colIndexEnd]);
	const colKeys = useMemo(() => getColKeys(splitColumnsArr, colIndexStart, colIndexEnd), [splitColumnsArr, colIndexStart, colIndexEnd]);

	const renderDom = column.title;
	const filterDom = column.filter;
	const haveFilter = isLeaf && filterDom;
	const title = getCellTitle(renderDom);
	const canEllipsis = isStrNum(renderDom);
	const backgroundColor = getHeadCellBg({ colKeys });
	const { stickyStyle, rightLastPinged, leftFirstPinged, leftLastPinged } = getHeadStickyStyle({ colKeys });
	const alignJustifyContent: CSSProperties['justifyContent'] =
		column.align === 'center' ? 'center' : column.align === 'right' ? 'flex-end' : 'flex-start';

	return (
		<div
			title={title}
			className={classNames(styles['head-cell'], {
				[styles['bordered']]: bordered,
				[styles['first-col']]: colIndexStart === 0,
				[styles['left-last-pinged']]: leftLastPinged,
				[styles['right-last-pinged']]: rightLastPinged,
				[styles['not-first-col-and-left-first-pinged']]: colIndexStart !== 0 && leftFirstPinged,
				[styles['not-first-col-and-right-last-pinged']]: colIndexStart !== 0 && rightLastPinged,
			})}
			style={{
				...stickyStyle,
				backgroundColor,
				gridRow: `${rowIndexStart + 1}/${rowIndexEnd + 2}`,
				gridColumn: `${colIndexStart + 1}/${colIndexEnd + 2}`,
				minHeight: (rowIndexEnd - rowIndexStart + 1) * rowHeight,
				justifyContent: !haveFilter ? alignJustifyContent : undefined,
			}}
		>
			{!haveFilter ? (
				<Fragment>{!canEllipsis ? renderDom : <div className={styles['ellipsis-wrapper']}>{renderDom}</div>}</Fragment>
			) : (
				<Fragment>
					<div className={styles['head-cell-inner']} style={{ justifyContent: alignJustifyContent }}>
						{!canEllipsis ? renderDom : <div className={styles['ellipsis-wrapper']}>{renderDom}</div>}
					</div>
					<Fragment>{filterDom}</Fragment>
				</Fragment>
			)}

			{resize === true && (
				<ResizeHandle
					columnKey={column.key}
					colIndexEnd={colIndexEnd}
					colIndexStart={colIndexStart}
					resizeFlag={props.resizeFlag}
					startResize={props.startResize}
				/>
			)}
		</div>
	);
};

export default memo(HeadCell) as typeof HeadCell;
