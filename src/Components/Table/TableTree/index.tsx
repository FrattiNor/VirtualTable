import { memo } from 'react';

import { TableCore } from '../TableCore';
import { type TableTreeProps } from './type';
import useTableTree from './useTableTree';

const TableTree = <T,>(props: TableTreeProps<T>) => {
	const { treeExpand, ...restProps } = props;
	const { dataSource, renderHeadPrefix, renderCellPrefix } = useTableTree({ props, treeExpand });
	return <TableCore {...restProps} data={dataSource} renderHeadPrefix={renderHeadPrefix} renderCellPrefix={renderCellPrefix} />;
};

export default memo(TableTree) as typeof TableTree;
