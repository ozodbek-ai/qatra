import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  eslintConfigPrettier,

  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tseslint.parser,
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },

    rules: {
      "no-console": "warn",

      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];