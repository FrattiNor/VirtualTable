import { memo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';

import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Required<Pick<TableInstance<T>, 'bordered' | 'rowHeight' | 'v_measureItemRef'>> & {
	rowIndex: number;
	colIndex: number;
};

const BodyCellPlaceholder = <T,>(props: Props<T>) => {
	const { bordered, rowIndex, colIndex, rowHeight, v_measureItemRef } = props;

	return (
		<div
			data-col={colIndex + 1}
			ref={(node) => v_measureItemRef(rowIndex, node)}
			style={{
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
