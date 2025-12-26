import { type TableCoreProps } from '../TableCore/TableTypes/typeProps';
import { type TableRowSelection } from '../TableRowSelection/type';

export type TableTotalProps<T> = TableCoreProps<T> & {
	// 行选中情况
	rowSelection?: TableRowSelection<T>;
};
