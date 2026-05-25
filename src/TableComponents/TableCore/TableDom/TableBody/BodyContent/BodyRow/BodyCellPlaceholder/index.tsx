import { useLayoutEffect, useRef } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import { useTableInstanceContext } from '../../../../../TableContext';
import { type RowKeyType } from '../../../../../TableTypes/type';

type PlaceholderSpecificProps = {
	rowIndex: number;
	colIndex: number;
	itemRowKey: RowKeyType;
};

const BodyCellPlaceholder = <T,>(props: PlaceholderSpecificProps) => {
	const {
		itemRowKey,
		rowIndex,
		colIndex,
	} = props;

	const ctx = useTableInstanceContext<T>();
	const { bordered, rowHeight, bodyRowClick, getBodyCellBg, bodyRowMouseEnter, bodyRowMouseLeave, v_measureItemSize } = ctx;

	const ref = useRef<HTMLDivElement | null>(null);

	const rowKeys = [itemRowKey];

	const backgroundColor = getBodyCellBg({ rowKeys, colKeys: undefined });

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

export default BodyCellPlaceholder as typeof BodyCellPlaceholder;
