import { type Dispatch, type SetStateAction, type ReactNode } from 'react';

import { type RowKeyType } from '../TableCore/TableTypes/type';
import { type TableCoreProps } from '../TableCore/TableTypes/typeProps';

// 行选择参数
export type TableRowSelection<T, K = RowKeyType> = {
	width?: number;
	enabled?: boolean;
	selectedKeys: K[];
	setSelectedKeys: Dispatch<SetStateAction<K[]>>;
	renderCheckbox: (params: { checked: boolean; indeterminate?: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) => ReactNode;
	// 不允许变更，只在数据源变更时触发判断
	getDisabled?: (item: T) => boolean;
};

export type TableRowSelectionProps<T, K = RowKeyType, S = any> = TableCoreProps<T, K, S> & {
	// 行选中情况
	rowSelection: TableRowSelection<T>;
};

export type TableRowSelectionComponent = <T extends Record<string, unknown>, K extends RowKeyType, S extends Record<string, unknown>>(
	props: TableRowSelectionProps<T, K, S>,
) => ReactNode;
