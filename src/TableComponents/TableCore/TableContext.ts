import { createContext, useContext } from 'react';

import type { TableInstance } from './useTableInstance';

export const TableInstanceContext = createContext<TableInstance<any> | null>(null);

export function useTableInstanceContext<T>(): TableInstance<T> {
	const ctx = useContext(TableInstanceContext);
	if (!ctx) throw new Error('useTableInstanceContext must be used within TableInstanceContext.Provider');
	return ctx as TableInstance<T>;
}
