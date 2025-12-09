import { memo } from 'react';

import emptyLight from './emptyLight.png';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'tableWidth'>;

// TODO BUG 默认empty时宽度获取为0
const BodyEmpty = <T,>({ tableWidth }: Props<T>) => {
	return (
		<div
			style={{
				left: 0,
				padding: '50px 0',
				position: 'sticky',
				width: tableWidth,
				minWidth: '100%',
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
