var defaults = require('./lib/defaults'),
  configure = require('./lib/configure'),
  initialize =require('./lib/initialize'),
  routes = require('./lib/routes');

module.exports = function myHook(sails) {
  return {
    defaults: defaults,

    configure: configure,

    initialize: initialize(sails),

    routes: routes
  };
};
