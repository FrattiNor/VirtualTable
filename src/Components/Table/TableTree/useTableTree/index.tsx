import { useCallback, useEffect, useMemo, useState } from 'react';

import { type TableCoreColumns } from '../../TableCore/TableTypes/typeColumn';
import { getRowKey } from '../../TableCore/TableUtils';
import Expandable from '../Expandable';
import { type TableTreeProps, type TableTreeExpand } from '../type';

type Props<T> = {
	props: TableTreeProps<T>;
	treeExpand: TableTreeExpand<T>;
};

const useTableTree = <T,>({ props, treeExpand }: Props<T>) => {
	const { data, rowKey, columns } = props;
	const { children, renderIconKey, renderIndentKeys, indentSize = 24 } = treeExpand;
	const [expandKeys, setExpandKeys] = useState<string[]>(() => []);

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

	// 渲染表头缩进
	const renderHeadPrefix = useCallback(
		(colKey: string) => {
			if (allCouldExpandKeyMap.size === 0) return null;

			if (colKey === renderTreeIconKey) {
				return <Expandable indentSize={0} display={false} expanded={false} />;
			}

			return null;
		},
		[renderTreeIconKey, allCouldExpandKeyMap],
	);

	// 渲染每列的展开符、或者缩进
	const renderCellPrefix = useCallback(
		(colKey: string, itemData: T) => {
			if (allCouldExpandKeyMap.size === 0) return null;

			const key = getRowKey(rowKey, itemData);
			const level = levelMap.get(key) ?? 0;

			if (colKey === renderTreeIconKey) {
				const expanded = allExpandedKeyMap.get(key) ?? false;
				const display = allCouldExpandKeyMap.get(key) ?? false;
				const onChange = (c: boolean) => {
					if (c) {
						allExpandedKeyMap.set(key, true);
					} else {
						allExpandedKeyMap.delete(key);
					}
					setExpandKeys(Array.from(allExpandedKeyMap.keys()));
				};
				return <Expandable indentSize={level * indentSize} display={display} expanded={expanded} onChange={onChange} />;
			}

			if (level > 0 && renderTreeIndentKeyMap.get(colKey) === true) {
				return <div style={{ height: 17, width: level * indentSize, flexShrink: 0 }} />;
			}

			return null;
		},
		[renderTreeIconKey, renderTreeIndentKeyMap, levelMap, allExpandedKeyMap, allCouldExpandKeyMap],
	);

	// tree最终的数据源
	const dataSource = useMemo(() => {
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
