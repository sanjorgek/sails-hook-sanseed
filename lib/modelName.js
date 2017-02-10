const lazy = require("lazy.js");
const matchWithAlias = (item) => (modelAssociation) => {
  return modelAssociation.alias === item;
};

module.exports = (modelAssociations, itemRelation) => {
  var models = lazy(modelAssociations).filter(matchWithAlias(itemRelation)).take(1).toArray();
  return models.length > 0 ? models[0][models[0].type] : null;
};
