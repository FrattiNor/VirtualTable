import { memo } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import { isMac } from '../../TableUtils';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';
import { type TableInstance } from '../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'hScrollbarState' | 'vScrollbarState' | 'bordered' | 'hScrollbarRef' | 'h_totalSize'>;

const ScrollbarH = <T,>(props: Props<T>) => {
	const { hScrollbarState, vScrollbarState, bordered, hScrollbarRef, h_totalSize } = props;

	if (hScrollbarState.have && hScrollbarState.width > 0) {
		const vScrollbarWidth = vScrollbarState.widthStr;
		const hScrollbarWidth = hScrollbarState.widthStr;
		return (
			<div className={styles['h-scrollbar-wrapper']}>
				<div
					ref={hScrollbarRef}
					style={{ height: hScrollbarWidth, minHeight: hScrollbarWidth, maxHeight: hScrollbarWidth }}
					className={classNames(styles['h-scrollbar'], {
						[styles['bordered']]: bordered,
						[scrollbarStyles['scrollbar']]: !isMac,
						[scrollbarStyles['bordered']]: !isMac && bordered,
					})}
				>
					<div
						className={styles['h-scrollbar-thumb']}
						style={{
							width: h_totalSize,
							height: hScrollbarWidth,
							minHeight: hScrollbarWidth,
							maxHeight: hScrollbarWidth,
						}}
					/>
				</div>

				{vScrollbarState.have && (
					<div
						className={classNames(styles['v-scrollbar-placeholder'], { [styles['bordered']]: bordered })}
						style={{
							width: vScrollbarWidth,
							height: hScrollbarWidth,
							minWidth: vScrollbarWidth,
							maxWidth: vScrollbarWidth,
							minHeight: hScrollbarWidth,
							maxHeight: hScrollbarWidth,
						}}
					/>
				)}
			</div>
		);
	}

	return null;
};

export default memo(ScrollbarH) as typeof ScrollbarH;
