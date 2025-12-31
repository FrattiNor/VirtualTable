import { memo } from 'react';

import { TableDom } from '../TableCore';
import { type TableRowSelectionProps } from './type';
import useTableRowSelection from './useTableRowSelection';
import useTableInstance from '../TableCore/useTableInstance';

const TableRowSelection = <T extends Record<string, unknown>>(props: TableRowSelectionProps<T>) => {
	const { rowSelection, ...coreProps } = props;
	const { rowSelectionColum, rowSelectedKeyMap } = useTableRowSelection({ coreProps, rowSelection });

	const instance = useTableInstance({
		...coreProps,
		rowSelectionProps: {
			rowSelectionColum,
			rowSelectedKeyMap,
		},
	});

	return <TableDom {...instance} />;
};

export default memo(TableRowSelection) as typeof TableRowSelection;
