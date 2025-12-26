import { type TableCoreColumn } from '../../TableCore/TableTypes/typeColumn';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableRowDraggable, type TableRowDragProps } from '../type';
import DragIcon from './DragIcon';

type Props<T> = {
	props: TableRowDragProps<T>;
	rowDraggable: TableRowDraggable;
};

const useTableRowDraggable = <T,>({ rowDraggable, props }: Props<T>) => {
	const { rowKey } = props;
	const { width } = rowDraggable;

	// 列配置
	const rowDraggableColum: TableCoreColumn<T> = {
		title: <span />,
		flexGrow: 0,
		fixed: 'left',
		resize: false,
		align: 'center',
		width: width ?? 42,
		key: 'rowDraggableColum',
		render: (itemData) => {
			const key = getRowKey(rowKey, itemData);
			return <DragIcon id={key} />;
		},
	};

	return { rowDraggableColum };
};

export default useTableRowDraggable;
