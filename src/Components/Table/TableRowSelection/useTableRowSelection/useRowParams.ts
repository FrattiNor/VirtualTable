import { useMemo } from 'react';

import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableRowSelection } from '../type';

type Props<T> = {
	coreProps: TableCoreProps<T>;
	rowSelection: TableRowSelection<T>;
};

// 获取全部可选列、全部列的disabled状态【不受getDisabled影响】
const useRowParams = <T>({ rowSelection, coreProps }: Props<T>) => {
	const { data, rowKey } = coreProps;
	const { getDisabled, selectedKeys } = rowSelection;

	const allSelectedKeyMap = useMemo(() => {
		const keyMap = new Map<string, true>();
		selectedKeys.forEach((key) => keyMap.set(key, true));
		return keyMap;
	}, [selectedKeys]);

	const { allCouldSelectedKeyMap, disabledMap } = useMemo(() => {
		const disabledMap = new Map<string, boolean>();
		const allCouldSelectedKeyMap = new Map<string, true>();
		data?.forEach((itemData) => {
			const key = getRowKey(rowKey, itemData);
			const disabled = typeof getDisabled === 'function' ? getDisabled(itemData) : false;
			disabledMap.set(key, disabled);
			if (disabled !== true) allCouldSelectedKeyMap.set(key, true);
		});
		return { allCouldSelectedKeyMap, disabledMap };
	}, [data]);

	return { allSelectedKeyMap, allCouldSelectedKeyMap, disabledMap };
};

export default useRowParams;
