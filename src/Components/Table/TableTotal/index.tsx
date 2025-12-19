import { memo } from 'react';

import { TableCore } from '../TableCore';
import TableRowSelection from '../TableRowSelection';
import { type TableTotalComponent, type TableTotalProps } from './type';

const TableTotal = <T,>(props: TableTotalProps<T>) => {
	const { rowSelection, ...restProps } = props;
	const haveRowSelection = !!rowSelection;
	if (haveRowSelection) return <TableRowSelection {...restProps} rowSelection={rowSelection} />;
	return <TableCore {...restProps} />;
};

export default memo(TableTotal) as TableTotalComponent;
