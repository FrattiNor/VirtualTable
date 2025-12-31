import { useMemo } from 'react';

import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableTreeExpand } from '../type';

type Props<T> = {
	coreProps: TableCoreProps<T>;
	treeExpand: TableTreeExpand<T>;
	allExpandedKeyMap: Map<string, true>;
};

const useTreeData = <T>({ coreProps, treeExpand, allExpandedKeyMap }: Props<T>) => {
	const { children } = treeExpand;
	const { data, rowKey } = coreProps;

	// tree最终的数据源
	return useMemo(() => {
		const dataSource: T[] = [];
		const loopData = (_data: T[]) => {
			_data.forEach((itemData) => {
				dataSource.push(itemData);
				const key = getRowKey(rowKey, itemData);
				const itemChild = itemData[children];
				const open = allExpandedKeyMap.get(key) === true;
				if (Array.isArray(itemChild) && itemChild.length > 0 && open === true) {
					loopData(itemChild);
				}
			});
		};
		loopData(data ?? []);
		return dataSource;
	}, [data, children, allExpandedKeyMap]);
};

export default useTreeData;
