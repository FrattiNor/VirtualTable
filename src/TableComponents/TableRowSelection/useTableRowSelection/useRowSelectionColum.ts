import { type ReactNode } from 'react';

import { type RowKeyType } from '../../TableCore/TableTypes/type';
import { type TableCoreColumn } from '../../TableCore/TableTypes/typeColumn';
import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableRowSelection } from '../type';

type Props<T> = {
	title: ReactNode;
	rowKey: TableCoreProps<T>['rowKey'];
	disabledMap: Map<RowKeyType, boolean>;
	allSelectedKeyMap: Map<RowKeyType, true>;
	rowSelection: TableRowSelection<T>;
};

// 列配置
const useRowSelectionColum = <T>({ title, disabledMap, allSelectedKeyMap, rowKey, rowSelection }: Props<T>) => {
	const { width, renderCheckbox, setSelectedKeys } = rowSelection;

	const rowSelectionColum: TableCoreColumn<T> = {
		title,
		flexGrow: 0,
		fixed: 'left',
		resize: false,
		align: 'center',
		width: width ?? 42,
		key: 'rowSelectionColum',
		render: (itemData) => {
			const key = getRowKey(rowKey, itemData);
			const disabled = disabledMap.get(key) ?? false;
			const checked = allSelectedKeyMap.get(key) ?? false;
			return renderCheckbox({
				checked,
				disabled,
				onChange: (checked: boolean) => {
					const newMap = new Map(allSelectedKeyMap);
					if (checked) {
						newMap.set(key, true);
						setSelectedKeys(Array.from(newMap.keys()));
					} else {
						newMap.delete(key);
						setSelectedKeys(Array.from(newMap.keys()));
					}
				},
			});
		},
	};

	return rowSelectionColum;
};

export default useRowSelectionColum;
