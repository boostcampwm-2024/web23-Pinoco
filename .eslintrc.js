module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // prettier와 통합하여 코드 스타일 적용
  ],
  rules: {
    // 일반 함수 사용
    'prefer-arrow-callback': 'off',
    'func-names': ['error', 'never'],

    // PascalCase 규칙 강제
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeLike', // 클래스, 인터페이스, 타입, 컴포넌트
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'], // 인터페이스 이름에 I를 접두사로 사용
      },
    ],

    // 함수명은 동사+명사 조합으로 작성, 카멜케이스 강제
    camelcase: ['error', { properties: 'never', ignoreDestructuring: false }],
    'func-names': 'off', // 함수명 강제 규칙, 예: handleEvent

    // Named Exports 강제
    'import/prefer-default-export': 'off',

    // const 기본 사용, let은 변경 시만 사용
    'prefer-const': 'error',
    'no-var': 'error',

    // 고차 함수 사용 지향
    'array-callback-return': 'error',
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for...in loops are not allowed. Use Object.keys or other utilities.',
      },
      {
        selector: 'ForOfStatement',
        message: 'for...of loops are not allowed. Use array methods instead.',
      },
    ],

    // Boolean 타입 접두사 is 사용
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],

    // Enum 사용 지향
    '@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: true }],
    'no-shadow': 'off',

    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
