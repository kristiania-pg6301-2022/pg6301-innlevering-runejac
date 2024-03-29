module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    amd: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.js", "babel.config.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
