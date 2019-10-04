module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  collectCoverageFrom: [
    "!**/__fixtures__/**",
    "!src/main.js",
    "!src/.eslintrc.js",
    "src/**/*.{js,jsx,vue}"
  ],
  setupFiles: ["./src/__mocks__/indexedDb.js"],
  moduleNameMapper: {
    "\\.css$": "<rootDir>/__mocks__/styleMock.js",
    "^lodash-es$": "lodash",
    "^workbox-window/Workbox.mjs$": "workbox-window"
  },
  testMatch: [
    "<rootDir>/src/**/*.spec.(js|jsx|ts|tsx)",
    "<rootDir>/tests/unit/**/*.spec.(js|jsx|ts|tsx)"
  ],
  testPathIgnorePatterns: ["/node_modules/", "/__fixtures__/"]
};
