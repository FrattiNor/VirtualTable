import { useCallback } from 'react';

import { getLeafColumn, getRowKey } from '../../../TableCore/TableUtils';
import { type RowKeyType } from '../../TableTypes/type';

import type useTableColumns from '../useTableColumns';
import type useTableInnerProps from '../useTableInnerProps';

type Props<T, K, S> = {
	tableColumns: ReturnType<typeof useTableColumns<T, K, S>>;
	tableInnerProps: ReturnType<typeof useTableInnerProps<T, K, S>>;
};

const useTableUtils = <T, K = RowKeyType, S = any>({ tableColumns, tableInnerProps }: Props<T, K, S>) => {
	const { data, rowKey } = tableInnerProps;
	const { finalColumnsArr } = tableColumns;

	const getRowKeys = useCallback(
		(rowIndexStart: number, rowIndexEnd: number) => {
			const rowKeys: K[] = [];
			if (Array.isArray(data)) {
				for (let i = rowIndexStart; i <= rowIndexEnd; i++) {
					const itemData = data[i];
					if (itemData) {
						const itemRowKey = getRowKey(rowKey, itemData);
						rowKeys.push(itemRowKey);
					}
				}
			}
			return rowKeys;
		},
		[data, rowKey],
	);

	const getColKeys = useCallback(
		(colIndexStart: number, colIndexEnd: number) => {
			const colKeys: string[] = [];
			for (let i = colIndexStart; i <= colIndexEnd; i++) {
				const splitColumns = finalColumnsArr[i];
				if (splitColumns) {
					const leafColumn = getLeafColumn(splitColumns);
					colKeys.push(leafColumn.key);
				}
			}
			return colKeys;
		},
		[finalColumnsArr],
	);

	return { getRowKeys, getColKeys };
};

export default useTableUtils;
