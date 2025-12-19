import { memo, useLayoutEffect, useRef } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';

import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<
	TableInstance<T>,
	'bordered' | 'rowHeight' | 'v_measureItemSize' | 'bodyRowClick' | 'bodyRowMouseEnter' | 'bodyRowMouseLeave' | 'getBodyCellBg'
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
		bodyRowClick,
		getBodyCellBg,
		bodyRowMouseEnter,
		bodyRowMouseLeave,
		v_measureItemSize,
	} = props;

	const ref = useRef<HTMLDivElement | null>(null);
	const backgroundColor = getBodyCellBg({ rowKeys: [dataRowKey], colKeys: undefined });

	// 动态监测行高
	useLayoutEffect(() => {
		if (ref.current) {
			return v_measureItemSize(rowIndex, ref.current);
		}
	}, [dataRowKey]);

	return (
		<div
			ref={ref}
			data-index={rowIndex}
			onClick={bodyRowClick ? () => bodyRowClick({ rowKeys: [dataRowKey] }) : undefined}
			onMouseEnter={bodyRowMouseEnter ? () => bodyRowMouseEnter({ rowKeys: [dataRowKey] }) : undefined}
			onMouseLeave={bodyRowMouseLeave ? () => bodyRowMouseLeave({ rowKeys: [dataRowKey] }) : undefined}
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
