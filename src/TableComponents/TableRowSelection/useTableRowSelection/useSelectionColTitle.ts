import { useMemo } from 'react';

import { type RowKeyType } from '../../TableCore/TableTypes/type';
import { type TableRowSelection } from '../type';

type Props<T> = {
	allSelectedKeyMap: Map<RowKeyType, true>;
	allCouldSelectedKeyMap: Map<RowKeyType, true>;
	rowSelection: TableRowSelection<T>;
};

// 列标题
const useSelectionColTitle = <T>({ allCouldSelectedKeyMap, allSelectedKeyMap, rowSelection }: Props<T>) => {
	const { renderCheckbox, setSelectedKeys } = rowSelection;

	return useMemo(() => {
		// title禁用状态
		const titleDisabled = allCouldSelectedKeyMap.size === 0;

		// title选中状态
		const titleChecked = (() => {
			// 非禁用
			if (!titleDisabled) {
				// 可选项全部都被选中
				return Array.from(allCouldSelectedKeyMap.keys()).every((key) => allSelectedKeyMap.get(key));
			}
			return false;
		})();

		// title半选中状态
		const titleIndeterminate = (() => {
			// 非禁用 非选中
			if (!titleDisabled && !titleChecked) {
				// 选中项大于0
				if (allSelectedKeyMap.size > 0) {
					// 选中项数组
					const allCheckedKeysArr = Array.from(allSelectedKeyMap.keys());
					// 选中项存在于可选项中
					if (allCheckedKeysArr.some((key) => allCouldSelectedKeyMap.get(key))) return true;
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
					setSelectedKeys([]);
				} else {
					setSelectedKeys(Array.from(allCouldSelectedKeyMap.keys()));
				}
			},
		});
	}, [allCouldSelectedKeyMap, allSelectedKeyMap]);
};

export default useSelectionColTitle;
