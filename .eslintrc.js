module.exports = {
    env: {
      node: true,
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'prettier'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      project: './tsconfig.json',
    },
    plugins: [
      '@typescript-eslint',
    ],
    rules: {
      "semi": "off",
      "@typescript-eslint/semi": ["error"],
    },
  };
  