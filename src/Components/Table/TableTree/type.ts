import { type ReactNode } from 'react';

import { type RowKeyType } from '../TableCore/TableTypes/type';
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
	// 默认展开全部
	defaultExpandAll?: boolean;
};

export type TableTreeProps<T, K = RowKeyType, S = any> = TableCoreProps<T, K, S> & {
	// 树形展开
	treeExpand: TableTreeExpand<T>;
};

export type TableTreeComponent = <T extends Record<string, unknown>, K extends RowKeyType, S extends Record<string, unknown>>(
	props: TableTreeProps<T, K, S>,
) => ReactNode;
