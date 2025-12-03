import { memo, useEffect } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';
import { type TableInstance } from '../../useTableInstance';

type Props<T> = Required<Pick<TableInstance<T>, 'v_scrollbar' | 'bordered' | 'vScrollbarRef' | 'bodyRef' | 'getV_virtualCore'>>;

const ScrollbarV = <T,>(props: Props<T>) => {
	// const isLockedRef = useRef(false);
	const { v_scrollbar, bordered, vScrollbarRef, bodyRef, getV_virtualCore } = props;

	useEffect(() => {
		if (v_scrollbar.have && vScrollbarRef.current) {
			const vScrollbar = vScrollbarRef.current;

			(() => {
				if (bodyRef.current && bodyRef.current.scrollTop !== vScrollbar.scrollTop) {
					vScrollbar.scrollTop = bodyRef.current.scrollTop;
				}
			})();

			const handleScroll = () => {
				// if (isLockedRef.current) {
				// 	isLockedRef.current = false;
				// 	return;
				// }
				// isLockedRef.current = true;

				getV_virtualCore().updateScrollOffset(vScrollbar.scrollTop, { isScroll: true });
				requestAnimationFrame(() => {
					if (bodyRef.current && bodyRef.current.scrollTop !== vScrollbar.scrollTop) {
						bodyRef.current.scrollTop = vScrollbar.scrollTop;
					}
				});
			};
			vScrollbar.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				vScrollbar.removeEventListener('scroll', handleScroll);
				getV_virtualCore().updateScrollOffset(0, { isScroll: true });
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
