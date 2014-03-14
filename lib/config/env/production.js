'use strict';

module.exports = {
  env: 'production',
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://gbachik:freedom347@ds033499.mongolab.com:33499/duelbits'
  }
};