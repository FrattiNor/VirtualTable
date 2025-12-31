import { useMemo } from 'react';

import { type TableCoreTheme } from '../../TableTypes/type';
import { defaultRowHeight } from '../../TableUtils/configValues';

import type { TableCoreProps } from '../../TableTypes/typeProps';

// 暴露给内部的props
const useTableInnerProps = <T>(props: TableCoreProps<T>) => {
	const requiredProps = {
		renderEmpty: props.renderEmpty,
		bordered: props.bordered ?? true,
		rowHeight: props.rowHeight ?? defaultRowHeight,
		theme: (props.theme === 'dark' ? 'dark' : 'light') as TableCoreTheme,
		data: useMemo(() => props.data ?? [], [props.data]),
		rowKey: useMemo(() => props.rowKey, [props.rowKey?.toString()]),
		highlightKeywords: useMemo(() => props.highlightKeywords, [props.highlightKeywords?.toString()]),

		// TableTree
		renderHeadPrefix: props.treeExpandProps?.renderHeadPrefix,
		renderCellPrefix: props.treeExpandProps?.renderCellPrefix,

		// TableDrag
		rowDraggableMode: !!props.rowDraggableProps,
		RowDraggableWrapper: props.rowDraggableProps?.RowDraggableWrapper,

		// 只有最外层使用
		loading: props.loading,
		className: props.className,
		pagination: props.pagination,
		style: useMemo(() => props.style, [JSON.stringify(props.style)]),
	};

	return { ...requiredProps };
};

export default useTableInnerProps;
