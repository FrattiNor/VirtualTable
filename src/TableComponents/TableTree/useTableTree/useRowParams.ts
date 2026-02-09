import { useMemo } from 'react';

import { type RowKeyType } from '../../TableCore/TableTypes/type';
import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableTreeExpand } from '../type';

type Props<T> = {
	expandKeys: RowKeyType[] | null;
	treeExpand: TableTreeExpand<T>;
	data: TableCoreProps<T>['data'];
	rowKey: TableCoreProps<T>['rowKey'];
};

const useRowParams = <T>({ data, rowKey, treeExpand, expandKeys }: Props<T>) => {
	const { children, defaultExpandAll } = treeExpand;

	// 全部能open的key、全部key对应的level
	const { allCouldExpandKeyMap, levelMap } = useMemo(() => {
		const allCouldExpandKeyMap = new Map<RowKeyType, true>();
		const levelMap = new Map<RowKeyType, number>();
		const loopData = (_data: T[], level = 0) => {
			_data.forEach((itemData) => {
				const key = getRowKey(rowKey, itemData);
				levelMap.set(key, level);
				const itemChild = itemData[children];
				if (Array.isArray(itemChild) && itemChild.length > 0) {
					allCouldExpandKeyMap.set(key, true);
					loopData(itemChild, level + 1);
				}
			});
		};
		loopData(data ?? []);
		return { allCouldExpandKeyMap, levelMap };
	}, [data, children]);

	// 全部已经open的key
	const allExpandedKeyMap = useMemo(() => {
		// defaultExpandAll时且expandKeys为默认值null，则判定全打开
		if (defaultExpandAll === true && expandKeys === null) return new Map(allCouldExpandKeyMap);
		const keyMap = new Map<RowKeyType, true>();
		expandKeys?.forEach((key) => keyMap.set(key, true));
		return keyMap;
	}, [expandKeys, defaultExpandAll, allCouldExpandKeyMap]);

	return { allExpandedKeyMap, allCouldExpandKeyMap, levelMap };
};

export default useRowParams;
