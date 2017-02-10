const lazy = require("lazy.js");

const debug = require("debug")("sails:hook:sanseed");

const matchWithAlias = item => modelAssociation => {
  return modelAssociation.alias === item;
};

module.export = {
  modelName (modelAssociations, itemRelation) {
    let models = lazy(modelAssociations).filter(matchWithAlias(itemRelation)).take(1).toArray();
    return models.length > 0 ? models[0][models[0].type] : null;
  },
  safeCb (migrate, next) {
    return migrate==="safe" ? ((cb) => (err) => {
      debug(err);
      cb();
    })(next)
      : next;
  }
};
