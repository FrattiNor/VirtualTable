import { useMemo } from 'react';

import { type TableCoreColumns } from '../../TableCore/TableTypes/typeColumn';
import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { type TableTreeExpand } from '../type';

type Props<T> = {
	treeExpand: TableTreeExpand<T>;
	columns: TableCoreProps<T>['columns'];
};

const useRenderKeyMap = <T>({ columns, treeExpand }: Props<T>) => {
	const { renderIconKey, renderIndentKeys } = treeExpand;

	// 渲染展开符的列的key
	const renderTreeIconKey = useMemo(() => {
		if (typeof renderIconKey === 'string') return renderIconKey;
		const getColKey = (_columns: TableCoreColumns<T>) => {
			const firstCol = _columns[0];
			if (firstCol !== undefined) {
				if (Array.isArray(firstCol.children) && firstCol.children.length > 0) {
					return getColKey(firstCol.children);
				} else {
					return firstCol.key;
				}
			}
			return undefined;
		};
		return getColKey(columns);
	}, [columns, renderIconKey]);

	// 渲染缩进的列的keyMap
	const renderTreeIndentKeyMap = useMemo(() => {
		const keyMap = new Map<string, true>();
		renderIndentKeys?.forEach((key) => keyMap.set(key, true));
		return keyMap;
	}, [JSON.stringify(renderIndentKeys)]);

	return { renderTreeIconKey, renderTreeIndentKeyMap };
};

export default useRenderKeyMap;
