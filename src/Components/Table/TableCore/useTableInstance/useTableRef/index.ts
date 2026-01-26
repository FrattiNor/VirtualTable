import { useImperativeHandle } from 'react';

import { type RowKeyType, type TableColumnConfItem } from '../../TableTypes/type';
import { type TableCoreColumns } from '../../TableTypes/typeColumn';
import { type TableCoreProps } from '../../TableTypes/typeProps';

import type useTableDomRef from '../useTableDomRef';
import type useTableState from '../useTableState';

type Props<T, K, S> = {
	coreProps: TableCoreProps<T, K, S>;
	tableDomRef: ReturnType<typeof useTableDomRef>;
	tableState: ReturnType<typeof useTableState<T, K, S>>;
};

// 暂时关闭loop
const enableLoop = false;

const useTableRef = <T, K = RowKeyType, S = any>({ coreProps, tableState, tableDomRef }: Props<T, K, S>) => {
	const { tableRef, columns, columnConf } = coreProps;
	const { setResized, setSizeCacheMap } = tableState;
	const { vScrollbarRef, hScrollbarRef } = tableDomRef;
	const { visibleConf, sortConf, fixedConf } = columnConf ?? {};

	useImperativeHandle(tableRef, () => {
		return {
			scrollTo: ({ top, left, behavior }) => {
				requestAnimationFrame(() => {
					if (typeof top === 'number') vScrollbarRef.current?.scrollTo({ top, behavior });
					if (typeof left === 'number') hScrollbarRef.current?.scrollTo({ left, behavior });
				});
			},
			clearResized: () => {
				setResized((old) => {
					if (old === true) setSizeCacheMap(new Map());
					return false;
				});
			},
			getOriginColumnsConf: () => {
				const loopColumns = (c: TableCoreColumns<T>) => {
					const res: TableColumnConfItem[] = [];
					c.forEach((column) => {
						const hidden = false;
						const key = column.key;
						const fixed = column.fixed ?? 'default';
						const title = column.titleStr ?? column.title;

						if (Array.isArray(column.children) && column.children.length > 0) {
							res.push({ fixed, hidden, title, key, children: enableLoop ? loopColumns(column.children) : undefined });
						} else {
							res.push({ fixed, hidden, title, key });
						}
					});
					return res;
				};
				return loopColumns(columns);
			},
			getSortedColumnsConf: () => {
				const loopColumns = (c: TableCoreColumns<T>) => {
					let res: TableColumnConfItem[] = [];
					const keyIndexMap = new Map<string, number>();
					c.forEach((column, index) => {
						keyIndexMap.set(column.key, index);

						const key = column.key;
						const hidden = !(visibleConf?.[key] ?? true);
						const title = column.titleStr ?? column.title;
						const fixed = fixedConf?.[key] ?? column.fixed ?? 'default';

						if (Array.isArray(column.children) && column.children.length > 0) {
							res.push({ fixed, hidden, title, key, children: enableLoop ? loopColumns(column.children) : undefined });
						} else {
							res.push({ fixed, hidden, title, key });
						}
					});
					if (sortConf) {
						res = res.sort((a, b) => {
							const aIndex = sortConf?.[a.key] ?? keyIndexMap.get(a.key) ?? Infinity;
							const bIndex = sortConf?.[b.key] ?? keyIndexMap.get(b.key) ?? Infinity;
							return aIndex - bIndex;
						});
					}
					return res;
				};
				return loopColumns(columns);
			},
		};
	});
};

export default useTableRef;
