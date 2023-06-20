module.exports = {
  root: true,
  extends: ['@react-native-community'],
  plugins: ['import', 'cypress'],
  env: {'cypress/globals': true},
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'import/order': ['warn', {alphabetize: {order: 'asc'}}], // group and then alphabetize lines - https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
    'jest/no-focused-tests': 'error',
    'jest/valid-expect': 'off',
    'no-duplicate-imports': 'error',
    quotes: ['error', 'single', {avoidEscape: true}], // single quote unless using interpolation
    'react/jsx-uses-react': 'off',
    'react/no-unstable-nested-components': ['warn', {allowAsProps: true}], // allow function props that return components
    'react/react-in-jsx-scope': 'off',
    'sort-imports': [
      'warn',
      {ignoreDeclarationSort: true, ignoreMemberSort: false},
    ], // alphabetize named imports - https://eslint.org/docs/rules/sort-imports
  },
};
