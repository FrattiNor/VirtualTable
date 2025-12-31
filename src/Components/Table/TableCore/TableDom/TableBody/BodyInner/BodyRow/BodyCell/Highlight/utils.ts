import { findAll } from 'highlight-words-core';

const getKeywordIsEmpty = (keyword?: string | string[]) => {
	return Array.isArray(keyword)
		? keyword.length === 1
			? keyword[0] === '' || keyword[0] === undefined
			: keyword.length === 0
		: keyword === '' || keyword === undefined;
};

type Chunks = Array<{
	end: number;
	start: number;
	highlight: boolean;
}>;

// 获取高亮chunks
const getHighlightChunks = ({
	keyword,
	text,
	ignoreLowUp = true,
	ignoreSpace = true,
}: {
	keyword?: string | string[]; // 关键字
	text: string; // 文本
	ignoreLowUp?: boolean; // 忽略大小写
	ignoreSpace?: boolean; // 忽略空格
}) => {
	const keywordArray = Array.isArray(keyword)
		? keyword.map((k) => (ignoreSpace ? k.trim() : k))
		: typeof keyword === 'string'
			? [ignoreSpace ? keyword.trim() : keyword]
			: [];

	const chunks = findAll({
		autoEscape: true, // 自动转义
		caseSensitive: !ignoreLowUp, // 大小写敏感
		searchWords: keywordArray, // 关键字
		textToHighlight: text, // 文本
	}) as Chunks;

	return chunks;
};

// 获取是否被搜索到
const getSearched = ({
	keyword,
	text,
	ignoreLowUp = true,
	ignoreSpace = true,
}: {
	keyword?: string | string[]; // 关键字
	text: string; // 文本
	ignoreLowUp?: boolean; // 忽略大小写
	ignoreSpace?: boolean; // 忽略空格
}) => {
	const keywordIsEmpty = getKeywordIsEmpty(keyword);
	// 当关键字为空时，直接判断为true
	if (keywordIsEmpty) return true;
	// 当关键字等于文本时，直接判断为true
	if (keyword === text) return true;
	// 获取chunks
	const chunks = getHighlightChunks({ keyword, text, ignoreLowUp, ignoreSpace });
	// 当chunks长度为1时，直接返回highlight
	if (chunks.length === 1) return chunks[0].highlight;
	return chunks.length > 1;
};

export { getHighlightChunks, getSearched, getKeywordIsEmpty };
