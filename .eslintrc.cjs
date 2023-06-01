/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    // https://github.com/vuejs/eslint-config-prettier#use-separate-commands-for-linting-and-formatting
    // VSCodeのPrettir Pluginをインストールして、settings.jsonでファイル保存時に効くようにする!!!
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "vue/multi-word-component-names": 0,
    "vue/no-v-for-template-key-on-child": "off",
  },
};
