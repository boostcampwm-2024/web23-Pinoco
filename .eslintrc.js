module.exports = {
    root: true,
    env: {
     browser: true,
     es2021: true,
     node: true,
    },
    extends: [
     'eslint:recommended',
     'plugin:@typescript-eslint/recommended',
     'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
     ecmaVersion: 12,
     sourceType: 'module',
     project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    rules: {
     'prettier/prettier': ['error', { endOfLine: 'auto' }],
     '@typescript-eslint/explicit-module-boundary-types': 'off',
     '@typescript-eslint/no-explicit-any': 'warn',
     'no-console': 'warn',
     'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
     'eqeqeq': 'error',
     'curly': 'error',
     // 팀 컨벤션 반영
     'func-style': ['error', 'declaration', { "allowArrowFunctions": false }], // 화살표 함수가 아닌 함수 선언식 사용
     'camelcase': 'error', // 변수명 카멜 케이스 강제
     'id-match': [
      'error',
      '^([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*|I[A-Z][a-zA-Z0-9]*)$', // PascalCase or camelCase, 인터페이스는 I로 시작
      {
       'properties': true,
      },
     ],
     '@typescript-eslint/naming-convention': [
      'error',
      {
       'selector': 'interface',
       'format': ['PascalCase'],
       'prefix': ['I'], // 인터페이스는 'I' 접두사와 PascalCase 사용
      },
      {
       'selector': 'typeLike',
       'format': ['PascalCase'], // 타입, 컴포넌트는 PascalCase 사용
      },
     ],
     '@typescript-eslint/explicit-function-return-type': 'error', // 명시적 반환 타입 강제
     'prefer-const': 'error', // const 기본 사용
     '@typescript-eslint/no-inferrable-types': 'off', // 타입 명시
     '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // 인터페이스로 통일
     '@typescript-eslint/explicit-member-accessibility': ['error'], // 멤버 접근성 명시
    },
   };