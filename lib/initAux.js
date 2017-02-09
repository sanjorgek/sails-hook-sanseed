const lazy = require("lazy.js");

const matchWithAlias = item => modelAssociation => {
  return modelAssociation.alias === item;
};

const modelName = (modelAssociations, itemRelation) => {
  let models = lazy(modelAssociations).filter(matchWithAlias(itemRelation)).take(1).toArray();
  return models.length > 0 ? models[0][models[0].type] : null;
};

const safeCb = (migrate, next) => {
  return migrate==='safe' ? (cb => err => {
    debug(err);
    cb();
  })(next)
    : next;
};

module.export = {
  modelName,
  safeCb
};
