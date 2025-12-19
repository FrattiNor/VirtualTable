import { type ReactNode, type CSSProperties, type RefObject } from 'react';

import type { TableCoreColumnConf, TableCoreTheme, TableCoreRef } from './type';
import type { TableCoreColumn, TableCoreColumns } from './typeColumn';
import type { ValueTypeKeys } from './typeUtil';

type TableRowKey<T> = ValueTypeKeys<T, string> | ((item: T, index: number) => string);

export type TableCoreProps<T> = {
	// 对外暴露api
	tableRef?: RefObject<TableCoreRef>;
	// 主题
	theme?: TableCoreTheme;
	// 样式
	className?: string;
	// 样式
	style?: CSSProperties;
	// 数据源
	data: Array<T> | undefined;
	// 列配置
	columns: TableCoreColumns<T>;
	// 列配置【覆盖】
	columnConf?: TableCoreColumnConf;
	// 行key
	rowKey: TableRowKey<T>;
	// 边框样式
	bordered?: boolean;
	// 最小行高
	rowHeight?: number;
	// 加载中
	loading?: boolean;
	// 拖动修改大小的回调，用于保存列宽配置
	onResizeEnd?: (widths: Record<string, number>) => void;
	// 分页器
	pagination?: ReactNode;
	// 高亮关键字
	highlightKeywords?: string[];
	// 行选中状态
	rowSelectionKeyMap?: Map<string, boolean>;
	// 行选择列配置
	rowSelectionColum?: TableCoreColumn<T>;
	// 行高亮配置
	rowBgHighlight?: {
		rowHover?: boolean;
		rowClick?: boolean;
		rowSelect?: boolean;
	};
};
