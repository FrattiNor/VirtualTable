import classNames from 'classnames';

import styles from './index.module.less';
import { useTableInstanceContext } from '../../TableContext';
import { isMacOrFireFox } from '../../TableUtils';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';

const ScrollbarV = <T,>() => {
	const props = useTableInstanceContext<T>();
	const { vScrollbarState, bordered, vScrollbarRef, v_totalSize } = props;

	if (vScrollbarState.have && vScrollbarState.width > 0) {
		const vScrollbarWidth = vScrollbarState.widthStr;
		return (
			<div
				ref={vScrollbarRef}
				style={{ width: vScrollbarWidth, minWidth: vScrollbarWidth, maxWidth: vScrollbarWidth }}
				className={classNames(styles['v-scrollbar'], {
					[styles['bordered']]: bordered,
					[scrollbarStyles['scrollbar']]: !isMacOrFireFox,
					[scrollbarStyles['bordered']]: !isMacOrFireFox && bordered,
				})}
			>
				<div
					className={styles['v-scrollbar-thumb']}
					style={{ height: v_totalSize, width: vScrollbarWidth, minWidth: vScrollbarWidth, maxWidth: vScrollbarWidth }}
				/>
			</div>
		);
	}

	return null;
};

export default ScrollbarV;
