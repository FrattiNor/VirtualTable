import { createElement, type ReactNode } from 'react';

import { describe, it, expect } from 'vitest';

import type { TableCoreColumn, TableCoreColumnGroup } from '../TableTypes/typeColumn';
import type { TableCoreScrollbarState } from '../TableTypes/type';

import {
	getRowKey,
	getResize,
	isStrNum,
	getCellTitle,
	getLeafColumn,
	getNotLeafColumnByIndex,
	FixedTwo,
	transformWidthArrToStr,
	getDisplayNone,
	isEmptyRender,
	getScrollbarState,
} from './index';

describe('TableUtils/getRowKey', () => {
	type Item = { id: number; name: string };
	const item: Item = { id: 1, name: 'a' };

	it('当 rowKey 为字符串时，从对象读取对应字段', () => {
		expect(getRowKey<Item, number>('id', item)).toBe(1);
		expect(getRowKey<Item, string>('name', item)).toBe('a');
	});

	it('当 rowKey 为函数时，调用函数返回结果', () => {
		expect(
			getRowKey<Item, number>((row) => row.id * 10, item),
		).toBe(10);
	});

	it('当 item 为 undefined 或 null 时返回 undefined', () => {
		expect(getRowKey<Item, number>('id', undefined as unknown as Item)).toBeUndefined();
		expect(getRowKey<Item, number>('id', null as unknown as Item)).toBeUndefined();
	});
});

describe('TableUtils/getResize', () => {
	type T = Record<string, unknown>;
	const makeCol = (resize?: boolean): TableCoreColumn<T> => ({ key: 'k', title: 't', resize } as TableCoreColumn<T>);
	const makeGroup = (children: TableCoreColumn<T>[]): TableCoreColumnGroup<T> => ({ key: 'g', title: 'g', children });

	it('当所有列的 resize 不为 false 时返回 true', () => {
		const finalColumnsArr = [[makeCol(true)], [makeCol(undefined)]];
		expect(getResize<T>(finalColumnsArr, 0, 1)).toBe(true);
	});

	it('当存在列的 resize 为 false 时返回 false', () => {
		const finalColumnsArr = [[makeCol(false)], [makeCol(true)]];
		expect(getResize<T>(finalColumnsArr, 0, 1)).toBe(false);
	});

	it('当 colIndexStart > colIndexEnd 时循环不执行，返回 true', () => {
		const finalColumnsArr = [[makeCol(false)]];
		expect(getResize<T>(finalColumnsArr, 1, 0)).toBe(true);
	});

	it('当索引越界时跳过该列，仍返回 true', () => {
		const finalColumnsArr = [[makeCol(true)]];
		expect(getResize<T>(finalColumnsArr, 0, 5)).toBe(true);
	});

	it('当 group 的叶子列 resize 为 false 时返回 false', () => {
		const finalColumnsArr = [[makeCol(false), makeGroup([makeCol(true)])]];
		expect(getResize<T>(finalColumnsArr, 0, 0)).toBe(false);
	});
});

describe('TableUtils/isStrNum', () => {
	it('字符串返回 true', () => {
		expect(isStrNum('hello')).toBe(true);
	});
	it('数字返回 true', () => {
		expect(isStrNum(123)).toBe(true);
	});
	it('null 返回 false', () => {
		expect(isStrNum(null)).toBe(false);
	});
	it('对象返回 false', () => {
		expect(isStrNum({ a: 1 } as unknown as ReactNode)).toBe(false);
	});
});

describe('TableUtils/getCellTitle', () => {
	it('字符串直接返回 toString', () => {
		expect(getCellTitle('hello')).toBe('hello');
	});
	it('数字返回字符串', () => {
		expect(getCellTitle(123)).toBe('123');
	});
	it('当 React 元素的 children 为字符串时返回该字符串', () => {
		const el = createElement('span', null, 'title');
		expect(getCellTitle(el)).toBe('title');
	});
	it('当 React 元素的 children 为数字时返回字符串', () => {
		const el = createElement('span', null, 99);
		expect(getCellTitle(el)).toBe('99');
	});
	it('当 React 元素的 children 不是字符串或数字时返回 undefined', () => {
		const el = createElement('span', null, createElement('i', null, 'nested'));
		expect(getCellTitle(el)).toBeUndefined();
	});
	it('当为普通对象时返回 undefined', () => {
		expect(getCellTitle({ foo: 1 } as unknown as ReactNode)).toBeUndefined();
	});
});

describe('TableUtils/getLeafColumn', () => {
	type T = Record<string, unknown>;
	it('返回数组的第一项作为叶子列', () => {
		const leaf = { key: 'leaf', title: 'leaf' } as TableCoreColumn<T>;
		const group = { key: 'group', title: 'group' } as TableCoreColumnGroup<T>;
		expect(getLeafColumn<T>([leaf, group])).toBe(leaf);
	});
});

describe('TableUtils/getNotLeafColumnByIndex', () => {
	type T = Record<string, unknown>;
	const leaf = { key: 'leaf', title: 'leaf' } as TableCoreColumn<T>;
	const group1 = { key: 'g1', title: 'g1' } as TableCoreColumnGroup<T>;
	const group2 = { key: 'g2', title: 'g2' } as TableCoreColumnGroup<T>;

	it('index=0 时取数组最后一项（最上层父节点）', () => {
		expect(getNotLeafColumnByIndex<T>([leaf, group1, group2], 0)).toBe(group2);
	});
	it('index=length-1 时（指向叶子节点）返回 null', () => {
		expect(getNotLeafColumnByIndex<T>([leaf, group1, group2], 2)).toBeNull();
	});
	it('index=1 时返回倒数第二项', () => {
		expect(getNotLeafColumnByIndex<T>([leaf, group1, group2], 1)).toBe(group1);
	});
});

describe('TableUtils/FixedTwo', () => {
	it('整数原样返回', () => {
		expect(FixedTwo(10)).toBe(10);
	});
	it('小数向下截断到2位', () => {
		expect(FixedTwo(10.123)).toBe(10.12);
		expect(FixedTwo(10.1)).toBe(10.1);
	});
	it('小数位不足2位时按原值返回', () => {
		expect(FixedTwo(10.5)).toBe(10.5);
	});
});

describe('TableUtils/transformWidthArrToStr', () => {
	it('多个宽度拼接为 calc 表达式', () => {
		expect(transformWidthArrToStr(['10px', '20px'])).toBe('calc(10px + 20px)');
	});
	it('单个宽度也包裹 calc', () => {
		expect(transformWidthArrToStr(['0px'])).toBe('calc(0px)');
	});
	it('空数组返回 calc()', () => {
		expect(transformWidthArrToStr([])).toBe('calc()');
	});
});

describe('TableUtils/getDisplayNone', () => {
	it('所有字段为 0 时返回 true（display: none）', () => {
		const rect = { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0, toJSON: () => ({}) } as unknown as ResizeObserverEntry['contentRect'];
		expect(getDisplayNone(rect)).toBe(true);
	});
	it('任意字段非 0 时返回 false', () => {
		const rect = { bottom: 1, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0, toJSON: () => ({}) } as unknown as ResizeObserverEntry['contentRect'];
		expect(getDisplayNone(rect)).toBe(false);
	});
});

describe('TableUtils/isEmptyRender', () => {
	it('null 返回 true', () => expect(isEmptyRender(null)).toBe(true));
	it('undefined 返回 true', () => expect(isEmptyRender(undefined)).toBe(true));
	it('空字符串返回 true', () => expect(isEmptyRender('')).toBe(true));
	it('NaN 返回 true', () => expect(isEmptyRender(NaN)).toBe(true));
	it('非空字符串返回 false', () => expect(isEmptyRender('x')).toBe(false));
	it('有效数字返回 false', () => expect(isEmptyRender(0)).toBe(false));
	it('对象返回 false', () => expect(isEmptyRender({ a: 1 })).toBe(false));
});

describe('TableUtils/getScrollbarState', () => {
	it('当有滚动条且有边框时，widthArr 包含边框宽度', () => {
		const scrollbar: TableCoreScrollbarState = { have: true, width: 17 };
		const res = getScrollbarState(scrollbar, true);
		expect(res.widthArr).toEqual(['17px', 'var(--table-cell-border-width)']);
		expect(res.widthStr).toBe('calc(17px + var(--table-cell-border-width))');
		expect(res.have).toBe(true);
		expect(res.width).toBe(17);
	});
	it('当有滚动条但无边框时，widthArr 只含滚动条宽度', () => {
		const scrollbar: TableCoreScrollbarState = { have: true, width: 17 };
		const res = getScrollbarState(scrollbar, false);
		expect(res.widthArr).toEqual(['17px']);
	});
	it('当无滚动条时，widthArr 为 ["0px"]', () => {
		const scrollbar: TableCoreScrollbarState = { have: false, width: 0 };
		const res = getScrollbarState(scrollbar, true);
		expect(res.widthArr).toEqual(['0px']);
	});
	it('当 have=true 但 width=0 时按无滚动条处理', () => {
		const scrollbar: TableCoreScrollbarState = { have: true, width: 0 };
		const res = getScrollbarState(scrollbar, true);
		expect(res.widthArr).toEqual(['0px']);
	});
});
