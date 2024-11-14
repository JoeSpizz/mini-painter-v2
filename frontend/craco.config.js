// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.watchOptions = {
          poll: 1000,          // Check for changes every second
          aggregateTimeout: 300, // Delay before rebuilding
          ignored: /node_modules/, // Ignore watching node_modules
        };
        return webpackConfig;
      },
    },
  };
  