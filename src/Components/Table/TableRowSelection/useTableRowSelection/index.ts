import { useEffect } from 'react';

import useRowSelectionColum from './useRowSelectionColum';
import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { type TableRowSelection } from '../type';
import useRowParams from './useRowParams';
import useSelectionColTitle from './useSelectionColTitle';

type Props<T> = {
	data: TableCoreProps<T>['data'];
	rowKey: TableCoreProps<T>['rowKey'];
	rowSelection: TableRowSelection<T>;
};

const useTableRowSelection = <T>({ data, rowKey, rowSelection }: Props<T>) => {
	const { setSelectedKeys } = rowSelection;

	// 全部已经选中的key、全部可选列、全部列的disabled状态【不受getDisabled影响】
	const { allSelectedKeyMap, allCouldSelectedKeyMap, disabledMap } = useRowParams({ data, rowKey, rowSelection });

	// 列标题
	const title = useSelectionColTitle({ rowSelection, allSelectedKeyMap, allCouldSelectedKeyMap });

	// 列配置
	const rowSelectionColum = useRowSelectionColum({ title, disabledMap, allSelectedKeyMap, rowKey, rowSelection });

	// 可选中的key变更，清除不存在的key
	useEffect(() => {
		setSelectedKeys((oldKeys) => {
			const newKeys: string[] = [];
			oldKeys.forEach((key) => {
				if (allCouldSelectedKeyMap.get(key)) newKeys.push(key);
			});
			return newKeys;
		});
	}, [allCouldSelectedKeyMap]);

	return { rowSelectionColum, rowSelectedKeyMap: allSelectedKeyMap };
};

export default useTableRowSelection;
