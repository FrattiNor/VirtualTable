import { useEffect, useState } from 'react';

import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { type TableTreeExpand } from '../type';
import useRenderPrefix from './useRenderPrefix';
import useRowParams from './useRowParams';
import useTreeData from './useTreeData';

type Props<T> = {
	treeExpand: TableTreeExpand<T>;
	data: TableCoreProps<T>['data'];
	rowKey: TableCoreProps<T>['rowKey'];
	columns: TableCoreProps<T>['columns'];
};

const useTableTree = <T>({ data, rowKey, columns, treeExpand }: Props<T>) => {
	// 默认值设置为null
	// defaultExpandAll时且expandKeys为默认值null，则判定全打开
	const [expandKeys, setExpandKeys] = useState<string[] | null>(() => null);

	// 全部已经open的key、全部能open的key、全部key对应的level
	const { allExpandedKeyMap, allCouldExpandKeyMap, levelMap } = useRowParams({ data, rowKey, treeExpand, expandKeys });

	// tree最终的数据源
	const { showData, totalData } = useTreeData({ data, rowKey, treeExpand, allExpandedKeyMap });

	// 渲染表头缩进、渲染表格缩进
	const { renderHeadPrefix, renderCellPrefix } = useRenderPrefix({
		rowKey,
		columns,
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
			oldKeys?.forEach((key) => {
				if (allCouldExpandKeyMap.get(key)) newKeys.push(key);
			});
			if (newKeys.length === (oldKeys?.length ?? 0)) return oldKeys;
			return newKeys;
		});
	}, [allCouldExpandKeyMap]);

	return { showData, totalData, renderHeadPrefix, renderCellPrefix };
};

export default useTableTree;
