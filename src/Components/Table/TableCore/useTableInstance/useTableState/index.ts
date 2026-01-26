import { useDeferredValue, useMemo, useState } from 'react';

import { type RowKeyType, type TableCoreColumnFixed, type TableCoreResizeFlag, type TableCoreScrollbarState } from '../../TableTypes/type';
import { type TableCoreProps } from '../../TableTypes/typeProps';
import { transformWidthArrToStr } from '../../TableUtils';

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
	// 纵向滚动条
	const [_v_scrollbar, setV_scrollbar] = useState<TableCoreScrollbarState>(() => ({ have: false, width: 0 }));
	// 横向滚动条
	const [_h_scrollbar, setH_scrollbar] = useState<TableCoreScrollbarState>(() => ({ have: false, width: 0 }));
	// 左右固定的index { [key]: {  key: string; fixed: TableColumnFixed; } }
	const [_pingedMap, setPingedMap] = useState<Map<string, { key: string; fixed: TableCoreColumnFixed }>>(() => new Map());

	// 不重要的状态降低优先级
	const pingedMap = useDeferredValue(_pingedMap);

	// 滚动条宽度在bordered的情况下，额外增加border宽度
	const v_scrollbar = useMemo(() => {
		const haveBorder = _v_scrollbar.width !== 0 && bordered === true;
		const widthArr = haveBorder ? [`${_v_scrollbar.width}px`, 'var(--table-cell-border-width)'] : [`${_v_scrollbar.width}px`];
		return {
			widthArr,
			widthStr: transformWidthArrToStr(widthArr),
			..._v_scrollbar,
		};
	}, [_v_scrollbar, bordered]);

	// 滚动条宽度在bordered的情况下，额外增加border宽度
	const h_scrollbar = useMemo(() => {
		const haveBorder = _h_scrollbar.width !== 0 && bordered === true;
		const widthArr = haveBorder ? [`${_h_scrollbar.width}px`, 'var(--table-cell-border-width)'] : [`${_h_scrollbar.width}px`];
		return {
			widthArr,
			widthStr: transformWidthArrToStr(widthArr),
			..._h_scrollbar,
		};
	}, [_h_scrollbar, bordered]);

	return {
		tableWidth,
		setTableWidth,
		sizeCacheMap,
		setSizeCacheMap,
		v_scrollbar,
		setV_scrollbar,
		h_scrollbar,
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
	};
};

export default useTableState;
