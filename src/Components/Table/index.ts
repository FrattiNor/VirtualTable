import { type TableCoreRef, type TableCoreColumnFixed } from './TableCore/TableTypes/type';
import { type TableCoreColumns, type TableCoreColumn } from './TableCore/TableTypes/typeColumn';
import { type TableTotalProps } from './TableTotal/type';

export type Table2Props<T> = TableTotalProps<T>;

export type Table2Ref = TableCoreRef;
export type Table2Column<T> = TableCoreColumn<T>;
export type Table2Columns<T> = TableCoreColumns<T>;
export type Table2ColumnFixed = TableCoreColumnFixed;

export { TableCoreFilterIcon } from './TableCore';
export { default as Table2 } from './TableTotal';
export { default as TableTree } from './TableTree';
export { default as TableRowDrag } from './TableRowDrag';
