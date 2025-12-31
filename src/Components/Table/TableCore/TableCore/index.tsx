import { memo } from 'react';

import TableDom from '../TableDom';
import { type TableComponent } from '../TableTypes/type';
import { type TableCoreProps } from '../TableTypes/typeProps';
import useTableInstance from '../useTableInstance';

const TableCore = <T,>(coreProps: TableCoreProps<T>) => {
	const instance = useTableInstance(coreProps);
	return <TableDom {...instance} />;
};

export default memo(TableCore) as TableComponent;
