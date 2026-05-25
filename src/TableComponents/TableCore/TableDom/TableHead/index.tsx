import HeadCellPlaceholder from './HeadCellPlaceholder';
import HeadRow from './HeadRow';
import styles from './index.module.less';
import { useTableInstanceContext } from '../../TableContext';

const TableHead = <T,>() => {
	const props = useTableInstanceContext<T>();
	const { headRef, gridTemplateColumns, vScrollbarState, deepLevel } = props;
	const headGridTemplateColumns = vScrollbarState.have
		? gridTemplateColumns + ` minmax(${vScrollbarState.widthStr}, 1fr)`
		: gridTemplateColumns + ` minmax(0px, 1fr)`;

	return (
		<div ref={headRef} className={styles['head']}>
			<div className={styles['head-inner']} style={{ gridTemplateColumns: headGridTemplateColumns }}>
				{Array(deepLevel + 1)
					.fill(undefined)
					.map((_, rowIndex) => (
						<HeadRow key={rowIndex} rowIndex={rowIndex} />
					))}

				<HeadCellPlaceholder
					rowIndexStart={0}
					rowIndexEnd={deepLevel}
				/>
			</div>
		</div>
	);
};

export default TableHead;
