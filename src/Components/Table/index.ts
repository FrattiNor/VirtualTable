import { type TableProps } from './Table/type';
import { type TableCoreRef, type TableCoreColumnFixed, type TableCoreSorter } from './TableCore/TableTypes/type';
import { type TableCoreColumns, type TableCoreColumn } from './TableCore/TableTypes/typeColumn';

export { default as TableCoreFilterIcon } from './TableFilterIcon';

export { default as Table2 } from './Table';

export type Table2Ref = TableCoreRef;
export type Table2Sorter = TableCoreSorter;
export type Table2Props<T> = TableProps<T>;
export type Table2Column<T> = TableCoreColumn<T>;
export type Table2Columns<T> = TableCoreColumns<T>;
export type Table2ColumnFixed = TableCoreColumnFixed;

// TODO 拖拽行数太多会卡顿
// TODO 拖拽、多选、Tree，状态开启关闭，状态会刷新
