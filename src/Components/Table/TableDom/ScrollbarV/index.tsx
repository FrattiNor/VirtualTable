import { memo, useEffect } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import useThrottle from '../../TableHooks/useThrottle';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';
import { type TableInstance } from '../../useTableInstance';

type Props<T> = Required<Pick<TableInstance<T>, 'v_scrollbar' | 'bordered' | 'vScrollbarRef' | 'bodyRef' | 'getV_virtualCore'>>;

const ScrollbarV = <T,>(props: Props<T>) => {
	const { throttle } = useThrottle({ multiple: 1 });
	const { v_scrollbar, bordered, vScrollbarRef, getV_virtualCore } = props;

	useEffect(() => {
		if (v_scrollbar.have && vScrollbarRef.current) {
			const vScrollbar = vScrollbarRef.current;

			const handleScroll = () => {
				throttle(() => {
					getV_virtualCore().updateScrollOffset(vScrollbar.scrollTop, { isScroll: true });
				});
			};

			vScrollbar.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				getV_virtualCore().updateScrollOffset(0, { isScroll: true });
				vScrollbar.removeEventListener('scroll', handleScroll);
			};
		}
	}, [v_scrollbar.have]);

	if (v_scrollbar.have && v_scrollbar.width > 0) {
		return (
			<div
				ref={vScrollbarRef}
				style={{ width: v_scrollbar.width, minWidth: v_scrollbar.width, maxWidth: v_scrollbar.width }}
				className={classNames(styles['v-scrollbar'], scrollbarStyles['scrollbar'], { [scrollbarStyles['bordered']]: bordered })}
			>
				<div
					className={styles['v-scrollbar-inner']}
					style={{ height: v_scrollbar.innerSize, width: v_scrollbar.width, minWidth: v_scrollbar.width, maxWidth: v_scrollbar.width }}
				/>
			</div>
		);
	}

	if (v_scrollbar.have && v_scrollbar.width === 0) {
		return (
			<div ref={vScrollbarRef} className={styles['v-scrollbar-absolute']}>
				<div className={styles['v-scrollbar-absolute-inner']} style={{ height: v_scrollbar.innerSize }} />
			</div>
		);
	}

	return null;
};

export default memo(ScrollbarV) as typeof ScrollbarV;
