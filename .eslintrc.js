module.exports = {
  extends: ["airbnb-base", "prettier", "plugin:vue/recommended"],
  parserOptions: {
    ecmaVersion: 2017,
    parser: "babel-eslint",
    sourceType: "module"
  },
  globals: {
    window: 1,
    document: 1,
    pixels: 1
  },
  rules: {
    "no-console": 0,
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false
      }
    ]
  }
};
