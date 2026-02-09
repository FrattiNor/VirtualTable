import { type FC, type PropsWithChildren } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';

type Props = PropsWithChildren<{
	visible: boolean;
	filtered: boolean;
	onClick?: () => void; // 给dropDown注入参数使用
}>;

const TableFilterIcon: FC<Props> = ({ children, visible, filtered, onClick }) => {
	return (
		<div onClick={onClick} className={classNames(styles['filter-icon'], { [styles['visible']]: visible, [styles['filtered']]: filtered })}>
			{children}
		</div>
	);
};

export default TableFilterIcon;
