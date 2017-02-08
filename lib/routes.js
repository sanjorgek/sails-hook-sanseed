var auxF = require("./functions");

module.exports = function(sails){
  const auxFS = auxF(sails);
  return {
    before: {
      "get /seed/*": function(req, res, next){
        next();
      },
      "get /drop/*": function(req, res, next) {
        next();
      }
    },

    after: {
      "get /seed/:database": auxFS.seedModelReq,
      "get /seed/:database/:model": auxFS.seedAllReq,
      "get /drop/:model": auxFS.dropModelReq,
      "get /drop": auxFS.dropAllReq
    }
  };
};
