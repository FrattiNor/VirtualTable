/* eslint-disable react-refresh/only-export-components */
import { memo } from 'react';

import TableCore from '../TableCore';
import { type TableRowSelectionComponent, type TableRowSelectionProps } from './type';
import useTableRowSelection from './useTableRowSelection';

export const _selectionHooksProps: Parameters<typeof useTableRowSelection<any>>[0] = {
	data: undefined,
	rowKey: '',
	rowSelection: { selectedKeys: [], setSelectedKeys: () => {}, renderCheckbox: () => null },
};

const TableRowSelection = <T extends Record<string, unknown>>(props: TableRowSelectionProps<T>) => {
	const { rowSelection, ...coreProps } = props;

	const enabled = rowSelection?.enabled ?? true;

	const selectionHooksProps: Parameters<typeof useTableRowSelection<T>>[0] = { data: coreProps.data, rowKey: coreProps.rowKey, rowSelection };

	const rowSelectionProps = useTableRowSelection(enabled ? selectionHooksProps : _selectionHooksProps);

	const tableDomProps = {
		...coreProps,
		rowSelectionProps: enabled ? rowSelectionProps : undefined,
	};

	return <TableCore {...tableDomProps} />;
};

export default memo(TableRowSelection) as TableRowSelectionComponent;
