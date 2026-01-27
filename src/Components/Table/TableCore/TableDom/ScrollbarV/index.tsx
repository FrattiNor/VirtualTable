import { memo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';
import { type TableInstance } from '../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'vScrollbarState' | 'bordered' | 'vScrollbarRef' | 'v_totalSize'>;

const ScrollbarV = <T,>(props: Props<T>) => {
	const { vScrollbarState, bordered, vScrollbarRef, v_totalSize } = props;

	if (vScrollbarState.have && vScrollbarState.width > 0) {
		const vScrollbarWidth = vScrollbarState.widthStr;
		return (
			<div
				ref={vScrollbarRef}
				style={{ width: vScrollbarWidth, minWidth: vScrollbarWidth, maxWidth: vScrollbarWidth }}
				className={classNames(styles['v-scrollbar'], scrollbarStyles['scrollbar'], {
					[styles['bordered']]: bordered,
					[scrollbarStyles['bordered']]: bordered,
				})}
			>
				<div
					className={styles['v-scrollbar-inner']}
					style={{ height: v_totalSize, width: vScrollbarWidth, minWidth: vScrollbarWidth, maxWidth: vScrollbarWidth }}
				/>
			</div>
		);
	}

	return null;
};

export default memo(ScrollbarV) as typeof ScrollbarV;
