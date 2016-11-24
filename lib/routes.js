var auxF = require('./functions');

module.exports = {
  before: {
    'get /seed/*': function(req, res, next){
      next();
    },
    'get /drop/*': function(req, res, next) {
      next();
    }
  },

  after: {
    'get /seed/:location': auxF.seedModelReq,
    'get /seed/:location/:model': auxF.seedAllReq,
    'get /drop/:model': auxF.dropModelReq,
    'get /drop': auxF.dropAllReq
  }
};
