import { useState, useCallback } from 'react';

export const useHighlightState = () => {
	const [highlightKeywords, setHighlightKeywords] = useState<string[]>([]);
	const [highlightInput, setHighlightInput] = useState('');

	const handleHighlightSearch = useCallback(() => {
		if (highlightInput.trim()) {
			setHighlightKeywords([highlightInput.trim()]);
		} else {
			setHighlightKeywords([]);
		}
	}, [highlightInput]);

	const clearHighlight = useCallback(() => {
		setHighlightKeywords([]);
		setHighlightInput('');
	}, []);

	return {
		highlightKeywords,
		setHighlightKeywords,
		highlightInput,
		setHighlightInput,
		handleHighlightSearch,
		clearHighlight,
	};
};
