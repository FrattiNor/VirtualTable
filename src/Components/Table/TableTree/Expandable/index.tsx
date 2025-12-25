import { type FC } from 'react';

import classNames from 'classnames';

import styles from './index.module.less';

type Props = {
	display: boolean;
	expanded: boolean;
	indentSize: number;
	onChange?: (c: boolean) => void;
};

const Expandable: FC<Props> = ({ expanded, onChange, indentSize, display }) => {
	return (
		<div
			style={{ marginLeft: indentSize }}
			className={classNames(styles['expandable'], {
				[styles['expanded']]: expanded,
				[styles['hidden']]: !display,
			})}
			onClick={(e) => {
				e.stopPropagation();
				if (typeof onChange === 'function') {
					onChange(!expanded);
				}
			}}
		/>
	);
};

export default Expandable;
