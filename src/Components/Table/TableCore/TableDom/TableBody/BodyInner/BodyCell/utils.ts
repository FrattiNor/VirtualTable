import { type ReactNode } from 'react';

import { type TableCoreColumnRender } from '../../../../TableTypes/type';
import { isEmptyRender } from '../../../../TableUtils';

export const getMergeHighlightKeywords = (keywords: string[] | undefined, keywords2: string[] | undefined) => {
	return [...(keywords ?? []), ...(keywords2 ?? [])];
};

export const getRenderDom = <T>({
	colKey,
	render,
	itemData,
	index,
	highlightKeywords,
}: {
	colKey: string;
	render: TableCoreColumnRender<T> | undefined;
	itemData: T;
	index: number;
	highlightKeywords: string[] | undefined;
}) => {
	// 获取cell的渲染dom
	const _renderDom = typeof render === 'function' ? render(itemData, { index, highlightKeywords }) : (itemData[colKey as keyof T] as ReactNode);
	// 如果最终渲染结果为空，返回 -
	const renderDom = !isEmptyRender(_renderDom) ? _renderDom : '-';

	return renderDom;
};
