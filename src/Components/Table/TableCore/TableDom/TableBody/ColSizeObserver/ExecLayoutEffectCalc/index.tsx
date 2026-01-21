import { useLayoutEffect } from 'react';

import type { TableInstance } from '../../../../useTableInstance';

type Props<T> = Pick<TableInstance<T>, 'resized' | 'colSizeObserverRef'> & {
	sizeCacheChangeBatch: <B>(items: Array<B>, getKey: (item: B) => string | null, getSize: (item: B) => number) => void;
};

// 单独提取组件目的为通过key强制触发useLayoutEffect执行计算colSize
// 如果在外层使用key触发强制渲染会导致colSizeObserverRef无法获取到dom
const ExecLayoutEffectCalc = <T,>(props: Props<T>) => {
	const { sizeCacheChangeBatch, resized, colSizeObserverRef } = props;

	// first calc
	useLayoutEffect(() => {
		if (colSizeObserverRef.current && resized === false) {
			const element = colSizeObserverRef.current;
			// 直接执行一次
			sizeCacheChangeBatch(
				Array.from(element.children),
				(node) => node.getAttribute('data-key'),
				(node) => node.getBoundingClientRect().width,
			);
		}
	}, [resized]);

	return null;
};

export default ExecLayoutEffectCalc;
