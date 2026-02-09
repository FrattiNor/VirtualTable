import { type ReactNode } from 'react';

import { type RowKeyType } from '../TableCore/TableTypes/type';
import { type TableCoreProps } from '../TableCore/TableTypes/typeProps';
import { type TableRowDraggable } from '../TableRowDrag/type';
import { type TableRowSelection } from '../TableRowSelection/type';
import { type TableTreeExpand } from '../TableTree/type';

export type TableProps<T, K = RowKeyType, S = any> = Omit<TableCoreProps<T, K, S>, 'rowSelectionProps' | 'treeExpandProps' | 'rowDraggableProps'> & {
	// 树形展开
	treeExpand?: TableTreeExpand<T>;
	// 行选拖拽配置
	rowDraggable?: TableRowDraggable<K>;
	// 行选中情况
	rowSelection?: TableRowSelection<T, K>;
};

export type TableComponent = <T extends Record<string, unknown>, K extends RowKeyType, S extends Record<string, unknown>>(
	props: TableProps<T, K, S>,
) => ReactNode;
