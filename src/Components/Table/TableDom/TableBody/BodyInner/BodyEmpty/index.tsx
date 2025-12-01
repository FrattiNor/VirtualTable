import { memo } from 'react';

import emptyLight from './emptyLight.png';

import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Required<Pick<TableInstance<T>, 'tableWidth'>>;

const BodyEmpty = <T,>({ tableWidth }: Props<T>) => {
	return (
		<div
			style={{
				left: 0,
				padding: '50px 0',
				position: 'sticky',
				width: tableWidth,
				maxWidth: tableWidth,
				minWidth: tableWidth,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
			}}
		>
			<img src={emptyLight} style={{ height: 100 }} />
			<div>{'暂无数据'}</div>
		</div>
	);
};

export default memo(BodyEmpty);
