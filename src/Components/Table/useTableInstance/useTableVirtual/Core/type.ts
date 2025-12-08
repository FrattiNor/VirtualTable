// 对外
export interface VirtualProps {
	// 启用
	enabled?: boolean;
	// 数量
	count: number;
	// 上下冗余【注意Memo】
	overscan?: [number, number];
	// 间隔
	gap?: { itemGap?: number; startGap?: number; endGap?: number };
	// 【注意Memo】
	getItemKey: (index: number) => string;
	// 【注意Memo】
	getItemSize: (index: number) => number;
	// range变更、totalSize变更、scrollOffset变更 触发
	onChange?: (arg: {
		range: { start: number | null; end: number | null; isScroll: boolean };
		containerSize: number | null;
		totalSize: number | null;
		scrollOffset: number;
	}) => void;
}

// 对内
export interface VirtualInnerProps extends VirtualProps {
	// 启用
	enabled: boolean;
}

export type VirtualSizeListItem = { key: string; index: number; start: number; end: number; size: number; nextStart: number };

export type VirtualState = {
	totalSize: number | null;
	scrollOffset: number;
	containerSize: number | null;
	sizeList: Array<VirtualSizeListItem> | null;
	rangeStart: number | null;
	rangeEnd: number | null;
};
