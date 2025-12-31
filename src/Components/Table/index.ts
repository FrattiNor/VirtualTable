import { type TableProps } from './Table/type';
import { type TableCoreRef, type TableCoreColumnFixed } from './TableCore/TableTypes/type';
import { type TableCoreColumns, type TableCoreColumn } from './TableCore/TableTypes/typeColumn';

export { TableCoreFilterIcon } from './TableCore';

export { default as Table2 } from './Table';

export type Table2Ref = TableCoreRef;
export type Table2Props<T> = TableProps<T>;
export type Table2Column<T> = TableCoreColumn<T>;
export type Table2Columns<T> = TableCoreColumns<T>;
export type Table2ColumnFixed = TableCoreColumnFixed;
