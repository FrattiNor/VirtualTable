import { useState } from 'react';

import styles from '../index.module.less';

export const useTableConfig = () => {
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [bordered, setBordered] = useState(true);
	const [rowHoverHighlight, setRowHoverHighlight] = useState(true);
	const [rowClickHighlight, setRowClickHighlight] = useState(false);
	const [rowSelectHighlight, setRowSelectHighlight] = useState(true);
	const [showSummary, setShowSummary] = useState(false);
	const [cellSpanEnabled, setCellSpanEnabled] = useState(false);
	const [headerGroupEnabled, setHeaderGroupEnabled] = useState(false);

	const rowBgHighlight = {
		rowHover: rowHoverHighlight,
		rowClick: rowClickHighlight,
		rowSelect: rowSelectHighlight,
	};

	return {
		theme,
		setTheme,
		bordered,
		setBordered,
		rowBgHighlight,
		rowHoverHighlight,
		setRowHoverHighlight,
		rowClickHighlight,
		setRowClickHighlight,
		rowSelectHighlight,
		setRowSelectHighlight,
		showSummary,
		setShowSummary,
		cellSpanEnabled,
		setCellSpanEnabled,
		headerGroupEnabled,
		setHeaderGroupEnabled,
		styles,
	};
};
