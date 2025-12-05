import { memo, useEffect } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';
import useThrottle from '../../TableHooks/useThrottle';
import scrollbarStyles from '../../TableUtils/calcBorderWidth/index.module.less';
import { type TableInstance } from '../../useTableInstance';

type Props<T> = Required<
	Pick<TableInstance<T>, 'h_scrollbar' | 'v_scrollbar' | 'bordered' | 'hScrollbarRef' | 'bodyRef' | 'headRef' | 'getH_virtualCore'>
>;

const ScrollbarH = <T,>(props: Props<T>) => {
	const { throttle } = useThrottle({ multiple: 1 });
	const { h_scrollbar, v_scrollbar, bordered, hScrollbarRef, getH_virtualCore } = props;

	useEffect(() => {
		if (h_scrollbar.have && hScrollbarRef.current) {
			const hScrollbar = hScrollbarRef.current;

			const handleScroll = () => {
				throttle(() => {
					getH_virtualCore().updateScrollOffset(hScrollbar.scrollLeft, { isScroll: true });
				});
			};

			hScrollbar.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				getH_virtualCore().updateScrollOffset(0, { isScroll: true });
				hScrollbar.removeEventListener('scroll', handleScroll);
			};
		}
	}, [h_scrollbar.have]);

	if (h_scrollbar.have && h_scrollbar.width > 0) {
		return (
			<div className={styles['h-scrollbar-wrapper']}>
				<div
					ref={hScrollbarRef}
					style={{ height: h_scrollbar.width, minHeight: h_scrollbar.width, maxHeight: h_scrollbar.width }}
					className={classNames(styles['h-scrollbar'], scrollbarStyles['scrollbar'], { [scrollbarStyles['bordered']]: bordered })}
				>
					<div
						className={styles['h-scrollbar-inner']}
						style={{
							height: h_scrollbar.width,
							minHeight: h_scrollbar.width,
							maxHeight: h_scrollbar.width,
							width: h_scrollbar.innerSize,
						}}
					/>
				</div>

				{v_scrollbar.have && (
					<div
						className={classNames(styles['v-scrollbar-placeholder'], { [styles['bordered']]: bordered })}
						style={{
							width: v_scrollbar.width,
							height: h_scrollbar.width,
							minWidth: v_scrollbar.width,
							maxWidth: v_scrollbar.width,
							minHeight: h_scrollbar.width,
							maxHeight: h_scrollbar.width,
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
