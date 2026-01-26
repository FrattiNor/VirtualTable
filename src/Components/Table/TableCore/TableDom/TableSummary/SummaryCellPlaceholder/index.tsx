import { memo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';

import type { TableInstance } from '../../../useTableInstance';

type Props<T, K, S> = Pick<TableInstance<T, K, S>, 'bordered' | 'rowHeight' | 'bodyRowMouseEnter' | 'bodyRowMouseLeave' | 'getBodyCellBg'> & {
	rowIndex: number;
	colIndex: number;
	itemRowKey: string;
};

const SummaryCellPlaceholder = <T, K, S>(props: Props<T, K, S>) => {
	const { itemRowKey, bordered, rowIndex, colIndex, rowHeight, getBodyCellBg, bodyRowMouseEnter, bodyRowMouseLeave } = props;

	const rowKeys = [itemRowKey] as K[];

	const backgroundColor = getBodyCellBg({ rowKeys, colKeys: undefined });

	return (
		<div
			onMouseEnter={bodyRowMouseEnter ? () => bodyRowMouseEnter({ rowKeys }) : undefined}
			onMouseLeave={bodyRowMouseLeave ? () => bodyRowMouseLeave({ rowKeys }) : undefined}
			style={{
				backgroundColor,
				minHeight: rowHeight,
				gridRow: `${rowIndex + 1}/${rowIndex + 2}`,
				gridColumn: `${colIndex + 1}/${colIndex + 2}`,
			}}
			className={classNames(styles['summary-cell-placeholder'], {
				[styles['bordered']]: bordered,
				[styles['first-col']]: colIndex === 0,
			})}
		/>
	);
};

export default memo(SummaryCellPlaceholder) as typeof SummaryCellPlaceholder;
