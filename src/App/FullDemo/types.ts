export type DemoItem = {
	id: string;
	name: string;
	age: number;
	department: string;
	city: string;
	salary: number;
	status: string;
	email: string;
	joinDate: string;
	score: number;
	children?: DemoItem[];
};

export type SummaryItem = {
	totalCount: number;
	avgAge: string;
	avgSalary: string;
	avgScore: string;
};

export const departments = ['研发部', '市场部', '销售部', '人事部', '财务部', '运营部'];
export const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京'];
export const statuses = ['在职', '休假', '出差', '离职'];

export const generateData = (count: number, haveChild: boolean): DemoItem[] => {
	const data: DemoItem[] = [];
	for (let i = 0; i < count; i++) {
		const item: DemoItem = {
			id: `emp_${i}`,
			name: `员工${i}`,
			age: 22 + Math.floor(Math.random() * 30),
			department: departments[i % departments.length],
			city: cities[i % cities.length],
			salary: 8000 + Math.floor(Math.random() * 20000),
			status: statuses[i % statuses.length],
			email: `emp${i}@company.com`,
			joinDate: `2020-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
			score: Math.floor(Math.random() * 100),
		};
		if (haveChild && i % 5 === 0 && i < count * 0.3) {
			item.children = [
				{
					id: `emp_${i}_sub1`,
					name: `员工${i}-子项1`,
					age: 22 + Math.floor(Math.random() * 10),
					department: departments[(i + 1) % departments.length],
					city: cities[(i + 1) % cities.length],
					salary: 6000 + Math.floor(Math.random() * 10000),
					status: '在职',
					email: `emp${i}_sub1@company.com`,
					joinDate: `2022-${String((i % 12) + 1).padStart(2, '0')}-15`,
					score: Math.floor(Math.random() * 100),
				},
				{
					id: `emp_${i}_sub2`,
					name: `员工${i}-子项2`,
					age: 25 + Math.floor(Math.random() * 10),
					department: departments[(i + 2) % departments.length],
					city: cities[(i + 2) % cities.length],
					salary: 7000 + Math.floor(Math.random() * 12000),
					status: '在职',
					email: `emp${i}_sub2@company.com`,
					joinDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-20`,
					score: Math.floor(Math.random() * 100),
					children: [
						{
							id: `emp_${i}_sub2_sub1`,
							name: `员工${i}-子项2-孙项1`,
							age: 22 + Math.floor(Math.random() * 5),
							department: '研发部',
							city: '北京',
							salary: 5000 + Math.floor(Math.random() * 8000),
							status: '在职',
							email: `emp${i}_sub2_sub1@company.com`,
							joinDate: `2024-01-10`,
							score: Math.floor(Math.random() * 100),
						},
					],
				},
			];
		}
		data.push(item);
	}
	return data;
};

export type CheckboxFilterKeys = 'department' | 'city' | 'status';
export type TextFilterKeys = 'id' | 'name' | 'age' | 'salary' | 'email' | 'joinDate' | 'score';

export type FilterState = {
	department: string[];
	city: string[];
	status: string[];
	id: string;
	name: string;
	age: string;
	salary: string;
	email: string;
	joinDate: string;
	score: string;
};

export const EMPTY_FILTER_STATE: FilterState = {
	department: [], city: [], status: [],
	id: '', name: '', age: '', salary: '', email: '', joinDate: '', score: '',
};

export const PAGE_SIZE = 50;
