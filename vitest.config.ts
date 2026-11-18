import { defineConfig } from 'vitest/config';

// The library's core logic is framework- and DOM-agnostic pure functions,
// so the default test environment is `node` (no jsdom needed).
export default defineConfig({
    test: {
        environment: 'node',
        globals: false,
        include: ['src/**/__tests__/**/*.test.ts'],
    },
});
