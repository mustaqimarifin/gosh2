import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import mdx from 'eslint-plugin-mdx'
import eslint from '@eslint/js'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  prettier,
  {
    ...mdx.flat,
    // optional, if you want to lint code blocks at the same
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: false,
      // optional, if you want to disable language mapper, set it to `false`
      // if you want to override the default language mapper inside, you can provide your own
      languageMapper: {},
    }),
  },
  {
    rules: {
      'no-var': 0,
      'prefer-const': 0,
      'no-irregular-whitespace': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/no-dynamic-delete': 0,
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-require-imports': 0,
      '@typescript-eslint/ban-ts-comment': 0,
    },
  },
  {
    ignores: [
      '.next/**',
      '.contentlayer/**',
      'node_modules/**',
      'src/utils/unwrapImages.js',
      'src/content-copy/**',
      'src/components/Box.tsx',
      '.content-collections/**',
      'BaseEx.mjs',
      'test.*',
    ],
  }
)
