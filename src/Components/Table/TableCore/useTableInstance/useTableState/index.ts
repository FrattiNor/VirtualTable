import { useDeferredValue, useMemo, useState } from 'react';

import { type RowKeyType, type TableCoreColumnFixed, type TableCoreResizeFlag, type TableCoreScrollbarState } from '../../TableTypes/type';
import { type TableCoreProps } from '../../TableTypes/typeProps';
import { getScrollbarState } from '../../TableUtils';

import type useTableInnerProps from '../useTableInnerProps';

type Props<T, K, S> = {
	coreProps: TableCoreProps<T, K, S>;
	tableInnerProps: ReturnType<typeof useTableInnerProps<T, K, S>>;
};

const useTableState = <T, K = RowKeyType, S = any>({ tableInnerProps, coreProps }: Props<T, K, S>) => {
	const { bordered } = tableInnerProps;

	// body宽度
	const [tableWidth, setTableWidth] = useState<number>(() => 0);
	// 列宽是否被修改过
	const [resized, setResized] = useState<boolean>(() => false);
	// 拖拽修改列宽标记
	const [resizeFlag, setResizeFlag] = useState<TableCoreResizeFlag | null>(() => null);
	// 行click { [key]: true }
	const [_rowClickedMap, _setRowClickedMap] = useState<Map<K, true>>(() => new Map());
	const rowClickedMap = coreProps?.rowClick?.rowClickedMap ?? _rowClickedMap;
	const setRowClickedMap = coreProps?.rowClick?.setRowClickedMap ?? _setRowClickedMap;
	// 行hover { [key]: true }
	const [rowHoveredMap, setRowHoveredMap] = useState<Map<K, true>>(() => new Map());
	// 列宽state  { [key]: number }
	const [sizeCacheMap, setSizeCacheMap] = useState<Map<string, number>>(() => new Map());
	// 纵向滚动条【当宽度为0时，判断have为false】
	const [v_scrollbar, setV_scrollbar] = useState<TableCoreScrollbarState>(() => ({ have: false, width: -1 }));
	// 横向滚动条【当宽度为0时，判断have为false】
	const [h_scrollbar, setH_scrollbar] = useState<TableCoreScrollbarState>(() => ({ have: false, width: -1 }));
	// 左右固定的index { [key]: {  key: string; fixed: TableColumnFixed; } }
	const [_pingedMap, setPingedMap] = useState<Map<string, { key: string; fixed: TableCoreColumnFixed }>>(() => new Map());

	// 不重要的状态降低优先级
	const pingedMap = useDeferredValue(_pingedMap);

	// 滚动条宽度在bordered的情况下，额外增加border宽度
	const vScrollbarState = useMemo(() => getScrollbarState(v_scrollbar, bordered), [v_scrollbar, bordered]);

	// 滚动条宽度在bordered的情况下，额外增加border宽度
	const hScrollbarState = useMemo(() => getScrollbarState(h_scrollbar, bordered), [h_scrollbar, bordered]);

	// 当scrollbar都为0时【如firefox浏览器】，此时不需要渲染额外滚动条，可以直接使用bodyWrapper的滚动条
	const hiddenBodyWrapperScrollbar = useMemo(() => !(v_scrollbar.width === 0 && h_scrollbar.width === 0), [v_scrollbar, h_scrollbar]);

	return {
		tableWidth,
		setTableWidth,
		sizeCacheMap,
		setSizeCacheMap,
		vScrollbarState,
		setV_scrollbar,
		hScrollbarState,
		setH_scrollbar,
		pingedMap,
		setPingedMap,
		resized,
		setResized,
		resizeFlag,
		setResizeFlag,
		rowClickedMap,
		setRowClickedMap,
		rowHoveredMap,
		setRowHoveredMap,
		hiddenBodyWrapperScrollbar,
	};
};

export default useTableState;
