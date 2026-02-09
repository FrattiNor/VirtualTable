import { type TableCoreColumn } from '../../TableCore/TableTypes/typeColumn';
import DraggableIcon from '../DraggableIcon';
import { type TableRowDraggable } from '../type';

type Props = {
	rowDraggable: TableRowDraggable;
};

const useRowDraggableColum = <T,>({ rowDraggable }: Props) => {
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
		render: () => <DraggableIcon />,
	};

	return rowDraggableColum;
};

export default useRowDraggableColum;
