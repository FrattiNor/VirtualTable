import { memo, useEffect } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import useAnimationThrottle from '../../TableHooks/useAnimationThrottle';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';
import { type TableInstance } from '../../useTableInstance';

type Props<T> = Required<Pick<TableInstance<T>, 'v_scrollbar' | 'bordered' | 'vScrollbarRef' | 'bodyRef' | 'getV_virtualCore'>>;

const ScrollbarV = <T,>(props: Props<T>) => {
	const { throttle } = useAnimationThrottle();
	const { v_scrollbar, bordered, vScrollbarRef, getV_virtualCore } = props;

	useEffect(() => {
		if (v_scrollbar.have && vScrollbarRef.current) {
			const vScrollbar = vScrollbarRef.current;

			const handleScroll = () => {
				throttle(() => {
					getV_virtualCore().updateScrollOffset(vScrollbar.scrollTop);
				});
			};

			vScrollbar.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				getV_virtualCore().updateScrollOffset(0);
				vScrollbar.removeEventListener('scroll', handleScroll);
			};
		}
	}, [v_scrollbar.have]);

	if (v_scrollbar.have && v_scrollbar.width > 0) {
		const vScrollbarWidth = v_scrollbar.widthStr;
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
					style={{ height: v_scrollbar.innerSize, width: vScrollbarWidth, minWidth: vScrollbarWidth, maxWidth: vScrollbarWidth }}
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
