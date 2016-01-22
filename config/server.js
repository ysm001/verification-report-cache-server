const env = process.env.NODE_ENV || 'development';

module.exports = {
  development: {
    port: '4000',
  },
  production: {
    port: '4000',
  },
  test: {
    port: '4000',
  }
}[env];
