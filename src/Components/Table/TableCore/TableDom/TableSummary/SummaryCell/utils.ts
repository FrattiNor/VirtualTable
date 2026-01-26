import { type TableCoreColumnSummaryRender } from '../../../TableTypes/type';
import { isEmptyRender } from '../../../TableUtils';

export const getSummaryRenderDom = <T>({
	summaryRender,
	itemData,
	index,
}: {
	summaryRender: TableCoreColumnSummaryRender<T> | undefined;
	itemData: T;
	index: number;
}) => {
	// 获取cell的渲染dom
	const _renderDom = typeof summaryRender === 'function' ? summaryRender(itemData, { index }) : '-';
	// 如果最终渲染结果为空，返回 -
	const renderDom = !isEmptyRender(_renderDom) ? _renderDom : '-';

	return renderDom;
};
