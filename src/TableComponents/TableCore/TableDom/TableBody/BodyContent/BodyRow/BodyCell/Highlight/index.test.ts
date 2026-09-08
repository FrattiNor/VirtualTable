import { describe, it, expect } from 'vitest';

import { getHighlightChunks, getSearched, getKeywordIsEmpty } from './utils';

describe('HighlightUtils/getKeywordIsEmpty', () => {
	it('空字符串返回 true', () => {
		expect(getKeywordIsEmpty('')).toBe(true);
	});
	it('undefined 返回 true', () => {
		expect(getKeywordIsEmpty(undefined)).toBe(true);
	});
	it('非空字符串返回 false', () => {
		expect(getKeywordIsEmpty('hello')).toBe(false);
	});
	it('空数组返回 true', () => {
		expect(getKeywordIsEmpty([])).toBe(true);
	});
	it('只有一个空字符串元素的数组返回 true', () => {
		expect(getKeywordIsEmpty([''])).toBe(true);
	});
	it('只有一个 undefined 元素的数组返回 true', () => {
		expect(getKeywordIsEmpty([undefined as unknown as string])).toBe(true);
	});
	it('包含非空字符串的数组返回 false', () => {
		expect(getKeywordIsEmpty(['a'])).toBe(false);
		expect(getKeywordIsEmpty(['a', 'b'])).toBe(false);
	});
});

describe('HighlightUtils/getHighlightChunks', () => {
	it('关键字为空字符串时不产生高亮 chunk', () => {
		const chunks = getHighlightChunks({ keyword: '', text: 'hello' });
		// 只有一个非高亮 chunk
		expect(chunks).toHaveLength(1);
		expect(chunks[0].highlight).toBe(false);
		expect(chunks[0].start).toBe(0);
		expect(chunks[0].end).toBe(5);
	});

	it('能匹配关键字并返回高亮 chunk', () => {
		const chunks = getHighlightChunks({ keyword: 'ell', text: 'hello' });
		const highlightChunks = chunks.filter((c) => c.highlight);
		expect(highlightChunks).toHaveLength(1);
		expect(highlightChunks[0].start).toBe(1);
		expect(highlightChunks[0].end).toBe(4);
	});

	it('默认忽略大小写', () => {
		const chunks = getHighlightChunks({ keyword: 'HEL', text: 'hello' });
		const highlightChunks = chunks.filter((c) => c.highlight);
		expect(highlightChunks).toHaveLength(1);
		expect(highlightChunks[0].start).toBe(0);
		expect(highlightChunks[0].end).toBe(3);
	});

	it('设置 ignoreLowUp=false 时大小写敏感', () => {
		const chunks = getHighlightChunks({ keyword: 'HEL', text: 'hello', ignoreLowUp: false });
		const highlightChunks = chunks.filter((c) => c.highlight);
		expect(highlightChunks).toHaveLength(0);
	});

	it('默认忽略关键字首尾空格', () => {
		const chunks = getHighlightChunks({ keyword: ' ell ', text: 'hello' });
		const highlightChunks = chunks.filter((c) => c.highlight);
		expect(highlightChunks).toHaveLength(1);
		expect(highlightChunks[0].start).toBe(1);
	});

	it('设置 ignoreSpace=false 时不忽略空格', () => {
		const chunks = getHighlightChunks({ keyword: ' ell ', text: 'h ell o', ignoreSpace: false });
		const highlightChunks = chunks.filter((c) => c.highlight);
		expect(highlightChunks).toHaveLength(1);
	});

	it('支持多关键字数组（不重叠时各自产生高亮 chunk）', () => {
		// 'he' 匹配 0-2，'lo' 匹配 3-5，两者不重叠
		const chunks = getHighlightChunks({ keyword: ['he', 'lo'], text: 'hello' });
		const highlightChunks = chunks.filter((c) => c.highlight);
		expect(highlightChunks).toHaveLength(2);
		expect(highlightChunks[0].start).toBe(0);
		expect(highlightChunks[1].start).toBe(3);
	});

	it('多关键字重叠时合并为一个高亮 chunk', () => {
		// 'ell' 匹配 1-4，'lo' 匹配 3-5，重叠区域合并
		const chunks = getHighlightChunks({ keyword: ['ell', 'lo'], text: 'hello' });
		const highlightChunks = chunks.filter((c) => c.highlight);
		expect(highlightChunks).toHaveLength(1);
		expect(highlightChunks[0].start).toBe(1);
		expect(highlightChunks[0].end).toBe(5);
	});

	it('关键字为 undefined 时按空处理', () => {
		const chunks = getHighlightChunks({ keyword: undefined, text: 'hello' });
		expect(chunks).toHaveLength(1);
		expect(chunks[0].highlight).toBe(false);
	});

	it('autoEscape 转义正则特殊字符', () => {
		// 关键字包含 . 应当作为字面量匹配，而非任意字符
		const chunks = getHighlightChunks({ keyword: '.', text: 'a.b' });
		const highlightChunks = chunks.filter((c) => c.highlight);
		expect(highlightChunks).toHaveLength(1);
		expect(highlightChunks[0].start).toBe(1);
		expect(highlightChunks[0].end).toBe(2);
	});
});

describe('HighlightUtils/getSearched', () => {
	it('关键字为空时返回 true', () => {
		expect(getSearched({ keyword: '', text: 'hello' })).toBe(true);
		expect(getSearched({ keyword: undefined, text: 'hello' })).toBe(true);
		expect(getSearched({ keyword: [], text: 'hello' })).toBe(true);
	});

	it('关键字与文本完全相等时返回 true', () => {
		expect(getSearched({ keyword: 'hello', text: 'hello' })).toBe(true);
	});

	it('文本包含关键字时返回 true', () => {
		expect(getSearched({ keyword: 'ell', text: 'hello' })).toBe(true);
	});

	it('文本不包含关键字时返回 false', () => {
		expect(getSearched({ keyword: 'xyz', text: 'hello' })).toBe(false);
	});

	it('默认忽略大小写匹配', () => {
		expect(getSearched({ keyword: 'HEL', text: 'hello' })).toBe(true);
	});

	it('设置 ignoreLowUp=false 时大小写敏感', () => {
		expect(getSearched({ keyword: 'HEL', text: 'hello', ignoreLowUp: false })).toBe(false);
	});

	it('支持多关键字，任一匹配即返回 true', () => {
		expect(getSearched({ keyword: ['xyz', 'ell'], text: 'hello' })).toBe(true);
		expect(getSearched({ keyword: ['xyz', 'abc'], text: 'hello' })).toBe(false);
	});
});
