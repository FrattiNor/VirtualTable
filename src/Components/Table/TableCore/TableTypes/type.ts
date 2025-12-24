import type { CSSProperties, ReactNode } from 'react';

// Table 列render配置
export type TableCoreColumnRender<T> = (item: T, otherData: { index: number; highlightKeywords?: string[] }) => ReactNode;

// Table 列宽度
export type TableCoreColumnWidth = number | `${number}%`;

// Table 配置cell的span属性
export type TableCoreColumnOnCellSpan<T> = (
	item: T,
	index: number,
) => {
	// 行占据几格，用于合并单元格
	rowSpan?: number;
	// 列占据几格，用于合并单元格
	colSpan?: number;
};

// Table 配置cell的title属性
export type TableCoreColumnOnCellTitle<T> = (item: T, index: number) => string;

// Table 配置cell的style属性
export type TableCoreColumnOnCellStyle<T> = (item: T, index: number) => CSSProperties;

// Table 滚动条State
export type TableCoreScrollbarState = { have: boolean; width: number };

// Table Resize标记
export type TableCoreResizeFlag = {
	pageX: number;
	activeKey: string;
	children: Map<string, { key: string; clientWidth: number }>;
};

// 列固定
export type TableCoreColumnFixed = 'left' | 'right' | 'default';

// 列居中
export type TableCoreColumnAlign = 'left' | 'right' | 'center';

// 主题
export type TableCoreTheme = 'light' | 'dark';

// 列覆盖配置
export type TableCoreColumnConf = {
	sortConf?: Record<string, number>; // 排序
	visibleConf?: Record<string, boolean>; // 可见
	widthConf?: Record<string, TableCoreColumnWidth>; // 宽度
	fixedConf?: Record<string, TableCoreColumnFixed>; // fixed
	flexGrowConf?: Record<string, number>; // 自增长
};

// 暴露给外部的api
export type TableCoreRef = {
	// 清除resize标记
	clearResized: () => void;
	// 滚动方法
	scrollTo: (options: { left?: number; top?: number; behavior?: 'auto' | 'instant' | 'smooth' }) => void;
	// 兼容旧版table
	getSortedColumnsConf: () => TableColumnConfItem[];
	// 兼容旧版table
	getOriginColumnsConf: () => TableColumnConfItem[];
};

export type TableColumnConfItem = {
	key: string;
	hidden: boolean;
	title: ReactNode;
	fixed: TableCoreColumnFixed;
};
