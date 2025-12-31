import { useCallback } from 'react';

import { type TableCoreProps } from '../../TableCore/TableTypes/typeProps';
import { getRowKey } from '../../TableCore/TableUtils';
import Expandable from '../Expandable';
import { type TableTreeExpand } from '../type';
import useRenderKeyMap from './useRenderKeyMap';

type Props<T> = {
	coreProps: TableCoreProps<T>;
	treeExpand: TableTreeExpand<T>;
	allCouldExpandKeyMap: Map<string, true>;
	levelMap: Map<string, number>;
	allExpandedKeyMap: Map<string, true>;
	setExpandKeys: React.Dispatch<React.SetStateAction<string[]>>;
};

const useRenderPrefix = <T,>(props: Props<T>) => {
	const { rowKey } = props.coreProps;
	const { indentSize = 24 } = props.treeExpand;
	const { allCouldExpandKeyMap, allExpandedKeyMap, levelMap, setExpandKeys } = props;
	const { renderTreeIconKey, renderTreeIndentKeyMap } = useRenderKeyMap({ coreProps: props.coreProps, treeExpand: props.treeExpand });

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

	return { renderHeadPrefix, renderCellPrefix };
};

export default useRenderPrefix;
