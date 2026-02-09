import { type CSSProperties, type ReactNode } from 'react';

import type {
	TableCoreColumnAlign,
	TableCoreColumnFixed,
	TableCoreColumnOnCellSpan,
	TableCoreColumnOnCellStyle,
	TableCoreColumnOnCellTitle,
	TableCoreColumnRender,
	TableCoreColumnSummaryRender,
	TableCoreColumnWidth,
} from './type';
import type { Partial2Undefined } from './typeUtil';

// 对内的完整类型
// onCell 的 colSpan 和 fixed 存在冲突
type _TableCoreColumn<T, S = any> = {
	// 列key
	key: string;
	// 列标题
	title: ReactNode;
	// 列标题【string】用于给列配置提供string版本的title
	titleStr?: string;
	// 列单元格渲染
	render?: TableCoreColumnRender<T>;
	// 总结栏列单元格渲染
	summaryRender?: TableCoreColumnSummaryRender<S>;
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
	// 强制渲染列【fixed会默认forceRender】【用于处理不定高】
	colSummaryForceRender?: boolean;
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
	// 启用列排序
	sorter?: boolean;
} & {
	children?: undefined;
};

// 对外的类型【有render时，key为任意string，无render时，key必须为keyof T】
export type TableCoreColumn<T, S = any> =
	| (Omit<_TableCoreColumn<T, S>, 'key' | 'render'> & {
			key: string;
			render: TableCoreColumnRender<T>;
	  })
	| (Omit<_TableCoreColumn<T, S>, 'key' | 'render'> & {
			key: keyof T & string;
			render?: undefined;
	  });

// Group的fixed将会覆盖子节点，不论left|right|undefined
export type TableCoreColumnGroup<T, S = any> = Partial2Undefined<
	Omit<TableCoreColumn<T, S>, 'key' | 'title' | 'titleStr' | 'children' | 'filter' | 'fixed'>
> & {
	// 列key
	key: string;
	// 列标题
	title: ReactNode;
	// 列标题【string】用于给列配置提供string版本的title
	titleStr?: string;
	// 列搜索【外部提供搜索】
	filter?: ReactNode;
	// TODO 列固定【覆盖子类】
	fixed?: TableCoreColumnFixed;
	// 列子项
	children: TableCoreColumns<T, S>;
};

export type TableCoreColumns<T, S = any> = Array<TableCoreColumn<T, S> | TableCoreColumnGroup<T, S>>;
