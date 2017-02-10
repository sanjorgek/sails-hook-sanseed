var auxF = require("./functions");

module.exports = (sails) => {
  const auxFS = auxF(sails);
  return {
    before: {
      "get /seed/*": (req, res, next) => {
        next();
      },
      "get /drop/*": (req, res, next) => {
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
