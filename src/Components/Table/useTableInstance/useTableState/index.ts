import { useDeferredValue, useMemo, useState } from 'react';

import { type TableColumnFixed, type ResizeFlag, type TableScrollbarState } from '../../TableTypes/type';
import { transformWidthArrToStr } from '../../TableUtils';

import type useTableRequiredProps from '../useTableRequiredProps';

type Props<T> = {
	tableRequiredProps: ReturnType<typeof useTableRequiredProps<T>>;
};

const useTableState = <T>({ tableRequiredProps }: Props<T>) => {
	const { bordered } = tableRequiredProps;

	// body宽度
	const [tableWidth, setTableWidth] = useState<number>(() => 0);
	// 列宽是否被修改过
	const [resized, setResized] = useState<boolean>(() => false);
	// 拖拽修改列宽标记
	const [resizeFlag, setResizeFlag] = useState<ResizeFlag | null>(() => null);
	// 行click { [key]: true }
	const [rowClickedMap, setRowClickedMap] = useState<Map<string, true>>(() => new Map());
	// 行hover { [key]: true }
	const [rowHoveredMap, setRowHoveredMap] = useState<Map<string, true>>(() => new Map());
	// 列宽state  { [key]: number }
	const [sizeCacheMap, setSizeCacheMap] = useState<Map<string, number>>(() => new Map());
	// 纵向滚动条
	const [_v_scrollbar, setV_scrollbar] = useState<TableScrollbarState>(() => ({ have: false, innerSize: 0, width: 0 }));
	// 横向滚动条
	const [_h_scrollbar, setH_scrollbar] = useState<TableScrollbarState>(() => ({ have: false, innerSize: 0, width: 0 }));
	// 左右固定的index { [key]: { fixed: TableColumnFixed; index: number } }
	const [_pingedMap, setPingedMap] = useState<Map<string, { fixed: TableColumnFixed; index: number }>>(() => new Map());

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
