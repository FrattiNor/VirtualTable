import { defaultRowHeight } from '../../TableUtils/configValues';

import type { Table2Props } from '../../TableTypes/typeProps';

const useTableInnerProps = <T>(props: Table2Props<T>) => {
	const requiredProps = {
		data: props.data,
		rowKey: props.rowKey,
		loading: props.loading ?? false,
		bordered: props.bordered ?? true,
		rowHeight: props.rowHeight ?? defaultRowHeight,
		onResizeEnd: props.onResizeEnd,
		rowBgHighlight: {
			rowClick: props.rowBgHighlight?.rowClick ?? true,
			rowHover: props.rowBgHighlight?.rowClick ?? true,
			rowSelect: props.rowBgHighlight?.rowClick ?? true,
		},
		columnConf: {
			sortConf: props.columnConf?.sortConf,
			widthConf: props.columnConf?.widthConf,
			visibleConf: props.columnConf?.visibleConf,
		},
		style: props.style,
		className: props.className,
	};

	return { ...requiredProps };
};

export default useTableInnerProps;
