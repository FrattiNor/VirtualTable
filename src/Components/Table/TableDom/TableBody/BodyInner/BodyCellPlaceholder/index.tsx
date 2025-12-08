import { memo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';

import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Required<
	Pick<
		TableInstance<T>,
		'bordered' | 'rowHeight' | 'v_measureItemRef' | 'bodyRowClick' | 'bodyRowMouseEnter' | 'bodyRowMouseLeave' | 'getBodyCellBg'
	>
> & {
	rowIndex: number;
	colIndex: number;
	dataRowKey: string;
};

const BodyCellPlaceholder = <T,>(props: Props<T>) => {
	const {
		dataRowKey,
		bordered,
		rowIndex,
		colIndex,
		rowHeight,
		v_measureItemRef,
		bodyRowClick,
		bodyRowMouseEnter,
		bodyRowMouseLeave,
		getBodyCellBg,
	} = props;

	const backgroundColor = getBodyCellBg({ rowKeys: [dataRowKey], colKeys: undefined });

	return (
		<div
			data-col={colIndex + 1}
			onClick={bodyRowClick ? () => bodyRowClick({ rowKeys: [dataRowKey] }) : undefined}
			onMouseEnter={bodyRowMouseEnter ? () => bodyRowMouseEnter({ rowKeys: [dataRowKey] }) : undefined}
			onMouseLeave={bodyRowMouseLeave ? () => bodyRowMouseLeave({ rowKeys: [dataRowKey] }) : undefined}
			ref={(node) => v_measureItemRef(rowIndex, node)}
			style={{
				backgroundColor,
				minHeight: rowHeight,
				gridRow: `${rowIndex + 1}/${rowIndex + 2}`,
				gridColumn: `${colIndex + 1}/${colIndex + 2}`,
			}}
			className={classNames(styles['body-cell-placeholder'], {
				[styles['bordered']]: bordered,
				[styles['first-col']]: colIndex === 0,
				[styles['first-row']]: rowIndex === 0,
			})}
		/>
	);
};

export default memo(BodyCellPlaceholder) as typeof BodyCellPlaceholder;
