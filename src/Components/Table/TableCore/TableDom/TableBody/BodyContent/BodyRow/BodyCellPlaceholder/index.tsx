import { memo, useLayoutEffect, useRef } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import { type RowKeyType } from '../../../../../TableTypes/type';

import type { TableInstance } from '../../../../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	'bordered' | 'rowHeight' | 'v_measureItemSize' | 'bodyRowClick' | 'bodyRowMouseEnter' | 'bodyRowMouseLeave' | 'getBodyCellBg'
> & {
	rowIndex: number;
	colIndex: number;
	itemRowKey: RowKeyType;
};

const BodyCellPlaceholder = <T,>(props: Props<T>) => {
	const {
		itemRowKey,
		bordered,
		rowIndex,
		colIndex,
		rowHeight,
		bodyRowClick,
		getBodyCellBg,
		bodyRowMouseEnter,
		bodyRowMouseLeave,
		v_measureItemSize,
	} = props;

	const ref = useRef<HTMLDivElement | null>(null);

	const rowKeys = [itemRowKey];

	const backgroundColor = getBodyCellBg({ rowKeys, colKeys: undefined });

	// 动态监测行高
	useLayoutEffect(() => {
		if (ref.current) {
			return v_measureItemSize(rowIndex, ref.current);
		}
	}, [itemRowKey]);

	return (
		<div
			ref={ref}
			data-index={rowIndex}
			onClick={bodyRowClick ? () => bodyRowClick({ rowKeys }) : undefined}
			onMouseEnter={bodyRowMouseEnter ? () => bodyRowMouseEnter({ rowKeys }) : undefined}
			onMouseLeave={bodyRowMouseLeave ? () => bodyRowMouseLeave({ rowKeys }) : undefined}
			style={{
				backgroundColor,
				gridRow: `${rowIndex + 1}/${rowIndex + 2}`,
				gridColumn: `${colIndex + 1}/${colIndex + 2}`,
				minHeight: rowHeight,
			}}
			className={classNames(styles['body-cell-placeholder'], {
				[styles['bordered']]: bordered,
				[styles['first-col']]: colIndex === 0,
			})}
		/>
	);
};

export default memo(BodyCellPlaceholder) as typeof BodyCellPlaceholder;
