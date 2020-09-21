const merge = require('webpack-merge')
const devEnv = require('./dev.env')
module.exports = {
    NODE_ENV: '"development"',
    ENV_CONFIG: '"test"',
    BASE_API: '"http://192.168.1.193"'
  }