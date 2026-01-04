import { useMemo } from 'react';

import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableTreeExpand } from '../type';

type Props<T> = {
	treeExpand: TableTreeExpand<T>;
	allExpandedKeyMap: Map<string, true>;
	data: TableCoreProps<T>['data'];
	rowKey: TableCoreProps<T>['rowKey'];
};

const useTreeData = <T>({ data, rowKey, treeExpand, allExpandedKeyMap }: Props<T>) => {
	const { children } = treeExpand;

	// tree最终的数据源
	return useMemo(() => {
		const showData: T[] = [];
		const totalData: T[] = [];
		const loopData = (_data: T[], parentsOpen = true) => {
			_data.forEach((itemData) => {
				totalData.push(itemData);
				if (parentsOpen) showData.push(itemData);
				const key = getRowKey(rowKey, itemData);
				const itemChild = itemData[children];
				const currentOpen = parentsOpen && allExpandedKeyMap.get(key) === true;
				if (Array.isArray(itemChild) && itemChild.length > 0) {
					loopData(itemChild, currentOpen);
				}
			});
		};
		loopData(data ?? []);
		return { showData, totalData };
	}, [data, children, allExpandedKeyMap]);
};

export default useTreeData;
