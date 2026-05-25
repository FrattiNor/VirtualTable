import classNames from 'classnames';

import ColSizeMeasure from './ColSizeMeasure';
import ColSizeObserver from './ColSizeObserver';
import styles from './index.module.less';
import { useTableInstanceContext } from '../../TableContext';
import { isMacOrFireFox } from '../../TableUtils';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';

const TableBodyMock = <T,>() => {
	const props = useTableInstanceContext<T>();
	const { v_totalSize, h_totalSize, bordered, columnsKeys } = props;
	return (
		<div
			className={classNames(styles['table-body-mock'], {
				[scrollbarStyles['scrollbar']]: !isMacOrFireFox,
				[scrollbarStyles['table-body-mock']]: !isMacOrFireFox,
				[scrollbarStyles['bordered']]: !isMacOrFireFox && bordered,
			})}
		>
			<ColSizeObserver />
			<ColSizeMeasure key={columnsKeys} />
			<div className={styles['body-scroll-mock-placeholder']} style={{ height: v_totalSize, width: h_totalSize }} />
		</div>
	);
};

export default TableBodyMock;
