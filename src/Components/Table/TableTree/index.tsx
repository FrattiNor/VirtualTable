import { memo } from 'react';

import { TableDom } from '../TableCore';
import { type TableTreeProps } from './type';
import useTableTree from './useTableTree';
import useTableInstance from '../TableCore/useTableInstance';

const TableTree = <T extends Record<string, unknown>>(props: TableTreeProps<T>) => {
	const { treeExpand, ...coreProps } = props;
	const { dataSource, renderHeadPrefix, renderCellPrefix } = useTableTree({ coreProps, treeExpand });

	const instance = useTableInstance({
		...coreProps,
		data: dataSource,
		treeExpandProps: {
			renderHeadPrefix,
			renderCellPrefix,
		},
	});

	return <TableDom {...instance} />;
};

export default memo(TableTree) as typeof TableTree;
