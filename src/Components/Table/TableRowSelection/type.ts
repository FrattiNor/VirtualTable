import { type Dispatch, type SetStateAction, type ReactNode } from 'react';

import { type TableCoreProps } from '../TableCore/TableTypes/typeProps';

// 行选择参数
export type TableRowSelection<T> = {
	width?: number;
	selectedRowKeys: string[];
	setSelectedRowKeys: Dispatch<SetStateAction<string[]>>;
	renderCheckbox: (params: { checked: boolean; indeterminate?: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) => ReactNode;
	// 不允许变更，只在数据源变更时触发判断
	getDisabled?: (item: T) => boolean;
};

export type TableRowSelectionProps<T> = TableCoreProps<T> & {
	// 行选中情况
	rowSelection: TableRowSelection<T>;
};
