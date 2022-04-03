const path = require('path');

const FILE_TRANSFER_KEY = "js|jsx|mjs|cjs|ts|tsx|css|json";

module.exports = {
  webpack: function override(config) {
    config.resolve = {
      ...config.resolve,
      alias: {'@': path.resolve(__dirname, 'src')},
    };

    config.module.rules = config.module.rules.map(rule => {
      if (rule.oneOf instanceof Array) {
        return {
          ...rule,
          oneOf: [
            {
              test: /\.(graphql|gql)$/,
              exclude: /node_modules/,
              loader: 'graphql-tag/loader',
            },
            ...rule.oneOf
          ]
        };
      }

      return rule;
    });

    return config;
  },
  jest: function override(config) {
    Object.keys(config.transform).forEach(key => {
      const replacedKey = key.replace(FILE_TRANSFER_KEY, `${FILE_TRANSFER_KEY}|graphql|gql`);
      if (key !== replacedKey) {
        config.transform[replacedKey] = config.transform[key];
        delete config.transform[key];
      }
    });

    return config;
  }
};
