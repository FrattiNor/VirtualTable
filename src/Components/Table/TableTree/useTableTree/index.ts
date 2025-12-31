import { useEffect, useState } from 'react';

import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { type TableTreeExpand } from '../type';
import useRenderPrefix from './useRenderPrefix';
import useRowParams from './useRowParams';
import useTreeData from './useTreeData';

type Props<T> = {
	coreProps: TableCoreProps<T>;
	treeExpand: TableTreeExpand<T>;
};

const useTableTree = <T>({ coreProps, treeExpand }: Props<T>) => {
	const [expandKeys, setExpandKeys] = useState<string[]>(() => []);

	// 全部已经open的key、全部能open的key、全部key对应的level
	const { allExpandedKeyMap, allCouldExpandKeyMap, levelMap } = useRowParams({ coreProps, treeExpand, expandKeys });

	// tree最终的数据源
	const dataSource = useTreeData({ coreProps, treeExpand, allExpandedKeyMap });

	// 渲染表头缩进、渲染表格缩进
	const { renderHeadPrefix, renderCellPrefix } = useRenderPrefix({
		coreProps,
		treeExpand,
		allCouldExpandKeyMap,
		allExpandedKeyMap,
		levelMap,
		setExpandKeys,
	});

	// 可选中的key变更，清除不存在的key
	useEffect(() => {
		setExpandKeys((oldKeys) => {
			const newKeys: string[] = [];
			oldKeys.forEach((key) => {
				if (allCouldExpandKeyMap.get(key)) newKeys.push(key);
			});
			return newKeys;
		});
	}, [allCouldExpandKeyMap]);

	return { dataSource, renderHeadPrefix, renderCellPrefix };
};

export default useTableTree;
