import { Fragment, useMemo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import ResizeHandle from './ResizeHandle';
import SortIcon from './SortIcon';
import { useTableInstanceContext } from '../../../../TableContext';
import { getCellTitle, getResize, isEmptyRender, isStrNum } from '../../../../TableUtils';

import type { TableCoreColumn, TableCoreColumnGroup } from '../../../../TableTypes/typeColumn';

type ContextualProps = {
	rowIndexStart: number;
	rowIndexEnd: number;
	colIndexStart: number;
	colIndexEnd: number;
} & (
		| {
				isLeaf: true;
				column: TableCoreColumn<any>;
		  }
		| {
				isLeaf: false;
				column: TableCoreColumnGroup<any>;
		  }
	);

const HeadCell = <T,>(props: ContextualProps) => {
	const {
		isLeaf,
		column,
		rowIndexStart,
		rowIndexEnd,
		colIndexStart,
		colIndexEnd,
	} = props;

	const ctx = useTableInstanceContext<T>();
	const { sorter, finalColumnsArr, bordered, rowHeight, getColKeys, getHeadStickyStyle, getHeadCellBg, renderHeadPrefix, resizeFlag, startResize } = ctx;

	const sortKey = sorter?.sortKey;
	const sortValue = sorter?.sortValue;
	const onSortChange = sorter?.onSortChange;
	const couldSort = isLeaf && column.sorter === true;
	const currentSortValue = sortKey === column.key ? sortValue : undefined;
	const resize = useMemo(() => getResize(finalColumnsArr, colIndexStart, colIndexEnd), [finalColumnsArr, colIndexStart, colIndexEnd]);
	const colKeys = useMemo(() => getColKeys(colIndexStart, colIndexEnd), [colIndexStart, colIndexEnd]);
	const renderDom = !isEmptyRender(column.title) ? column.title : '-';
	const filterDom = column.filter;
	const title = getCellTitle(renderDom);
	const canEllipsis = isStrNum(renderDom);
	const backgroundColor = getHeadCellBg({ colKeys });
	const { stickyStyle, hiddenLeftBorder, leftLastPinged, rightLastPinged } = getHeadStickyStyle({ colKeys });
	const style = column.headStyle;
	const align = column.align ?? (isLeaf ? 'left' : colIndexStart === colIndexEnd ? 'left' : 'center');
	const onClick = () => {
		if (couldSort) {
			const nextSortValue = currentSortValue === undefined ? 'asc' : currentSortValue === 'asc' ? 'desc' : undefined;
			if (typeof onSortChange === 'function') onSortChange({ sortKey: column.key, sortValue: nextSortValue });
		}
	};

	return (
		<div
			title={title}
			onClick={couldSort ? onClick : undefined}
			className={classNames(styles['head-cell'], {
				[styles['bordered']]: bordered,
				[styles['could-sort']]: couldSort,
				[styles['first-col']]: colIndexStart === 0,
				[styles['left-last-pinged']]: leftLastPinged,
				[styles['right-last-pinged']]: rightLastPinged,
				[styles['hidden-left-border']]: colIndexStart !== 0 && hiddenLeftBorder,
			})}
			style={{
				backgroundColor,
				gridRow: `${rowIndexStart + 1}/${rowIndexEnd + 2}`,
				gridColumn: `${colIndexStart + 1}/${colIndexEnd + 2}`,
				minHeight: (rowIndexEnd - rowIndexStart + 1) * rowHeight,
				justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
				...stickyStyle,
				...style,
			}}
		>
			{(() => {
				const content = (
					<Fragment>
						{isLeaf && typeof renderHeadPrefix === 'function' ? renderHeadPrefix(column.key) : undefined}
						{!canEllipsis ? (
							<div className={styles['block-wrapper']}>{renderDom}</div>
						) : (
							<div className={styles['text-wrapper']}>{renderDom}</div>
						)}
					</Fragment>
				);

				if (!filterDom && !couldSort && !renderHeadPrefix) return content;

				return (
					<Fragment>
						<div
							className={classNames({
								[styles['head-cell-inner']]: align !== 'center',
								[styles['head-cell-inner-center']]: align === 'center',
							})}
						>
							{content}
						</div>

						{couldSort && (
							<div className={styles['sort-wrapper']}>
								<SortIcon sortValue={currentSortValue} />
							</div>
						)}

						{filterDom && (
							<div className={styles['filer-wrapper']} onClick={(e) => e.stopPropagation()}>
								{filterDom}
							</div>
						)}
					</Fragment>
				);
			})()}

			{resize === true && (
				<ResizeHandle
					columnKey={column.key}
					colIndexEnd={colIndexEnd}
					colIndexStart={colIndexStart}
					resizeFlag={resizeFlag}
					startResize={startResize}
				/>
			)}
		</div>
	);
};

export default HeadCell as typeof HeadCell;
