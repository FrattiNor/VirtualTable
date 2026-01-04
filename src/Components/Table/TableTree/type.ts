import { type TableCoreProps } from '../TableCore/TableTypes/typeProps';

// Tree参数
export type TableTreeExpand<T> = {
	enabled?: boolean;
	// children的key
	children: keyof T;
	// 渲染展开符的列key
	renderIconKey?: string;
	// 渲染缩进的列key支持多列同时缩进
	renderIndentKeys?: string[];
	// 缩进距离
	indentSize?: number;
};

export type TableTreeProps<T> = TableCoreProps<T> & {
	// 树形展开
	treeExpand: TableTreeExpand<T>;
};
