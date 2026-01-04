import { type TableCoreColumn } from '../../TableCore/TableTypes/typeColumn';
import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import DraggableIcon from '../DraggableIcon';
import { type TableRowDraggable } from '../type';

type Props<T> = {
	rowDraggable: TableRowDraggable;
	rowKey: TableCoreProps<T>['rowKey'];
};

const useRowDraggableColum = <T,>({ rowDraggable, rowKey }: Props<T>) => {
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
			return <DraggableIcon id={key} />;
		},
	};

	return rowDraggableColum;
};

export default useRowDraggableColum;
