module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "import/no-unresolved": 0,
  },
  ignorePatterns: [
    "node_modules",
    ".eslintrc.cjs",
    "plopfile.cjs",
    "generator.cjs",
  ],
};
