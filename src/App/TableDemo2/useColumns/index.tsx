import type { Table2Columns } from '../../../TableComponents';
import type { AreaOnOffListItem } from '../useData';

const useColumns = () => {
	const columns: Table2Columns<AreaOnOffListItem> = [
		{
			// index
			title: 'Index',
			key: 'index' as any,
			width: 150,
		},
		{
			// 厂区
			title: '厂区',
			key: 'location',
			width: 250,
			fixed: 'left',
		},
		{
			// 装置
			title: '装置',
			key: 'area',
			width: 250,
		},
		{
			// 子单元
			title: '子单元',
			key: 'subunit',
			width: 250,
		},
		{
			// 当前状态
			title: '当前状态',
			key: 'tagState',
			width: 150,
			render: () => '当前状态',
		},
		{
			// 上一次状态
			align: 'center',
			title: '上一次状态',
			key: 'lastState',
			width: 150,
			render: () => '上一次状态',
		},
		{
			// 最近开工时间
			title: '最近开工时间',
			key: 'lastOnTime',
			width: 180,
			render: () => '-',
		},
		{
			// 最近停工时间
			title: '最近停工时间',
			key: 'lastOffTime',
			width: 180,
			render: () => '-',
		},
		{
			// 判断逻辑
			title: '判断逻辑',
			key: 'expression',
			width: 300,
			colBodyForceRender: true,
			// render: () => (
			// 	<MultipleLineEllipsis lines={3}>
			// 		{
			// 			'expression expression expression expression expression expression expression expression expression expression expression expression expression expression expression expression expression expression expression expression'
			// 		}
			// 	</MultipleLineEllipsis>
			// ),
		},
		{
			// 相关位号实时值
			title: '相关位号实时值',
			key: 'relatedTags',
			width: 300,
			colBodyForceRender: true,
			render: () => '-',
		},
		{
			// 更新时间
			title: '更新时间',
			key: 'updateTime',
			width: 180,
			render: () => '-',
			fixed: 'right',
		},
		...Array(900)
			.fill('')
			.map((_, index) => ({
				// 更新时间
				title: `${index}`,
				key: `${index}`,
				render: () => '-',
			})),
	];

	return columns;
};

export default useColumns;
