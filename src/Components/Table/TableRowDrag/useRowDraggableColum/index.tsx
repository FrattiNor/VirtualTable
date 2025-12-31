import { type TableCoreColumn } from '../../TableCore/TableTypes/typeColumn';
import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableRowDraggable } from '../type';
import DragIcon from './DragIcon';

type Props<T> = {
	coreProps: TableCoreProps<T>;
	rowDraggable: TableRowDraggable;
};

const useRowDraggableColum = <T,>({ rowDraggable, coreProps }: Props<T>) => {
	const { rowKey } = coreProps;
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

	return rowDraggableColum;
};

export default useRowDraggableColum;
