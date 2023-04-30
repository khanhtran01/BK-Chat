module.exports = {
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testEnvironmentOptions: {
    nodeOptions: {
      // enable the `vm` module to support Jest's mocking features
      // (not enabled by default in Node.js)
      vm: true,
    },
  }
  // ...
};
