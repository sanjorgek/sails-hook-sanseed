module.exports = (sails) => () => {
  if(!sails.config.seed.routes) sails.hooks.seed.routes = {};
  return ;
};
