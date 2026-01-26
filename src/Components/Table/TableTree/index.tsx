/* eslint-disable react-refresh/only-export-components */
import { memo } from 'react';

import TableCore from '../TableCore';
import { type TableTreeComponent, type TableTreeProps } from './type';
import useTableTree from './useTableTree';

export const _treeHookProps: Parameters<typeof useTableTree<any>>[0] = {
	data: undefined,
	rowKey: '',
	columns: [],
	treeExpand: { children: 'children' },
};

const TableTree = <T extends Record<string, unknown>>(props: TableTreeProps<T>) => {
	const { treeExpand, ...coreProps } = props;

	const enabled = treeExpand?.enabled ?? true;

	const treeHookProps: Parameters<typeof useTableTree<T>>[0] = {
		data: coreProps.data,
		rowKey: coreProps.rowKey,
		columns: coreProps.columns,
		treeExpand,
	};

	const { showData, renderHeadPrefix, renderCellPrefix } = useTableTree(enabled ? treeHookProps : _treeHookProps);

	const tableDomProps = {
		...coreProps,
		data: enabled ? showData : props.data,
		treeExpandProps: enabled ? { renderHeadPrefix, renderCellPrefix } : undefined,
	};

	return <TableCore {...tableDomProps} />;
};

export default memo(TableTree) as TableTreeComponent;
