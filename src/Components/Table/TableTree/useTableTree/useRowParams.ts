import { useMemo } from 'react';

import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import { type TableTreeExpand } from '../type';

type Props<T> = {
	expandKeys: string[];
	coreProps: TableCoreProps<T>;
	treeExpand: TableTreeExpand<T>;
};

const useRowParams = <T>({ coreProps, treeExpand, expandKeys }: Props<T>) => {
	const { data, rowKey } = coreProps;
	const { children } = treeExpand;

	// 全部已经open的key
	const allExpandedKeyMap = useMemo(() => {
		const keyMap = new Map<string, true>();
		expandKeys.forEach((key) => keyMap.set(key, true));
		return keyMap;
	}, [expandKeys]);

	// 全部能open的key、全部key对应的level
	const { allCouldExpandKeyMap, levelMap } = useMemo(() => {
		const allCouldExpandKeyMap = new Map<string, true>();
		const levelMap = new Map<string, number>();
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

	return { allExpandedKeyMap, allCouldExpandKeyMap, levelMap };
};

export default useRowParams;
