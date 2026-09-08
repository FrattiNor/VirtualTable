import { describe, it, expect } from 'vitest';

import type { VirtualState } from './type';

import { getSizeList, binarySearch, getEmptyState } from './utils';

describe('VirtualCoreUtils/getEmptyState', () => {
	it('返回所有字段为 null 的初始 state', () => {
		const state: VirtualState<string> = getEmptyState<string>();
		expect(state.sizeList).toBeNull();
		expect(state.rangeStart).toBeNull();
		expect(state.rangeEnd).toBeNull();
		expect(state.totalSize).toBeNull();
		expect(state.containerSize).toBeNull();
		expect(state.scrollOffset).toBe(0);
	});
});

describe('VirtualCoreUtils/getSizeList', () => {
	it('无 gap 时按顺序生成 sizeList，start/end 连续', () => {
		const list = getSizeList<string>({
			count: 3,
			gap: {},
			getItemKey: (i) => `k${i}`,
			getItemSize: () => 50,
		});
		expect(list).toHaveLength(3);
		// 第一项
		expect(list[0]).toEqual({ key: 'k0', index: 0, size: 50, start: 0, end: 50, nextStart: 50 });
		// 第二项（itemGap 默认 0）
		expect(list[1]).toEqual({ key: 'k1', index: 1, size: 50, start: 50, end: 100, nextStart: 100 });
		// 第三项
		expect(list[2]).toEqual({ key: 'k2', index: 2, size: 50, start: 100, end: 150, nextStart: 150 });
	});

	it('startGap/endGap/itemGap 生效', () => {
		const list = getSizeList<number>({
			count: 2,
			gap: { startGap: 10, endGap: 5, itemGap: 2 },
			getItemKey: (i) => i,
			getItemSize: () => 50,
		});
		// 第一项 start=startGap
		expect(list[0].start).toBe(10);
		expect(list[0].end).toBe(60);
		// nextStart = end + itemGap（非最后一项）
		expect(list[0].nextStart).toBe(62);
		// 第二项 start = 上一项 end + itemGap
		expect(list[1].start).toBe(62);
		expect(list[1].end).toBe(112);
		// 最后一项 nextStart = end + endGap
		expect(list[1].nextStart).toBe(117);
	});

	it('支持不同 size 的项', () => {
		const list = getSizeList<string>({
			count: 3,
			gap: {},
			getItemKey: (i) => `k${i}`,
			getItemSize: (i) => (i + 1) * 10,
		});
		expect(list[0].size).toBe(10);
		expect(list[1].size).toBe(20);
		expect(list[2].size).toBe(30);
		expect(list[2].end).toBe(60);
	});

	it('count 为 0 时返回空数组', () => {
		const list = getSizeList<string>({
			count: 0,
			gap: {},
			getItemKey: (i) => `k${i}`,
			getItemSize: () => 50,
		});
		expect(list).toEqual([]);
	});

	it('自定义 keyName 不影响返回结构', () => {
		const list = getSizeList<string>({
			count: 1,
			gap: {},
			keyName: 'rowKey',
			getItemKey: () => 'unique',
			getItemSize: () => 10,
		});
		expect(list[0].key).toBe('unique');
	});
});

describe('VirtualCoreUtils/binarySearch', () => {
	// 构造一个递增的尺寸函数：[10, 30, 60, 100, 150]
	const sizes = [10, 30, 60, 100, 150];
	const getSize = (i: number) => sizes[i];

	it('target 命中某一项时返回 [mid, mid]', () => {
		// 命中索引 2，值为 60
		expect(binarySearch({ target: 60, getSize, startIndex: 0, endIndex: 4 })).toEqual([2, 2]);
	});

	it('target 小于所有项时返回 [start, ...] 的边界', () => {
		// target=5 小于 sizes[0]=10，最终 left=0,right=-1，返回 [right, left] = [-1, 0]
		expect(binarySearch({ target: 5, getSize, startIndex: 0, endIndex: 4 })).toEqual([-1, 0]);
	});

	it('target 大于所有项时返回 [end, ...] 的边界', () => {
		// target=200 大于 sizes[4]=150，最终 left=5,right=4，返回 [right, left] = [4, 5]
		expect(binarySearch({ target: 200, getSize, startIndex: 0, endIndex: 4 })).toEqual([4, 5]);
	});

	it('target 落在两项之间时返回相邻左右索引', () => {
		// target=40 落在 30 与 60 之间
		expect(binarySearch({ target: 40, getSize, startIndex: 0, endIndex: 4 })).toEqual([1, 2]);
	});

	it('在子区间内进行二分查找', () => {
		// 只在索引 1..3 中查找 60
		expect(binarySearch({ target: 60, getSize, startIndex: 1, endIndex: 3 })).toEqual([2, 2]);
	});

	it('startIndex === endIndex 且命中时返回 [mid, mid]', () => {
		// 仅一项 sizes[2]=60，target 命中
		expect(binarySearch({ target: 60, getSize, startIndex: 2, endIndex: 2 })).toEqual([2, 2]);
	});

	it('startIndex === endIndex 且 target 小于该项时返回相邻左索引', () => {
		// 仅一项 sizes[2]=60，target=50 小于 60，循环结束后 left=2,right=1，返回 [1, 2]
		expect(binarySearch({ target: 50, getSize, startIndex: 2, endIndex: 2 })).toEqual([1, 2]);
	});
});
