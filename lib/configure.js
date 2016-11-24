module.exports = function() {
  if(!sails.config.seed.routes) sails.hooks.seed.routes = {};
  return ;
}