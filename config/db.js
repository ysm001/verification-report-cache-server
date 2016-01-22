const mongoose = require('mongoose');

const env = process.env.NODE_ENV || 'development';
const appName = 'verification-report-svg-cache';

const config = {
  development: {
    name: `${appName}_development`,
    host: 'localhost',
    port: '27017',
    user: '',
    password: ''
  },
  production: {
    name: `${appName}_production`,
    host: 'localhost',
    port: '27017',
    user: '',
    password: ''
  },
  test: {
    name: `${appName}_test`,
    host: 'localhost',
    port: '27017',
    user: '',
    password: ''
  }
}[env];

mongoose.connect('mongodb://' + config.host + '/' + config.name);
module.exports = mongoose;
