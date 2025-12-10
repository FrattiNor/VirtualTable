import type { ReactNode } from 'react';

import type { Table2Props } from './typeProps';

// Table组件类型
export type Table2Component = <T extends Record<string, unknown>>(props: Table2Props<T>) => ReactNode;

// Table 列render配置
export type Table2ColumnRender<T> = (item: T, otherData: { index: number }) => ReactNode;

// Table 列宽度
export type Table2ColumnWidth = number | `${number}%`;

// Table 配置cell的span属性
export type Table2ColumnOnCellSpan<T> = (
	item: T,
	index: number,
) => {
	// 行占据几格，用于合并单元格
	rowSpan?: number;
	// 列占据几格，用于合并单元格
	colSpan?: number;
};

//
export type Table2ScrollbarState = { have: boolean; innerSize: number; width: number };

// Table Resize标记
export type Table2ResizeFlag = {
	pageX: number;
	activeKey: string;
	children: Map<string, { key: string; clientWidth: number }>;
};

//
export type Table2ColumnFixed = 'left' | 'right';

//
export type Table2ColumnAlign = 'left' | 'right' | 'center';
