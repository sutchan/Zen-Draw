import next from 'eslint-config-next'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import security from 'eslint-plugin-security'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

/** @type {import('eslint').Linter.FlatConfig[]} */

export default [
  // ─── 基础 Next.js 规则 ───
  ...next,

  // ─── 全局设置 ───
  {
    name: 'global-settings',
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  // ─── TypeScript 严格规则 ───
  ...tseslint.configs.strict,
  {
    name: 'typescript-rules',
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // 禁止 any（允许在必要时用 // eslint-disable 临时跳过）
      '@typescript-eslint/no-explicit-any': 'warn',
      // 禁止 non-null 断言（强制处理空值）
      '@typescript-eslint/no-non-null-assertion': 'error',
      // 禁止未使用的变量
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // 要求显式返回值类型（对公共 API 函数）
      '@typescript-eslint/explicit-function-return-type': 'off',
      // 鼓励使用 type 而不是 interface（项目约定）
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },

  // ─── React & Hooks 规则 ───
  {
    name: 'react-rules',
    files: ['**/*.{tsx,ts}'],
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // React Hooks 依赖检查（严格）
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // 无障碍 — 警告级别（不阻碍开发，但提醒）
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/tabindex-no-positive': 'error',

      // React 最佳实践
      'react/no-unescaped-entities': 'off',
      'react/self-closing-comp': 'warn',
      'react/jsx-curly-brace-presence': ['warn', 'never'],
    },
  },

  // ─── 安全规则 ───
  {
    name: 'security-rules',
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      security: security,
    },
    rules: {
      // 禁止 eval（安全风险）
      'no-eval': 'error',
      // 禁止 new Function（代码注入风险）
      'no-new-func': 'error',
      // 警告 Math.random() 的使用（我们的项目需要密码学安全随机）
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'CallExpression[callee.object.name="Math"][callee.property.name="random"]',
          message: '避免使用 Math.random()，请使用 crypto.getRandomValues() 以保证随机性质量。',
        },
      ],
    },
  },

  // ─── 代码质量规则 ───
  {
    name: 'code-quality-rules',
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // 禁止 console.log（允许 console.warn 和 console.error）
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 禁止 debugger
      'no-debugger': 'error',
      // 禁止 var（使用 const/let）
      'no-var': 'error',
      // 鼓励 const（优先使用 const）
      'prefer-const': 'warn',
      // 未使用的导入自动移除（配合 lint-staged 自动修复）
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // ─── 开发环境忽略规则 ───
  {
    name: 'dev-ignores',
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '**/*.config.{js,ts,mjs}',
      '**/*.stories.{tsx,ts}',
      '.github/**',
    ],
  },
]
