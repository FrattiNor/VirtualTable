import { isValidElement, type ReactNode } from 'react';

import { type TableCoreScrollbarState } from '../TableTypes/type';

import type { TableCoreColumnGroup, TableCoreColumn } from '../TableTypes/typeColumn';
import type { TableCoreProps } from '../TableTypes/typeProps';

// 根据参数rowKey，获取【rowKey】
export const getRowKey = <T, K>(rowKey: TableCoreProps<T, K>['rowKey'], item: T) => {
	if (typeof rowKey === 'function') return rowKey(item);
	return item[rowKey] as K;
};

// 根据span获取resize，如果是group，只要有一个子节点不能resize就不支持resize
export const getResize = <T>(
	finalColumnsArr: Array<Array<TableCoreColumn<T> | TableCoreColumnGroup<T>>>,
	colIndexStart: number,
	colIndexEnd: number,
) => {
	for (let i = colIndexStart; i <= colIndexEnd; i++) {
		const splitColumns = finalColumnsArr[i];
		if (splitColumns) {
			const leafColumn = getLeafColumn(splitColumns);
			if (leafColumn.resize === false) return false;
		}
	}
	return true;
};

// 是否为str或number
export const isStrNum = (element: ReactNode) => {
	return typeof element === 'string' || typeof element === 'number';
};

// 获取ReactNode标题，
export const getCellTitle = (element: ReactNode) => {
	if (isStrNum(element)) {
		return element.toString();
	} else if (isValidElement(element) && isStrNum((element.props as any).children)) {
		return String((element.props as any).children);
	}
	return undefined;
};

// 获取叶子column
export const getLeafColumn = <T>(splitColumns: Array<TableCoreColumnGroup<T> | TableCoreColumn<T> | null>) => {
	return splitColumns[0] as TableCoreColumn<T>;
};

// 获取非叶子column，通过index
export const getNotLeafColumnByIndex = <T>(splitColumns: Array<TableCoreColumnGroup<T> | TableCoreColumn<T> | null>, index: number) => {
	const length = splitColumns.length;
	if (length - 1 - index === 0) return null; // 只能获得非叶子节点
	return splitColumns[length - 1 - index] as TableCoreColumnGroup<T>;
};

// 将数字精度置为2
export const FixedTwo = (v: number) => {
	return Number(v.toFixed(2));
};

// 将宽度数组转换为calc
export const transformWidthArrToStr = (widthArr: Array<string>) => {
	return `calc(${widthArr.join(' + ')})`;
};

// 获取resizeObserver的entry是否遇到了display none
export const getDisplayNone = (contentRect: ResizeObserverEntry['contentRect']) => {
	const { bottom, height, left, right, top, width, x, y } = contentRect;
	return bottom === 0 && height === 0 && left === 0 && right === 0 && top === 0 && width === 0 && x === 0 && y === 0;
};

//
export const isEmptyRender = <T>(value: T) => {
	if (value === null) return true;
	if (value === undefined) return true;
	if (typeof value === 'string' && value === '') return true;
	if (typeof value === 'number' && isNaN(value)) return true;
	return false;
};

// 扩展scrollbar的state
export const getScrollbarState = (scrollbar: TableCoreScrollbarState, bordered: boolean) => {
	const getScrollbarStateWidthArr = () => {
		if (scrollbar.have && scrollbar.width > 0 && bordered === true) {
			return [`${scrollbar.width}px`, 'var(--table-cell-border-width)'];
		}
		if (scrollbar.have && scrollbar.width > 0) {
			return [`${scrollbar.width}px`];
		}
		return [`0px`];
	};

	const widthArr = getScrollbarStateWidthArr();

	return {
		widthArr,
		widthStr: transformWidthArrToStr(widthArr),
		...scrollbar,
	};
};

export const isMac = /Macintosh|Mac OS X/i.test(navigator.userAgent);
