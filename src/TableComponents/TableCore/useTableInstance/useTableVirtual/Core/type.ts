export type Key = string | number;

// 对外
export interface VirtualProps<K extends Key = Key> {
	// 校验是否存在重复的key【使用的报错提示名】
	keyName?: string;
	// 启用
	enabled?: boolean;
	// 数量
	count: number;
	// 上下冗余【注意Memo】
	overscan?: [number, number];
	// 间隔
	gap?: { itemGap?: number; startGap?: number; endGap?: number };
	// 【注意Memo】
	getItemKey: (index: number) => K;
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

export type VirtualSizeListItem<K extends Key = Key> = { key: K; index: number; start: number; end: number; size: number; nextStart: number };

export type VirtualState<K extends Key = Key> = {
	totalSize: number | null;
	scrollOffset: number;
	containerSize: number | null;
	sizeList: Array<VirtualSizeListItem<K>> | null;
	rangeStart: number | null;
	rangeEnd: number | null;
};
