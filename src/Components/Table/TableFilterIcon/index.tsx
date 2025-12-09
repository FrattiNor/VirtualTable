import { type FC, type PropsWithChildren } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';

type Props = PropsWithChildren<{
	visible: boolean;
	filtered: boolean;
}>;

const TableFilterIcon: FC<Props> = ({ children, visible, filtered }) => {
	return <div className={classNames(styles['filter-icon'], { [styles['visible']]: visible, [styles['filtered']]: filtered })}>{children}</div>;
};

export default TableFilterIcon;
