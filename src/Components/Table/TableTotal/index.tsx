import { memo } from 'react';

import { TableCore } from '../TableCore';
import TableRowSelection from '../TableRowSelection';
import { type TableTotalProps } from './type';

const TableTotal = <T extends Record<string, unknown>>(props: TableTotalProps<T>) => {
	const { rowSelection, ...restProps } = props;
	const haveRowSelection = !!rowSelection;
	if (haveRowSelection) return <TableRowSelection {...restProps} rowSelection={rowSelection} />;
	return <TableCore {...restProps} />;
};

export default memo(TableTotal) as typeof TableTotal;
