const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    project: `./tsconfig.json`
  },
  extends: ['@react-native-community', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 0,
    "no-shadow": "off",
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] },
    },
  ],
};
