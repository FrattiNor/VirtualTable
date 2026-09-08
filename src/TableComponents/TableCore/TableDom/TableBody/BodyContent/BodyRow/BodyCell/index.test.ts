import { describe, it, expect } from 'vitest';

import { getMergeHighlightKeywords, getRenderDom } from './utils';

describe('BodyCellUtils/getMergeHighlightKeywords', () => {
	it('两个 undefined 时返回空数组', () => {
		expect(getMergeHighlightKeywords(undefined, undefined)).toEqual([]);
	});

	it('其中一个为 undefined 时返回另一个的副本', () => {
		expect(getMergeHighlightKeywords(['a'], undefined)).toEqual(['a']);
		expect(getMergeHighlightKeywords(undefined, ['b'])).toEqual(['b']);
	});

	it('合并两组关键字保持顺序', () => {
		expect(getMergeHighlightKeywords(['a', 'b'], ['c'])).toEqual(['a', 'b', 'c']);
	});

	it('返回的是新数组，不引用原数组', () => {
		const a = ['a'];
		const b = ['b'];
		const merged = getMergeHighlightKeywords(a, b);
		expect(merged).not.toBe(a);
		expect(merged).not.toBe(b);
		merged.push('c');
		expect(a).toEqual(['a']);
		expect(b).toEqual(['b']);
	});
});

describe('BodyCellUtils/getRenderDom', () => {
	type Item = { name: string; age: number };

	it('当 render 为函数时调用 render 返回结果', () => {
		const render = (data: Item) => `name:${data.name}`;
		expect(
			getRenderDom<Item>({
				colKey: 'name',
				render,
				itemData: { name: 'tom', age: 18 },
				index: 0,
				highlightKeywords: undefined,
			}),
		).toBe('name:tom');
	});

	it('当 render 为函数时传入 index 与 highlightKeywords', () => {
		const render = (_data: Item, ctx: { index: number; highlightKeywords?: string[] }) => `${ctx.index}:${ctx.highlightKeywords?.join(',')}`;
		expect(
			getRenderDom<Item>({
				colKey: 'name',
				render,
				itemData: { name: 'tom', age: 18 },
				index: 2,
				highlightKeywords: ['a', 'b'],
			}),
		).toBe('2:a,b');
	});

	it('当 render 为 undefined 时取 itemData 对应 colKey 字段', () => {
		expect(
			getRenderDom<Item>({
				colKey: 'name',
				render: undefined,
				itemData: { name: 'jerry', age: 18 },
				index: 0,
				highlightKeywords: undefined,
			}),
		).toBe('jerry');
	});

	it('当 render 返回 null 时用 "-" 替换', () => {
		const render = () => null;
		expect(
			getRenderDom<Item>({
				colKey: 'name',
				render,
				itemData: { name: 'tom', age: 18 },
				index: 0,
				highlightKeywords: undefined,
			}),
		).toBe('-');
	});

	it('当 render 返回 undefined 时用 "-" 替换', () => {
		const render = () => undefined;
		expect(
			getRenderDom<Item>({
				colKey: 'name',
				render,
				itemData: { name: 'tom', age: 18 },
				index: 0,
				highlightKeywords: undefined,
			}),
		).toBe('-');
	});

	it('当 render 返回空字符串时用 "-" 替换', () => {
		const render = () => '';
		expect(
			getRenderDom<Item>({
				colKey: 'name',
				render,
				itemData: { name: 'tom', age: 18 },
				index: 0,
				highlightKeywords: undefined,
			}),
		).toBe('-');
	});

	it('当 render 返回 NaN 时用 "-" 替换', () => {
		const render = () => NaN;
		expect(
			getRenderDom<Item>({
				colKey: 'name',
				render,
				itemData: { name: 'tom', age: 18 },
				index: 0,
				highlightKeywords: undefined,
			}),
		).toBe('-');
	});

	it('当 render 返回 0 时保留 0（非空值）', () => {
		const render = () => 0;
		expect(
			getRenderDom<Item>({
				colKey: 'name',
				render,
				itemData: { name: 'tom', age: 18 },
				index: 0,
				highlightKeywords: undefined,
			}),
		).toBe(0);
	});

	it('当无 render 且字段值为空时用 "-" 替换', () => {
		expect(
			getRenderDom<Item>({
				colKey: 'name',
				render: undefined,
				itemData: { name: '', age: 18 },
				index: 0,
				highlightKeywords: undefined,
			}),
		).toBe('-');
	});
});
