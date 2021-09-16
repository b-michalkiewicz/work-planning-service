module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint/eslint-plugin"],
    extends: ["plugin:@typescript-eslint/eslint-recommended", "plugin:@typescript-eslint/recommended"],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/quotes": "warn",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/consistent-type-assertions": "warn",
        "@typescript-eslint/no-namespace": "warn",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-var-requires": "warn",
    },
};
