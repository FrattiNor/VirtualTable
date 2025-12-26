import { useCallback, useEffect, useMemo } from 'react';

import useFrameThrottle from '../../TableHooks/useFrameThrottle';
import { type TableCoreProps } from '../../TableTypes/typeProps';

import type useTableState from '../useTableState';

type Props<T> = {
	props: TableCoreProps<T>;
	tableState: ReturnType<typeof useTableState>;
};

// 表格 单元格 背景色
// 根据点击、hover、resize决定
const useTableCellBg = <T>({ tableState, props }: Props<T>) => {
	const { throttle: throttle1 } = useFrameThrottle();
	const { throttle: throttle2 } = useFrameThrottle();

	const rowSelectionKeyMap = props.rowSelectionProps?.rowSelectionKeyMap;
	const { rowClick = true, rowHover = true, rowSelect = true } = props.rowBgHighlight ?? {};
	const { resizeFlag, rowClickedMap, rowHoveredMap, setRowClickedMap, setRowHoveredMap } = tableState;

	// 配置变更时触发清除原本数据
	useEffect(() => {
		if (rowClick === false) {
			setRowClickedMap((old) => {
				if (old.size !== 0) return new Map();
				return old;
			});
		}
	}, [rowClick]);

	// 配置变更时触发清除原本数据
	useEffect(() => {
		if (rowHover === false) {
			setRowHoveredMap((old) => {
				if (old.size !== 0) return new Map();
				return old;
			});
		}
	}, [rowHover]);

	// 获取列是否在resize
	const getColOnResized = useCallback(
		({ colKeys, every }: { colKeys: string[]; every: boolean }) => {
			if (!resizeFlag) return false;
			if (every) {
				for (let i = 0; i < colKeys.length; i++) {
					if (resizeFlag?.children.get(colKeys[i]) === undefined) return false;
				}
				return true;
			} else {
				for (let i = 0; i < colKeys.length; i++) {
					if (resizeFlag?.children.get(colKeys[i])) return true;
				}
				return false;
			}
		},
		[resizeFlag],
	);

	// 获取行是否clicked
	const getRowClicked = useCallback(
		({ rowKeys }: { rowKeys: string[] }) => {
			if (rowClickedMap.size === 0) return false;
			for (let i = 0; i < rowKeys.length; i++) {
				if (rowClickedMap.get(rowKeys[i])) return true;
			}
			return false;
		},
		[rowClickedMap],
	);

	// 获取行是否hovered
	const getRowHovered = useCallback(
		({ rowKeys }: { rowKeys: string[] }) => {
			if (rowHoveredMap.size === 0) return false;
			for (let i = 0; i < rowKeys.length; i++) {
				if (rowHoveredMap.get(rowKeys[i])) return true;
			}
			return false;
		},
		[rowHoveredMap],
	);

	// 获取行是否hovered
	const getRowSelected = useCallback(
		({ rowKeys }: { rowKeys: string[] }) => {
			if (!rowSelectionKeyMap) return false;
			if (rowSelectionKeyMap.size === 0) return false;
			for (let i = 0; i < rowKeys.length; i++) {
				if (rowSelectionKeyMap.get(rowKeys[i])) return true;
			}
			return false;
		},
		[rowSelectionKeyMap],
	);

	// 获取body cell 背景色
	// 根据resize、hover、select、click决定，存在3档颜色
	const getBodyCellBg = useCallback(
		({ rowKeys, colKeys, defaultBgLevel }: { rowKeys: string[]; colKeys: undefined | string[]; defaultBgLevel?: number }) => {
			let bgColorLevel = defaultBgLevel ?? 0;
			if (colKeys && getColOnResized({ colKeys, every: false })) bgColorLevel += 2;
			if (rowClick === true && getRowClicked({ rowKeys })) bgColorLevel += 2;
			if (rowSelect === true && getRowSelected({ rowKeys }) === true) bgColorLevel += 2;
			if (rowHover === true && getRowHovered({ rowKeys }) === true) bgColorLevel += 1;
			if (bgColorLevel === 0) return 'var(--table-body-cell-bg)';
			if (bgColorLevel === 1) return 'var(--table-body-cell-active-bg-L1)';
			if (bgColorLevel === 2) return 'var(--table-body-cell-active-bg-L2)';
			if (bgColorLevel >= 3) return 'var(--table-body-cell-active-bg-L3)';
			return 'var(--table-body-cell-bg)';
		},
		[getColOnResized, getRowClicked, getRowHovered, getRowSelected],
	);

	// 获取head cell 背景色
	// 根据resize决定，存在1档颜色
	const getHeadCellBg = useCallback(
		({ colKeys }: { colKeys: string[] }) => {
			let bgColorLevel = 0;
			if (getColOnResized({ colKeys, every: true })) bgColorLevel++;
			if (bgColorLevel === 0) return 'var(--table-head-cell-bg)';
			if (bgColorLevel >= 1) return 'var(--table-head-cell-active-bg)';
			return 'var(--table-head-cell-bg)';
		},
		[getColOnResized],
	);

	const bodyRowMouseEnter = useMemo(() => {
		if (rowHover) {
			return ({ rowKeys }: { rowKeys: string[] }) => {
				throttle1(() => {
					setRowHoveredMap(() => {
						const next: Map<string, true> = new Map();
						for (let i = 0; i < rowKeys.length; i++) {
							next.set(rowKeys[i], true);
						}
						return next;
					});
				});
			};
		}
		return undefined;
	}, [rowHover]);

	const bodyRowMouseLeave = useMemo(() => {
		if (rowHover) {
			return ({ rowKeys }: { rowKeys: string[] }) => {
				throttle1(() => {
					setRowHoveredMap((old) => {
						let changed = false;
						for (let i = 0; i < rowKeys.length; i++) {
							if (old.get(rowKeys[i]) === true) {
								old.delete(rowKeys[i]);
								changed = true;
							}
						}
						if (changed) return new Map(old);
						return old;
					});
				});
			};
		}
		return undefined;
	}, [rowHover]);

	const bodyRowClick = useMemo(() => {
		if (rowClick) {
			return ({ rowKeys }: { rowKeys: string[] }) => {
				throttle2(() => {
					setRowClickedMap((old) => {
						let isSame = true;
						const next = new Map<string, true>();
						for (let i = 0; i < rowKeys.length; i++) {
							if (old.get(rowKeys[i]) !== true) isSame = false;
							next.set(rowKeys[i], true);
						}
						if (!isSame) return next;
						return new Map<string, true>();
					});
				});
			};
		}
		return undefined;
	}, [rowClick]);

	return { getBodyCellBg, getHeadCellBg, bodyRowMouseEnter, bodyRowMouseLeave, bodyRowClick };
};

export default useTableCellBg;
