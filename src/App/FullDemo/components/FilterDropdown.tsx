import { type FC, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

import styles from '../index.module.less';
import { TableCoreFilterIcon } from '../../../TableComponents';
import { type CheckboxFilterKeys, type FilterState } from '../types';

type Props = {
	colKey: CheckboxFilterKeys;
	options: string[];
	enabled: boolean;
	state: FilterState;
	draft: FilterState;
	isOpen: boolean;
	onOpen: (colKey: string) => void;
	onClose: () => void;
	onToggle: (colKey: CheckboxFilterKeys, value: string) => void;
	onConfirm: (colKey: keyof FilterState) => void;
	onReset: (colKey: keyof FilterState) => void;
};

const FilterDropdown: FC<Props> = ({
	colKey,
	options,
	enabled,
	state,
	draft,
	isOpen,
	onOpen,
	onClose,
	onToggle,
	onConfirm,
	onReset,
}) => {
	const iconRef = useRef<HTMLDivElement>(null);
	const selected = draft[colKey] as string[];
	const filtered = (state[colKey] as string[]).length > 0;

	const getDropdownPosition = useCallback((): React.CSSProperties => {
		if (!iconRef.current) return { display: 'none' };
		const rect = iconRef.current.getBoundingClientRect();
		return {
			position: 'fixed',
			top: rect.bottom + 4,
			left: rect.left,
			zIndex: 9999,
		};
	}, []);

	if (!enabled) return null;

	return (
		<div ref={iconRef} data-filter-trigger>
			<TableCoreFilterIcon
				visible={isOpen}
				filtered={filtered}
				onClick={() => {
					if (isOpen) {
						onClose();
					} else {
						onOpen(colKey);
					}
				}}
			>
				<svg viewBox="64 64 896 896" width="12" height="12" fill="currentColor">
					<path d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376.3V842c0 11 9 20 20 20h328c11 0 20-9 20-20V578.3L907.7 202c12.2-21.3-3.1-48-27.6-48z" />
				</svg>
			</TableCoreFilterIcon>
			{isOpen && createPortal(
				<div style={getDropdownPosition()} data-filter-dropdown>
					<div className={styles.filterDropdown}>
						<div className={styles.filterList}>
							{options.map((opt) => (
								<div
									key={opt}
									className={styles.filterItem}
									onClick={() => onToggle(colKey, opt)}
								>
									<input
										type="checkbox"
										checked={selected.includes(opt)}
										readOnly
										style={{ pointerEvents: 'none' }}
									/>
									<span>{opt}</span>
								</div>
							))}
						</div>
						<div className={styles.filterFooter}>
							<button className={styles.filterFooterBtn} onClick={() => onReset(colKey)}>
								重置
							</button>
							<button className={`${styles.filterFooterBtn} ${styles.confirm}`} onClick={() => onConfirm(colKey)}>
								确定
							</button>
						</div>
					</div>
				</div>,
				document.body,
			)}
		</div>
	);
};

export default FilterDropdown;
