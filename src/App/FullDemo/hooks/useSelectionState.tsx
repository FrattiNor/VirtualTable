import { useState, useMemo } from 'react';

import { type DemoItem } from '../types';

export const useSelectionState = () => {
	const [enabled, setEnabled] = useState(false);
	const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

	const rowSelection = useMemo(() => {
		if (!enabled) return undefined;
		return {
			selectedKeys,
			setSelectedKeys,
			renderCheckbox: ({
				checked,
				indeterminate,
				disabled,
				onChange,
			}: {
				checked: boolean;
				indeterminate?: boolean;
				disabled?: boolean;
				onChange: (checked: boolean) => void;
			}) => (
				<input
					type="checkbox"
					checked={checked}
					ref={(el) => {
						if (el) el.indeterminate = !!indeterminate;
					}}
					disabled={disabled}
					onChange={(e) => onChange(e.target.checked)}
					style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
				/>
			),
			getDisabled: (item: DemoItem) => item.status === '离职',
		};
	}, [enabled, selectedKeys]);

	return {
		enabled,
		setEnabled,
		selectedKeys,
		setSelectedKeys,
		rowSelection,
	};
};
