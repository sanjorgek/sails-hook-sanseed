function handle (res, msg) {
  return function(err) {
    return err ? res.send(400,{error: err.message}):
      res.ok({result: msg});
  };
}

module.exports = function(sails) {
  return {
    dropModelReq: function (req, res) {
      sails.seed.dropModel(req.params.model, handle(res,"Droped "+req.params.model));
    },
    dropAllReq: function (req, res) {
      sails.seed.dropAll(handle(res, "Droped all models"));
    },
    seedModelReq: function (req, res){
      sails.seed.seedAll(req.params.database, handle(res, "Seed "+req.params.database+" complited"));
    },
    seedAllReq: function (req, res) {
      sails.seed.seedModel(req.params.database, req.params.model, handle(res, "Seed "+req.params.database+" model "+req.params.model+" created"));
    }
  };
};
