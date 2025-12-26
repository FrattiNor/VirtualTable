import { memo } from 'react';

import emptyLight from './emptyLight.png';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'tableWidth' | 'theme' | 'renderEmpty'>;

const BodyEmpty = <T,>({ tableWidth, theme, renderEmpty }: Props<T>) => {
	const normalEmpty = (
		<div style={{ padding: '50px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
			<img src={emptyLight} style={{ height: 100, filter: theme === 'dark' ? 'invert(0.95) hue-rotate(180deg)' : undefined }} />
			<div>{'暂无数据'}</div>
		</div>
	);

	return <div style={{ left: 0, minWidth: '100%', width: tableWidth, position: 'sticky' }}>{renderEmpty ?? normalEmpty}</div>;
};

export default memo(BodyEmpty) as typeof BodyEmpty;
