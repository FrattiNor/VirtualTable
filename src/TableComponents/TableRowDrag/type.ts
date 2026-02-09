import { type ReactNode } from 'react';

import { type RowKeyType } from '../TableCore/TableTypes/type';
import { type TableCoreProps } from '../TableCore/TableTypes/typeProps';

// 行选择参数
export type TableRowDraggable<K = RowKeyType> = {
	width?: number;
	enabled?: boolean;
	onDragEnd?: (params: { activeKey: K; overKey: K; arrayMove: <T>(array: T[], from: number, to: number) => T[] }) => void;
};

export type TableRowDragProps<T, K = RowKeyType, S = any> = TableCoreProps<T, K, S> & {
	// 行选拖拽配置
	rowDraggable: TableRowDraggable<K>;
};

export type TableRowDragComponent = <T extends Record<string, unknown>, K extends RowKeyType, S extends Record<string, unknown>>(
	props: TableRowDragProps<T, K, S>,
) => ReactNode;
