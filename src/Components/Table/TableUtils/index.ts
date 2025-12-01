import { isValidElement, type ReactNode } from 'react';

import type { TableColumnGroup, TableColumn } from '../TableTypes/typeColumn';
import type { TableProps } from '../TableTypes/typeProps';

// 根据参数rowKey，获取【rowKey】
export const getRowKey = <T>(rowKey: TableProps<T>['rowKey'], item: T, index: number) => {
	if (typeof rowKey === 'function') return rowKey(item, index);
	return item[rowKey] as string;
};

// 根据span获取colKeys
export const getColKeys = <T>(splitColumnsArr: Array<Array<TableColumn<T> | TableColumnGroup<T>>>, colIndexStart: number, colIndexEnd: number) => {
	const colKeys: string[] = [];
	for (let i = colIndexStart; i <= colIndexEnd; i++) {
		const splitColumns = splitColumnsArr[i];
		if (splitColumns) {
			const leafColumn = getLeafColumn(splitColumns);
			colKeys.push(leafColumn.key);
		}
	}
	return colKeys;
};

// 根据span获取resize，如果是group，只要有一个子节点不能resize就不支持resize
export const getResize = <T>(splitColumnsArr: Array<Array<TableColumn<T> | TableColumnGroup<T>>>, colIndexStart: number, colIndexEnd: number) => {
	for (let i = colIndexStart; i <= colIndexEnd; i++) {
		const splitColumns = splitColumnsArr[i];
		if (splitColumns) {
			const leafColumn = getLeafColumn(splitColumns);
			if (leafColumn.resize === false) return false;
		}
	}
	return true;
};

// 根据span获取rowKeys
export const getRowKeys = <T>(rowKey: TableProps<T>['rowKey'], datasource: T[] | undefined, rowIndexStart: number, rowIndexEnd: number) => {
	const rowKeys: string[] = [];
	if (Array.isArray(datasource)) {
		for (let i = rowIndexStart; i <= rowIndexEnd; i++) {
			const dataItem = datasource[i];
			if (dataItem) {
				const key = getRowKey(rowKey, dataItem, i);
				rowKeys.push(key);
			}
		}
	}
	return rowKeys;
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
export const getLeafColumn = <T>(splitColumns: Array<TableColumnGroup<T> | TableColumn<T> | null>) => {
	return splitColumns[0] as TableColumn<T>;
};

// 获取非叶子column，通过index
export const getNotLeafColumnByIndex = <T>(splitColumns: Array<TableColumnGroup<T> | TableColumn<T> | null>, index: number) => {
	const length = splitColumns.length;
	if (length - 1 - index === 0) return null; // 只能获得非叶子节点
	return splitColumns[length - 1 - index] as TableColumnGroup<T>;
};

// 将数字精度置为2
export const FixedTwo = (v: number) => {
	return Number(v.toFixed(2));
};
