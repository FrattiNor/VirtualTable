import { useImperativeHandle } from 'react';

import { type TableColumnConfItem } from '../../TableTypes/type';
import { type TableCoreColumns, type TableCoreColumn } from '../../TableTypes/typeColumn';
import { type TableCoreProps } from '../../TableTypes/typeProps';

import type useTableDomRef from '../useTableDomRef';
import type useTableState from '../useTableState';

type Props<T> = {
	coreProps: TableCoreProps<T>;
	tableState: ReturnType<typeof useTableState>;
	tableDomRef: ReturnType<typeof useTableDomRef>;
};

const useTableRef = <T>({ coreProps, tableState, tableDomRef }: Props<T>) => {
	const { tableRef, columns, columnConf } = coreProps;
	const { setResized, setSizeCacheMap } = tableState;
	const { vScrollbarRef, hScrollbarRef } = tableDomRef;
	const { visibleConf, sortConf, fixedConf } = columnConf ?? {};

	useImperativeHandle(tableRef, () => {
		return {
			scrollTo: ({ top, left, behavior }) => {
				if (typeof top === 'number') vScrollbarRef.current?.scrollTo({ top, behavior });
				if (typeof left === 'number') hScrollbarRef.current?.scrollTo({ left, behavior });
			},
			clearResized: () => {
				setResized((old) => {
					if (old === true) setSizeCacheMap(new Map());
					return false;
				});
			},
			getOriginColumnsConf: () => {
				const res: TableColumnConfItem[] = [];
				const loopColumns = (c: TableCoreColumns<T>) => {
					c.forEach((column) => {
						if (Array.isArray(column.children) && column.children.length > 0) {
							loopColumns(column.children);
						} else {
							const _column = column as TableCoreColumn<T>;
							const key = _column.key;
							const title = _column.title;
							const hidden = false;
							const fixed = _column.fixed ?? 'default';
							res.push({ fixed, hidden, title, key });
						}
					});
				};
				loopColumns(columns);
				return res;
			},
			getSortedColumnsConf: () => {
				let res: TableColumnConfItem[] = [];
				let index = 0;
				const keyIndexMap = new Map<string, number>();
				const loopColumns = (c: TableCoreColumns<T>) => {
					c.forEach((column) => {
						if (Array.isArray(column.children) && column.children.length > 0) {
							loopColumns(column.children);
						} else {
							const _column = column as TableCoreColumn<T>;
							const key = _column.key;
							const title = _column.title;
							const hidden = !(visibleConf?.[key] ?? true);
							const fixed = fixedConf?.[key] ?? _column.fixed ?? 'default';
							res.push({ fixed, hidden, title, key });
							keyIndexMap.set(column.key, index);
							index++;
						}
					});
				};
				loopColumns(columns);
				if (sortConf) {
					res = res.sort((a, b) => {
						const aIndex = sortConf?.[a.key] ?? keyIndexMap.get(a.key) ?? Infinity;
						const bIndex = sortConf?.[b.key] ?? keyIndexMap.get(b.key) ?? Infinity;
						return aIndex - bIndex;
					});
				}
				return res;
			},
		};
	});
};

export default useTableRef;
