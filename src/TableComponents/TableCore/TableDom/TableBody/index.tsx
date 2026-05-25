import classNames from 'classnames';

import BodyContent from './BodyContent';
import BodyEmpty from './BodyEmpty';
import styles from './index.module.less';
import StickyObserver from './StickyObserver';
import { useTableInstanceContext } from '../../TableContext';

const TableBody = <T,>() => {
	const props = useTableInstanceContext<T>();
	const isEmpty = (props.data ?? []).length === 0;
	const { bodyRef, bodyWrapperRef, bodyScrollPlaceholderRef, v_totalSize, h_totalSize, hiddenBodyWrapperScrollbar } = props;

	return (
		<div ref={bodyWrapperRef} className={classNames(styles['body-wrapper'], { [styles['hidden-scroll-bar']]: hiddenBodyWrapperScrollbar })}>
			<div ref={bodyScrollPlaceholderRef} className={styles['body-scroll-placeholder']} style={{ height: v_totalSize, width: h_totalSize }} />
			<div ref={bodyRef} className={styles['body']}>
				<StickyObserver />
				<div className={styles['body-inner']} style={{ height: v_totalSize }}>
					<BodyContent />
				</div>
				{isEmpty && <BodyEmpty tableWidth={props.tableWidth} theme={props.theme} renderEmpty={props.renderEmpty} />}
			</div>
		</div>
	);
};

export default TableBody;

