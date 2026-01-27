import { type ReactNode, type CSSProperties, type RefObject, type FC } from 'react';

import type { TableCoreColumnConf, TableCoreTheme, TableCoreRef, TableRowKey, TableCoreSorter, RowKeyType } from './type';
import type { TableCoreColumn, TableCoreColumns } from './typeColumn';

// T 数据源
// K 数据源的行key
// S 总结栏数据源
export type TableCoreProps<T, K = RowKeyType, S = any> = {
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
	// 总结栏数据源
	summaryData?: Array<S> | undefined;
	// 列配置
	columns: TableCoreColumns<T>;
	// 列配置【覆盖】
	columnConf?: TableCoreColumnConf;
	// 行key
	rowKey: TableRowKey<T, K>;
	// 边框样式
	bordered?: boolean;
	// 最小行高
	rowHeight?: number;
	// 边框宽度【不参数设置样式、只用于计算行高】
	borderWidth?: number;
	// 加载中
	loading?: boolean;
	// 拖动修改大小的回调，用于保存列宽配置
	onResizeEnd?: (widths: Record<string, number>) => void;
	// 分页器
	pagination?: ReactNode;
	// 高亮关键字
	highlightKeywords?: string[];
	// 行高亮配置
	rowBgHighlight?: {
		rowHover?: boolean;
		rowClick?: boolean;
		rowSelect?: boolean;
	};
	// empty
	renderEmpty?: ReactNode;
	// 排序
	sorter?: TableCoreSorter;
	// 行点击，使用外部状态
	rowClick?: {
		rowClickedMap: Map<K, true>;
		setRowClickedMap: React.Dispatch<React.SetStateAction<Map<K, true>>>;
	};

	// 影响：增加选择列、选中状态行背景色修改
	// === rowSelectProps ===
	rowSelectionProps?: {
		// 行选择列配置
		rowSelectionColum: TableCoreColumn<T>;
		// 行选中状态
		rowSelectedKeyMap: Map<K, boolean>;
	};

	// 影响：head和body的cell之前渲染额外内容
	// === treeExpandProps ===
	treeExpandProps?: {
		// 渲染head的前缀，用于渲染tree展开符或是缩进【只在叶子节点渲染】
		renderHeadPrefix: (colKey: string) => ReactNode;
		// 渲染body的前缀，用于渲染tree展开符或是缩进
		renderCellPrefix: (colKey: string, itemData: T) => ReactNode;
	};

	// 影响：Row列增加外壳RowDraggableWrapper，注入额外参数
	// 影响：BodyInner从grid转换为initial，Row从contents转换为grid，且不再支持RowCellSpan
	// 影响：增加排序列、排序选中行背景色修改、DraggingRow被虚拟列表隐藏时，额外渲染DraggingRow
	// === rowDraggableProps ===
	rowDraggableProps?: {
		// 正在行拖拽的key 【行高亮使用】
		draggingRowKey?: K;
		// 正在行拖拽的key 【虚拟渲染使用】
		draggingRowIndex?: number;
		// 行拖拽列配置
		rowDraggableColum: TableCoreColumn<T>;
		// 配置每行的外壳，注入参数
		RowDraggableWrapper: FC<{ rowKey: K; rowIndex: number; children: JSX.Element }>;
		// 渲染DraggableContext外壳
		renderWidthDraggableWrapper: (children: ReactNode) => JSX.Element;
	};
};
