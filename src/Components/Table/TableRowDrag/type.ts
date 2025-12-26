import { type TableCoreProps } from '../TableCore/TableTypes/typeProps';

// 行选择参数
export type TableRowDraggable = {
	width?: number;
	onDragEnd: (params: { activeKey: string; overKey: string; arrayMove: <T>(array: T[], from: number, to: number) => T[] }) => void;
};

export type TableRowDragProps<T> = TableCoreProps<T> & {
	// 行选拖拽配置
	rowDraggable: TableRowDraggable;
};
