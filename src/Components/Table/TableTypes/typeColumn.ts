import { type ReactNode } from 'react';

import type { Table2ColumnAlign, Table2ColumnFixed, Table2ColumnOnCellSpan, Table2ColumnRender, Table2ColumnWidth } from './type';
import type { Partial2Undefined } from './typeUtil';

// onCell 的 colSpan 和 fixed 存在冲突
export type Table2Column<T> = {
	// 列key
	key: string;
	// 列标题
	title: ReactNode;
	// 列单元格渲染
	render?: Table2ColumnRender<T>;
	// 列宽
	width?: Table2ColumnWidth;
	// 未resize的情况下，自动填充【默认1】
	flexGrow?: number;
	// 配置span
	onCellSpan?: Table2ColumnOnCellSpan<T>;
	// 左右对齐
	align?: Table2ColumnAlign;
	// 左右固定【和colSpan有冲突】
	fixed?: Table2ColumnFixed;
	// 是否可以拖拽修改列宽
	resize?: boolean;
	// 强制渲染列【fixed会默认forceRender】【用于处理不定高】
	colBodyForceRender?: boolean;
	// 强制渲染列【fixed会默认forceRender】【用于处理不定高】
	colHeadForceRender?: boolean;
	// 列搜索【外部提供搜索】
	filter?: ReactNode;
	// TODO 高亮关键字
	highlightKeyword?: string;
} & {
	// 兼容group
	children?: undefined;
};

// Group的fixed将会覆盖子节点，不论left|right|undefined
export type Table2ColumnGroup<T> = Partial2Undefined<Omit<Table2Column<T>, 'key' | 'title' | 'children' | 'align'>> & {
	// 列key
	key: string;
	// 列标题
	title: ReactNode;
	// 左右对齐
	align?: Table2ColumnAlign;
	// group下的列配置
	children: Array<Table2ColumnGroup<T> | Table2Column<T>>;
};

export type Table2Columns<T> = Array<Table2ColumnGroup<T> | Table2Column<T>>;
