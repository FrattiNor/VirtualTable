import { useMemo } from 'react';

import { type TableCoreTheme } from '../../TableTypes/type';
import { defaultRowHeight } from '../../TableUtils/configValues';

import type { TableCoreProps } from '../../TableTypes/typeProps';

// 暴露给内部的props
const useTableInnerProps = <T>(props: TableCoreProps<T>) => {
	const requiredProps = {
		bordered: props.bordered ?? true,
		rowHeight: props.rowHeight ?? defaultRowHeight,
		theme: (props.theme === 'dark' ? 'dark' : 'light') as TableCoreTheme,
		data: useMemo(() => props.data ?? [], [props.data]),
		rowKey: useMemo(() => props.rowKey, [props.rowKey?.toString()]),
		highlightKeywords: useMemo(() => props.highlightKeywords, [props.highlightKeywords?.toString()]),
		renderEmpty: props.renderEmpty,
		renderHeadPrefix: props.treeExpandProps?.renderHeadPrefix,
		renderCellPrefix: props.treeExpandProps?.renderCellPrefix,
		rowDraggableMode: !!props.rowDraggableProps,
		RowDraggableWrapper: props.rowDraggableProps?.RowDraggableWrapper,
	};

	return { ...requiredProps };
};

export default useTableInnerProps;
