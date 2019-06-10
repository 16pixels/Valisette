module.exports = {
  extends: ["airbnb-base", "prettier", "plugin:vue/recommended"],
  parserOptions: {
    ecmaVersion: 2017,
    parser: "babel-eslint",
    sourceType: "module"
  },
  env: {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  globals: {
    window: 1,
    document: 1,
    pixels: 1
  },
  rules: {
    "prefer-destructuring": [
      "error",
      {
        array: false
      }
    ],
    "no-param-reassign": ["error", { props: false }],
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
