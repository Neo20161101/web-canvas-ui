// ESLint configuration for webcanvasui.
// Uses eslint 8 eslintrc format with the typescript-eslint recommended (non-type-aware) ruleset.
// `prettier` must stay last in `extends` so it disables stylistic rules that Prettier owns.
module.exports = {
    root: true,
    env: {
        browser: true,
        es2023: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    ignorePatterns: ['dist/', 'node_modules/', '*.min.js'],
    overrides: [
        {
            // Node-side config/scripts run outside the browser bundle.
            files: ['.eslintrc.cjs', '*.cjs'],
            env: { node: true, browser: false },
        },
    ],
    rules: {
        // Allow `_`-prefixed names to signal intentionally unused args/vars.
        '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
        ],
    },
};
