import { useEffect, useMemo } from 'react';

import { type TableCoreColumn } from '../../TableCore/TableTypes/typeColumn';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableRowSelectionProps } from '../type';

type Props<T> = {
	props: TableRowSelectionProps<T>;
	rowSelection: TableRowSelectionProps<T>['rowSelection'];
};

const useTableRowSelection = <T>({ rowSelection, props }: Props<T>) => {
	const { data, rowKey } = props;
	const { width, renderCheckbox, selectedRowKeys, setSelectedRowKeys, getDisabled } = rowSelection;

	// 获取列是否可选、列全部可选的key【不受getDisabled影响】
	const { allSelectionKeyMap, disabledMap } = useMemo(() => {
		const disabledMap = new Map<string, boolean>();
		const allSelectionKeyMap = new Map<string, true>();
		data?.forEach((itemData, index) => {
			const key = getRowKey(rowKey, itemData, index);
			const disabled = typeof getDisabled === 'function' ? getDisabled(itemData) : false;
			disabledMap.set(key, disabled);
			if (disabled !== true) allSelectionKeyMap.set(key, true);
		});
		return { allSelectionKeyMap, disabledMap };
	}, [data]);

	// 全部已经选中的key
	const allCheckedKeysMap = useMemo(() => {
		const keyMap = new Map<string, true>();
		selectedRowKeys.forEach((key) => keyMap.set(key, true));
		return keyMap;
	}, [selectedRowKeys]);

	const title = useMemo(() => {
		// title禁用状态
		const titleDisabled = allSelectionKeyMap.size === 0;
		// title选中状态
		const titleChecked = (() => {
			// 非禁用
			if (!titleDisabled) {
				// 可选项数组
				const allSelectionKeyArr = Array.from(allSelectionKeyMap.keys());
				// 可选项全部都被选中
				return allSelectionKeyArr.every((key) => allCheckedKeysMap.get(key));
			}
			return false;
		})();
		// title半选中状态
		const titleIndeterminate = (() => {
			// 非禁用 非选中
			if (!titleDisabled && !titleChecked) {
				// 选中项大于0
				if (allCheckedKeysMap.size > 0) {
					// 选中项数组
					const allCheckedKeysArr = Array.from(allCheckedKeysMap.keys());
					// 选中项存在于可选项中
					if (allCheckedKeysArr.some((key) => allSelectionKeyMap.get(key))) return true;
				}
			}
			return undefined;
		})();
		// title render
		return renderCheckbox({
			checked: titleChecked,
			disabled: titleDisabled,
			indeterminate: titleIndeterminate,
			onChange: (checked: boolean) => {
				if (checked !== true) {
					setSelectedRowKeys([]);
				} else {
					setSelectedRowKeys(Array.from(allSelectionKeyMap.keys()));
				}
			},
		});
	}, [allSelectionKeyMap, allCheckedKeysMap]);

	// 列配置
	const rowSelectionColum: TableCoreColumn<T> = {
		title,
		flexGrow: 0,
		fixed: 'left',
		resize: false,
		align: 'center',
		width: width ?? 42,
		key: 'rowSelectionColum',
		render: (itemData, { index }) => {
			const key = getRowKey(rowKey, itemData, index);
			const disabled = disabledMap.get(key) ?? false;
			const checked = allCheckedKeysMap.get(key) ?? false;
			return renderCheckbox({
				checked,
				disabled,
				onChange: (checked: boolean) => {
					const newMap = new Map(allCheckedKeysMap);
					if (checked) {
						newMap.set(key, true);
						setSelectedRowKeys(Array.from(newMap.keys()));
					} else {
						newMap.delete(key);
						setSelectedRowKeys(Array.from(newMap.keys()));
					}
				},
			});
		},
	};

	// 可选中的key变更，清除不存在的key
	useEffect(() => {
		setSelectedRowKeys((oldKeys) => {
			const newKeys: string[] = [];
			oldKeys.forEach((key) => {
				if (allSelectionKeyMap.get(key)) newKeys.push(key);
			});
			return newKeys;
		});
	}, [allSelectionKeyMap]);

	return { rowSelectionColum, rowSelectionKeyMap: allCheckedKeysMap };
};

export default useTableRowSelection;
