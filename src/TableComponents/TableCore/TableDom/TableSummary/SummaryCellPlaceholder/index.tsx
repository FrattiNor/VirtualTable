import classNames from 'classnames';

import styles from './index.module.less';
import { useTableInstanceContext } from '../../../TableContext';

import type { RowKeyType } from '../../../TableTypes/type';

type PlaceholderSpecificProps = {
	rowIndex: number;
	colIndex: number;
	itemRowKey: string;
};

const SummaryCellPlaceholder = (props: PlaceholderSpecificProps) => {
	const { itemRowKey, rowIndex, colIndex } = props;

	const ctx = useTableInstanceContext();
	const { bordered, rowHeight, getBodyCellBg, bodyRowMouseEnter, bodyRowMouseLeave } = ctx;

	const rowKeys = [itemRowKey] as RowKeyType[];

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

export default SummaryCellPlaceholder;
