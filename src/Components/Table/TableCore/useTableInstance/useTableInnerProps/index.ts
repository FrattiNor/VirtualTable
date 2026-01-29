import { useMemo } from 'react';

import { type RowKeyType, type TableCoreTheme } from '../../TableTypes/type';
import { defaultBorderWidth, defaultRowHeight } from '../../TableUtils/configValues';

import type { TableCoreProps } from '../../TableTypes/typeProps';

// 暴露给内部的props
const useTableInnerProps = <T, K = RowKeyType, S = any>(coreProps: TableCoreProps<T, K, S>) => {
	const summaryData = coreProps.summaryData;
	const showSummary = Array.isArray(summaryData) && summaryData.length > 0;

	const requiredProps = {
		summaryData,
		showSummary,
		renderEmpty: coreProps.renderEmpty,
		bordered: coreProps.bordered ?? true,
		rowHeight: coreProps.rowHeight ?? defaultRowHeight,
		borderWidth: coreProps.borderWidth ?? defaultBorderWidth,
		theme: (coreProps.theme === 'dark' ? 'dark' : 'light') as TableCoreTheme,
		data: useMemo(() => coreProps.data ?? [], [coreProps.data]),
		// 修复问题，data数据变更但之更换了顺序，在显示范围内未变更的元素会导致父元素发生滚动，导致显示错位
		// 根本问题为：data数据变更但之更换了顺序，在显示范围内未变更的元素的rowKey并未发生改变
		// react渲染的优化机制渲染，跳过当前元素（或只对其属性进行修改），并移除或插入其他元素
		// 浏览器渲染的优化机制，自动触发了body的滚动，对未发生改变的元素保持视口位置不变
		dataId: useMemo(() => new Date().valueOf(), [coreProps.data]),
		rowKey: useMemo(() => coreProps.rowKey, [coreProps.rowKey?.toString()]),
		highlightKeywords: useMemo(() => coreProps.highlightKeywords, [coreProps.highlightKeywords?.toString()]),
		sorter: useMemo(() => coreProps.sorter, [coreProps.sorter?.sortKey, coreProps.sorter?.sortValue]),

		// TableTree
		renderHeadPrefix: coreProps.treeExpandProps?.renderHeadPrefix,
		renderCellPrefix: coreProps.treeExpandProps?.renderCellPrefix,

		// TableDrag
		rowDraggableMode: !!coreProps.rowDraggableProps,
		draggingRowKey: coreProps.rowDraggableProps?.draggingRowKey,
		draggingRowIndex: coreProps.rowDraggableProps?.draggingRowIndex,
		RowDraggableWrapper: coreProps.rowDraggableProps?.RowDraggableWrapper,
		renderWidthDraggableWrapper: coreProps.rowDraggableProps?.renderWidthDraggableWrapper,
	};

	return { ...requiredProps };
};

export default useTableInnerProps;
