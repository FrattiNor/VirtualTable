import type { VirtualProps, VirtualSizeListItem, VirtualState } from './type';

export const getSizeList = ({
	gap,
	count,
	keyName,
	getItemKey,
	getItemSize,
}: {
	count: number;
	gap: VirtualProps['gap'];
	getItemKey: VirtualProps['getItemKey'];
	getItemSize: VirtualProps['getItemSize'];
	keyName?: string;
}) => {
	// 检测重复的rowKey
	const rowKeysMap = new Map<string, number>();
	const checkSameKey = (key: string) => {
		if (rowKeysMap.get(key) === 1) console.error(`same ${keyName ?? 'key'}: ${key}`);
		rowKeysMap.set(key, (rowKeysMap.get(key) ?? 0) + 1);
	};

	const { itemGap = 0, startGap = 0, endGap = 0 } = gap ?? {};
	const sizeList: Array<VirtualSizeListItem> = [];
	for (let index = 0; index < count; index++) {
		const key = getItemKey(index);
		const size = getItemSize(index);
		const beforeItem = sizeList[index - 1];
		const beforeEnd = beforeItem?.end ?? 0;
		const start = index === 0 ? startGap : beforeEnd + itemGap;
		const end = start + size;
		const nextStart = index === count - 1 ? end + endGap : end + itemGap;
		checkSameKey(key);
		sizeList.push({ key, size, index, start, end, nextStart });
	}
	return sizeList;
};

/**
 * 二分查找方法
 * @param target 要查找的值
 * @param getSize 获取数组中的值
 * @param startIndex 开始索引
 * @param endIndex 结束索引
 * @returns 最接近的左右索引
 */

type BinarySearchProps = {
	target: number;
	getSize: (index: number) => number;
	startIndex: number;
	endIndex: number;
};

export function binarySearch({ target, getSize, startIndex, endIndex }: BinarySearchProps): [number, number] {
	let left = startIndex;
	let right = endIndex;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		if (getSize(mid) === target) {
			return [mid, mid];
		} else if (getSize(mid) < target) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	// 没有找到
	return left < right ? [left, right] : [right, left];
}

export const getEmptyState = (): VirtualState => ({
	sizeList: null,
	rangeStart: null,
	rangeEnd: null,
	totalSize: null,
	containerSize: null,
	scrollOffset: 0,
});
