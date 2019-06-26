const pkg = require('./package.json');

module.exports = {
  apps: [
    {
      name: pkg.name,
      script: 'dist/main.js',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
