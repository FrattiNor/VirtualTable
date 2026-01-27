import styles from './index.module.less';
import useColumns from './useColumns';
import useData from './useData';
import { Table2 } from '../../Components/Table';

const TableDemo = () => {
	const columns = useColumns();
	const { data, loading } = useData();

	return (
		<div className={styles['wrapper']}>
			<div className={styles['container']}>
				<Table2 rowKey="id" data={data} columns={columns} loading={loading} bordered={true} className={styles['table']} />
			</div>
		</div>
	);
};

export default TableDemo;
