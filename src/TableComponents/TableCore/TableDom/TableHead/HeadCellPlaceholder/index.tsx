import classNames from 'classnames';

import styles from './index.module.less';
import { useTableInstanceContext } from '../../../TableContext';

type PlaceholderSpecificProps = {
	rowIndexStart: number;
	rowIndexEnd: number;
};

const HeadCellPlaceholder = <T,>(props: PlaceholderSpecificProps) => {
	const { rowIndexStart, rowIndexEnd } = props;
	const ctx = useTableInstanceContext<T>();
	const { bordered, finalColumnsArr, rowHeight } = ctx;
	const colIndex = finalColumnsArr.length;

	return (
		<div
			data-col={colIndex + 1}
			style={{
				gridColumn: `${colIndex + 1}/${colIndex + 2}`,
				gridRow: `${rowIndexStart + 1}/${rowIndexEnd + 2}`,
				minHeight: (rowIndexEnd - rowIndexStart + 1) * rowHeight,
			}}
			className={classNames(styles['head-cell-placeholder'], {
				[styles['bordered']]: bordered,
				[styles['first-col']]: colIndex === 0,
			})}
		/>
	);
};

export default HeadCellPlaceholder as typeof HeadCellPlaceholder;
