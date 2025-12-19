import { type FC } from 'react';

import { getHighlightChunks, getKeywordIsEmpty } from './utils';

type Props = {
	children: string;
	keyword?: string | string[];
	ignoreLowUp?: boolean;
	highlightColor?: string;
	title?: string;
};

const Highlight: FC<Props> = ({ keyword, highlightColor, children, title, ignoreLowUp = true }) => {
	// 不是string或者是空字符串，直接返回
	if (typeof children !== 'string' || children === '') return children;
	// 关键字为空，直接返回
	const keywordIsEmpty = getKeywordIsEmpty(keyword);
	if (keywordIsEmpty) return children;

	const chunks = getHighlightChunks({
		keyword, // 关键字
		text: children, // 文本
		ignoreLowUp, // 大小写不敏感
	});

	return (
		<span title={title}>
			{chunks.map((chunk, index) => {
				const { end, highlight, start } = chunk;
				const text = children.substring(start, end);
				if (highlight) {
					return (
						<span key={index} style={{ color: highlightColor ?? 'var(--table-highlight-color)', fontWeight: 600 }}>
							{text}
						</span>
					);
				} else {
					return <span key={index}>{text}</span>;
				}
			})}
		</span>
	);
};

export default Highlight;
