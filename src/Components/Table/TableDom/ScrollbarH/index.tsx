import { memo, useEffect } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import useAnimationThrottle from '../../TableHooks/useAnimationThrottle';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';
import { type TableInstance } from '../../useTableInstance';

type Props<T> = Required<
	Pick<TableInstance<T>, 'h_scrollbar' | 'v_scrollbar' | 'bordered' | 'hScrollbarRef' | 'bodyRef' | 'headRef' | 'getH_virtualCore'>
>;

const ScrollbarH = <T,>(props: Props<T>) => {
	const { throttle } = useAnimationThrottle();
	const { h_scrollbar, v_scrollbar, bordered, hScrollbarRef, getH_virtualCore } = props;

	useEffect(() => {
		if (h_scrollbar.have && hScrollbarRef.current) {
			const hScrollbar = hScrollbarRef.current;

			const handleScroll = () => {
				throttle(() => {
					getH_virtualCore().updateScrollOffset(hScrollbar.scrollLeft);
				});
			};

			hScrollbar.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				getH_virtualCore().updateScrollOffset(0);
				hScrollbar.removeEventListener('scroll', handleScroll);
			};
		}
	}, [h_scrollbar.have]);

	if (h_scrollbar.have && h_scrollbar.width > 0) {
		const vScrollbarWidth = v_scrollbar.widthStr;
		const hScrollbarWidth = h_scrollbar.widthStr;
		return (
			<div className={styles['h-scrollbar-wrapper']}>
				<div
					ref={hScrollbarRef}
					style={{ height: hScrollbarWidth, minHeight: hScrollbarWidth, maxHeight: hScrollbarWidth }}
					className={classNames(styles['h-scrollbar'], scrollbarStyles['scrollbar'], {
						[styles['bordered']]: bordered,
						[scrollbarStyles['bordered']]: bordered,
					})}
				>
					<div
						className={styles['h-scrollbar-inner']}
						style={{
							height: hScrollbarWidth,
							minHeight: hScrollbarWidth,
							maxHeight: hScrollbarWidth,
							width: h_scrollbar.innerSize,
						}}
					/>
				</div>

				{v_scrollbar.have && (
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

	if (h_scrollbar.have && h_scrollbar.width === 0) {
		return (
			<div ref={hScrollbarRef} className={styles['h-scrollbar-absolute']}>
				<div className={styles['h-scrollbar-absolute-inner']} style={{ width: h_scrollbar.innerSize }} />
			</div>
		);
	}

	return null;
};

export default memo(ScrollbarH) as typeof ScrollbarH;
