import { useCallback, useMemo, type CSSProperties } from 'react';

import { type RowKeyType, type TableCoreColumnFixed } from '../../TableTypes/type';
import { transformWidthArrToStr } from '../../TableUtils';

import type useTableColumns from '../useTableColumns';
import type useTableState from '../useTableState';

type Props<T, K, S> = {
	tableState: ReturnType<typeof useTableState<T, K, S>>;
	tableColumns: ReturnType<typeof useTableColumns<T, K, S>>;
};

// 表格左右固定
const useTableSticky = <T, K = RowKeyType, S = any>({ tableColumns, tableState }: Props<T, K, S>) => {
	const { vScrollbarState, pingedMap } = tableState;
	const { fixedLeftMap, fixedRightMap, colKey2Index, colIndex2Key } = tableColumns;

	// 根据pingedMap计算相关数据
	const { getPinged, pingedLeftStartKey, pingedLeftEndKey, pingedRightStartKey } = useMemo(() => {
		const getPinged = (fixed: TableCoreColumnFixed, key: string) => {
			return pingedMap.get(key)?.fixed === fixed;
		};

		let pingedLeftStartIndex: number | undefined = undefined;
		let pingedLeftEndIndex: number | undefined = undefined;
		let pingedRightStartIndex: number | undefined = undefined;
		let pingedRightEndIndex: number | undefined = undefined;

		pingedMap.forEach(({ key, fixed }) => {
			const index = colKey2Index.get(key);
			if (typeof index === 'number') {
				if (fixed === 'left') {
					if (pingedLeftStartIndex === undefined || index < pingedLeftStartIndex) pingedLeftStartIndex = index;
					if (pingedLeftEndIndex === undefined || index > pingedLeftEndIndex) pingedLeftEndIndex = index;
				}
				if (fixed === 'right') {
					if (pingedRightStartIndex === undefined || index < pingedRightStartIndex) pingedRightStartIndex = index;
					if (pingedRightEndIndex === undefined || index > pingedRightEndIndex) pingedRightEndIndex = index;
				}
			}
		});

		const pingedLeftStartKey = typeof pingedLeftStartIndex === 'number' ? colIndex2Key.get(pingedLeftStartIndex) : undefined;
		const pingedLeftEndKey = typeof pingedLeftEndIndex === 'number' ? colIndex2Key.get(pingedLeftEndIndex) : undefined;
		const pingedRightStartKey = typeof pingedRightStartIndex === 'number' ? colIndex2Key.get(pingedRightStartIndex) : undefined;
		// const pingedRightEndKey = typeof pingedRightEndIndex === 'number' ? colIndex2Key.get(pingedRightEndIndex) : undefined;

		return { getPinged, pingedLeftStartKey, pingedLeftEndKey, pingedRightStartKey };
	}, [pingedMap, colKey2Index, colIndex2Key]);

	const getBodyStickyStyle = useCallback(
		({ colKeys }: { colKeys: string[] }) => {
			let leftFirstPinged = false;
			let rightLastPinged = false;
			let leftLastPinged = false;
			let stickyStyle: CSSProperties = {};

			const startKey = colKeys[0];
			const endKey = colKeys[colKeys.length - 1];

			const fixedLeftValue = fixedLeftMap.get(startKey);
			if (fixedLeftValue) {
				const stickySize = fixedLeftValue.stickySize;
				stickyStyle = { transform: 'translate3d(0,0,0)', position: 'sticky', zIndex: 6, left: stickySize };
				leftFirstPinged = startKey === pingedLeftStartKey;
				leftLastPinged = endKey === pingedLeftEndKey;
				const pinged = getPinged('left', startKey);
				if (pinged) stickyStyle.zIndex = 11;
			}

			const fixedRightValue = fixedRightMap.get(endKey);
			if (fixedRightValue) {
				const stickySize = fixedRightValue.stickySize;
				stickyStyle = { transform: 'translate3d(0,0,0)', position: 'sticky', zIndex: 5, right: stickySize };
				rightLastPinged = startKey === pingedRightStartKey;
				const pinged = getPinged('right', endKey);
				if (pinged) stickyStyle.zIndex = 10;
			}

			const hiddenLeftBorder = leftFirstPinged || rightLastPinged;

			return { stickyStyle, hiddenLeftBorder, leftLastPinged, rightLastPinged };
		},
		[fixedLeftMap, fixedRightMap, getPinged, pingedLeftStartKey, pingedRightStartKey, pingedLeftEndKey],
	);

	const getHeadStickyStyle = useCallback(
		({ colKeys }: { colKeys: string[] }) => {
			let leftFirstPinged = false;
			let rightLastPinged = false;
			let leftLastPinged = false;
			let stickyStyle: CSSProperties = {};

			const startKey = colKeys[0];
			const endKey = colKeys[colKeys.length - 1];

			const fixedLeftValue = fixedLeftMap.get(startKey);
			if (fixedLeftValue) {
				const stickySize = fixedLeftValue.stickySize;
				stickyStyle = { transform: 'translate3d(0,0,0)', position: 'sticky', zIndex: 6, left: stickySize };
				leftFirstPinged = startKey === pingedLeftStartKey;
				leftLastPinged = endKey === pingedLeftEndKey;
				const pinged = getPinged('left', startKey);
				if (pinged) stickyStyle.zIndex = 11;
			}

			const fixedRightValue = fixedRightMap.get(endKey);
			if (fixedRightValue) {
				const stickySize = fixedRightValue.stickySize;
				stickyStyle = {
					transform: 'translate3d(0,0,0)',
					position: 'sticky',
					zIndex: 5,
					right: !vScrollbarState.have ? stickySize : transformWidthArrToStr([...vScrollbarState.widthArr, `${stickySize}px`]),
				};
				rightLastPinged = startKey === pingedRightStartKey;
				const pinged = getPinged('right', endKey);
				if (pinged) stickyStyle.zIndex = 10;
			}

			const hiddenLeftBorder = leftFirstPinged || rightLastPinged;

			return { stickyStyle, hiddenLeftBorder, leftLastPinged, rightLastPinged };
		},
		[vScrollbarState, fixedLeftMap, fixedRightMap, getPinged, pingedLeftStartKey, pingedRightStartKey],
	);

	return { getBodyStickyStyle, getHeadStickyStyle };
};

export default useTableSticky;
