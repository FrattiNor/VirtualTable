import { useMemo } from 'react';

import { type TableCoreTheme } from '../../TableTypes/type';
import { defaultBorderWidth, defaultRowHeight } from '../../TableUtils/configValues';

import type { TableCoreProps } from '../../TableTypes/typeProps';

// 暴露给内部的props
const useTableInnerProps = <T>(props: TableCoreProps<T>) => {
	const requiredProps = {
		renderEmpty: props.renderEmpty,
		bordered: props.bordered ?? true,
		rowHeight: props.rowHeight ?? defaultRowHeight,
		borderWidth: props.borderWidth ?? defaultBorderWidth,
		theme: (props.theme === 'dark' ? 'dark' : 'light') as TableCoreTheme,
		data: useMemo(() => props.data ?? [], [props.data]),
		rowKey: useMemo(() => props.rowKey, [props.rowKey?.toString()]),
		highlightKeywords: useMemo(() => props.highlightKeywords, [props.highlightKeywords?.toString()]),
		sorter: useMemo(() => props.sorter, [props.sorter?.sortKey, props.sorter?.sortValue]),

		// TableTree
		renderHeadPrefix: props.treeExpandProps?.renderHeadPrefix,
		renderCellPrefix: props.treeExpandProps?.renderCellPrefix,

		// TableDrag
		rowDraggableMode: !!props.rowDraggableProps,
		draggingRowKey: props.rowDraggableProps?.draggingRowKey,
		draggingRowIndex: props.rowDraggableProps?.draggingRowIndex,
		RowDraggableWrapper: props.rowDraggableProps?.RowDraggableWrapper,
		renderWidthDraggableWrapper: props.rowDraggableProps?.renderWidthDraggableWrapper,
	};

	return { ...requiredProps };
};

export default useTableInnerProps;
