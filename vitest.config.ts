import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts'],
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			include: ['src/TableComponents/**/*.{ts,tsx}'],
			exclude: ['src/TableComponents/**/*.module.less', 'src/TableComponents/**/type*.ts'],
		},
	},
});
