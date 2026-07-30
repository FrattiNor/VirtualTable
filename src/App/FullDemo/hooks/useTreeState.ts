import { useState, useMemo } from 'react';

export const useTreeState = () => {
	const [enabled, setEnabled] = useState(false);

	const treeExpand = useMemo(() => {
		if (!enabled) return undefined;
		return {
			children: 'children' as const,
			renderIconKey: 'name',
			indentSize: 20,
			defaultExpandAll: false,
		};
	}, [enabled]);

	return {
		enabled,
		setEnabled,
		treeExpand,
	};
};
