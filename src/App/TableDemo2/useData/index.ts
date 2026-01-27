import { useState } from 'react';

import { getTestData } from './data';

export type AreaOnOffListItem = {
	id: string;
	area: string;
	uniqueId: string;
	location: string;
	expression: string;
	subunit: string;
	factoryModelPath: string;
	children?: AreaOnOffListItem[];
};

const useData = () => {
	const [data, setData] = useState<Array<AreaOnOffListItem> | undefined>(() => getTestData(false));

	return { data, setData, loading: false };
};

export default useData;
