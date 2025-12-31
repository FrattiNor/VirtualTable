import { type TableCoreProps } from '../TableCore/TableTypes/typeProps';
import { type TableRowDraggable } from '../TableRowDrag/type';
import { type TableRowSelection } from '../TableRowSelection/type';
import { type TableTreeExpand } from '../TableTree/type';

export type TableProps<T> = TableCoreProps<T> & {
	// 树形展开
	treeExpand?: TableTreeExpand<T>;
	// 行选拖拽配置
	rowDraggable?: TableRowDraggable;
	// 行选中情况
	rowSelection?: TableRowSelection<T>;
};
