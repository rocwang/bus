module.exports = {
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  },
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: [
    "**/src/**/*.spec.(js|jsx|ts|tsx)",
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
  ],
  testURL: "http://localhost/"
};
