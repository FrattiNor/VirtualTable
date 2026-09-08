import { describe, it, expect } from 'vitest';

import { getSummaryRenderDom } from './utils';

describe('SummaryCellUtils/getSummaryRenderDom', () => {
	type Summary = { total: number };

	it('当 summaryRender 为函数时调用并返回结果', () => {
		const summaryRender = (data: Summary) => `total:${data.total}`;
		expect(
			getSummaryRenderDom<Summary>({
				summaryRender,
				itemData: { total: 100 },
				index: 0,
			}),
		).toBe('total:100');
	});

	it('当 summaryRender 为函数时传入 index', () => {
		const summaryRender = (_data: Summary, ctx: { index: number }) => `idx:${ctx.index}`;
		expect(
			getSummaryRenderDom<Summary>({
				summaryRender,
				itemData: { total: 100 },
				index: 3,
			}),
		).toBe('idx:3');
	});

	it('当 summaryRender 为 undefined 时返回 "-"', () => {
		expect(
			getSummaryRenderDom<Summary>({
				summaryRender: undefined,
				itemData: { total: 100 },
				index: 0,
			}),
		).toBe('-');
	});

	it('当 summaryRender 返回 null 时用 "-" 替换', () => {
		const summaryRender = () => null;
		expect(
			getSummaryRenderDom<Summary>({
				summaryRender,
				itemData: { total: 100 },
				index: 0,
			}),
		).toBe('-');
	});

	it('当 summaryRender 返回 undefined 时用 "-" 替换', () => {
		const summaryRender = () => undefined;
		expect(
			getSummaryRenderDom<Summary>({
				summaryRender,
				itemData: { total: 100 },
				index: 0,
			}),
		).toBe('-');
	});

	it('当 summaryRender 返回空字符串时用 "-" 替换', () => {
		const summaryRender = () => '';
		expect(
			getSummaryRenderDom<Summary>({
				summaryRender,
				itemData: { total: 100 },
				index: 0,
			}),
		).toBe('-');
	});

	it('当 summaryRender 返回 NaN 时用 "-" 替换', () => {
		const summaryRender = () => NaN;
		expect(
			getSummaryRenderDom<Summary>({
				summaryRender,
				itemData: { total: 100 },
				index: 0,
			}),
		).toBe('-');
	});

	it('当 summaryRender 返回 0 时保留 0（非空值）', () => {
		const summaryRender = () => 0;
		expect(
			getSummaryRenderDom<Summary>({
				summaryRender,
				itemData: { total: 100 },
				index: 0,
			}),
		).toBe(0);
	});
});
