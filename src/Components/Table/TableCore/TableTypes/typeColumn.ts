import { type CSSProperties, type ReactNode } from 'react';

import type {
	TableCoreColumnAlign,
	TableCoreColumnFixed,
	TableCoreColumnOnCellSpan,
	TableCoreColumnOnCellStyle,
	TableCoreColumnOnCellTitle,
	TableCoreColumnRender,
	TableCoreColumnWidth,
} from './type';
import type { Partial2Undefined } from './typeUtil';

// onCell 的 colSpan 和 fixed 存在冲突
export type TableCoreColumn<T> = {
	// 列key
	key: string;
	// 列标题
	title: ReactNode;
	// 列单元格渲染
	render?: TableCoreColumnRender<T>;
	// 列宽
	width?: TableCoreColumnWidth;
	// 未resize的情况下，自动填充【默认1】
	flexGrow?: number;
	// 左右对齐
	align?: TableCoreColumnAlign;
	// 左右固定【和colSpan有冲突】
	fixed?: TableCoreColumnFixed;
	// 是否可以拖拽修改列宽
	resize?: boolean;
	// 强制渲染列【fixed会默认forceRender】【用于处理不定高】
	colBodyForceRender?: boolean;
	// 强制渲染列【fixed会默认forceRender】【用于处理不定高】
	colHeadForceRender?: boolean;
	// 列搜索【外部提供搜索】
	filter?: ReactNode;
	// 高亮关键字
	highlightKeywords?: string[];
	// 配置cell span
	onCellSpan?: TableCoreColumnOnCellSpan<T>;
	// 配置cell title
	onCellTitle?: TableCoreColumnOnCellTitle<T>;
	// 配置cell style
	onCellStyle?: TableCoreColumnOnCellStyle<T>;
	// 配置head style
	headStyle?: CSSProperties;
} & {
	children?: undefined;
};

// Group的fixed将会覆盖子节点，不论left|right|undefined
export type TableCoreColumnGroup<T> = Partial2Undefined<Omit<TableCoreColumn<T>, 'key' | 'title' | 'align' | 'children' | 'filter'>> & {
	// 列key
	key: string;
	// 列标题
	title: ReactNode;
	// 左右对齐
	align?: TableCoreColumnAlign;
	// 列搜索【外部提供搜索】
	filter?: ReactNode;
	//
	children: Array<TableCoreColumn<T> | TableCoreColumnGroup<T>>;
};

export type TableCoreColumns<T> = Array<TableCoreColumn<T> | TableCoreColumnGroup<T>>;
