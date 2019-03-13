module.exports = {
  extends: ["airbnb-base", "prettier", "plugin:vue/recommended"],
  parser: ['vue-eslint-parser', 'babel-eslint'],
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
