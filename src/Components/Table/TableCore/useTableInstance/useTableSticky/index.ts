import { useCallback, useMemo, type CSSProperties } from 'react';

import { type TableCoreColumnFixed } from '../../TableTypes/type';
import { transformWidthArrToStr } from '../../TableUtils';

import type useTableColumns from '../useTableColumns';
import type useTableState from '../useTableState';

type Props<T> = {
	tableState: ReturnType<typeof useTableState>;
	tableColumns: ReturnType<typeof useTableColumns<T>>;
};

// 表格左右固定
const useTableSticky = <T>({ tableColumns, tableState }: Props<T>) => {
	const { v_scrollbar, pingedMap } = tableState;
	const { fixedLeftMap, fixedRightMap, colKey2Index, colIndex2Key } = tableColumns;

	// 根据pingedMap计算相关数据
	const { getPinged, pingedLeftStart, pingedLeftEnd, pingedRightStart } = useMemo(() => {
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

		const pingedLeftStart = typeof pingedLeftStartIndex === 'number' ? colIndex2Key.get(pingedLeftStartIndex) : undefined;
		const pingedLeftEnd = typeof pingedLeftEndIndex === 'number' ? colIndex2Key.get(pingedLeftEndIndex) : undefined;
		const pingedRightStart = typeof pingedRightStartIndex === 'number' ? colIndex2Key.get(pingedRightStartIndex) : undefined;
		const pingedRightEnd = typeof pingedRightEndIndex === 'number' ? colIndex2Key.get(pingedRightEndIndex) : undefined;

		return { getPinged, pingedLeftStart, pingedLeftEnd, pingedRightStart, pingedRightEnd };
	}, [pingedMap, colKey2Index, colIndex2Key]);

	const getBodyStickyStyle = useCallback(
		({ colKeys }: { colKeys: string[] }) => {
			let leftLastPinged = false;
			let leftFirstPinged = false;
			let rightLastPinged = false;
			let stickyStyle: CSSProperties = {};

			const startKey = colKeys[0];
			const endKey = colKeys[colKeys.length - 1];

			const fixedLeftValue = fixedLeftMap.get(startKey);
			if (fixedLeftValue) {
				const stickySize = fixedLeftValue.stickySize;
				stickyStyle = { transform: 'translate3d(0,0,0)', position: 'sticky', zIndex: 6, left: stickySize };
				leftFirstPinged = startKey === pingedLeftStart;
				leftLastPinged = endKey === pingedLeftEnd;
				const pinged = getPinged('left', startKey);
				if (pinged) stickyStyle.zIndex = 11;
			}

			const fixedRightValue = fixedRightMap.get(endKey);
			if (fixedRightValue) {
				const stickySize = fixedRightValue.stickySize;
				stickyStyle = { transform: 'translate3d(0,0,0)', position: 'sticky', zIndex: 5, right: stickySize };
				rightLastPinged = startKey === pingedRightStart;
				const pinged = getPinged('right', endKey);
				if (pinged) stickyStyle.zIndex = 10;
			}

			return { stickyStyle, leftLastPinged, leftFirstPinged, rightLastPinged };
		},
		[fixedLeftMap, fixedRightMap, getPinged, pingedLeftEnd, pingedLeftStart, pingedRightStart],
	);

	const getHeadStickyStyle = useCallback(
		({ colKeys }: { colKeys: string[] }) => {
			let leftLastPinged = false;
			let leftFirstPinged = false;
			let rightLastPinged = false;
			let stickyStyle: CSSProperties = {};

			const startKey = colKeys[0];
			const endKey = colKeys[colKeys.length - 1];

			const fixedLeftValue = fixedLeftMap.get(startKey);
			if (fixedLeftValue) {
				const stickySize = fixedLeftValue.stickySize;
				stickyStyle = { transform: 'translate3d(0,0,0)', position: 'sticky', zIndex: 6, left: stickySize };
				leftFirstPinged = startKey === pingedLeftStart;
				leftLastPinged = endKey === pingedLeftEnd;
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
					right: !v_scrollbar.have ? stickySize : transformWidthArrToStr([...v_scrollbar.widthArr, `${stickySize}px`]),
				};
				rightLastPinged = startKey === pingedRightStart;
				const pinged = getPinged('right', endKey);
				if (pinged) stickyStyle.zIndex = 10;
			}

			return { stickyStyle, leftLastPinged, leftFirstPinged, rightLastPinged };
		},
		[v_scrollbar, fixedLeftMap, fixedRightMap, getPinged, pingedLeftEnd, pingedLeftStart, pingedRightStart],
	);

	return { getBodyStickyStyle, getHeadStickyStyle };
};

export default useTableSticky;
