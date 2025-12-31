import { useCallback } from 'react';

import { getLeafColumn, getRowKey } from '../../../TableCore/TableUtils';

import type useTableColumns from '../useTableColumns';
import type useTableInnerProps from '../useTableInnerProps';

type Props<T> = {
	tableColumns: ReturnType<typeof useTableColumns<T>>;
	tableInnerProps: ReturnType<typeof useTableInnerProps<T>>;
};

const useTableUtils = <T>({ tableColumns, tableInnerProps }: Props<T>) => {
	const { data, rowKey } = tableInnerProps;
	const { splitColumnsArr } = tableColumns;

	const getRowKeys = useCallback(
		(rowIndexStart: number, rowIndexEnd: number) => {
			const rowKeys: string[] = [];
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
				const splitColumns = splitColumnsArr[i];
				if (splitColumns) {
					const leafColumn = getLeafColumn(splitColumns);
					colKeys.push(leafColumn.key);
				}
			}
			return colKeys;
		},
		[splitColumnsArr],
	);

	return { getRowKeys, getColKeys };
};

export default useTableUtils;
