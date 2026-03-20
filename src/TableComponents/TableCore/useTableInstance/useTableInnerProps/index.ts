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
