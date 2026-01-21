import { memo } from 'react';

import emptyLight from './emptyLight.png';

import type { TableInstance } from '../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'tableWidth' | 'theme' | 'renderEmpty'>;

const BodyEmpty = <T,>({ theme, tableWidth, renderEmpty }: Props<T>) => {
	const lightEmpty = (
		<div style={{ padding: '50px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
			<img src={emptyLight} style={{ height: 100 }} />
			<div style={{ lineHeight: 1 }}>{'暂无数据'}</div>
		</div>
	);

	const darkEmpty = (
		<div style={{ padding: '50px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
			<div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<svg width="96" height="61.5" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
					<g transform="translate(0 1)" fill="none" fillRule="evenodd">
						<ellipse fill="rgba(255, 255, 255, 0.1)" cx="32" cy="33" rx="32" ry="7"></ellipse>
						<g fillRule="nonzero" stroke="#6f6f6f">
							<path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
							<path
								d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
								fill="#6f6f6f"
							></path>
						</g>
					</g>
				</svg>
			</div>
			<div style={{ lineHeight: 1 }}>{'暂无数据'}</div>
		</div>
	);

	const empty = theme === 'light' ? lightEmpty : darkEmpty;

	return <div style={{ left: 0, minWidth: '100%', width: tableWidth, position: 'sticky' }}>{renderEmpty ?? empty}</div>;
};

export default memo(BodyEmpty) as typeof BodyEmpty;
