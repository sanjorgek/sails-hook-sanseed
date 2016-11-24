module.exports.dropModelReq = function (req, res) {
  sails.seed.dropModel(req.params.model,function(err) {
    if(err) res.send(400,{error: err.message});
    else res.ok({result: "Droped "+req.params.model+" borrado"});
  });
}

module.exports.dropAllReq = function (req, res) {
  sails.seed.dropAll(function(err) {
    if(err) res.send(400, {error: err.message});
    else res.ok({result: "Droped all models"});
  });
}

module.exports.seedModelReq = function (req, res){
  sails.seed.seedAll(req.params.location, function (err) {
    if(err){
      res.send(400, {error: err.message});
    }else{
      res.ok({result: "Seed "+req.params.location+" complited"});
    }
  });
}

module.exports.seedAllReq = function (req, res) {
  sails.seed.seedModel(req.params.location, req.params.model, function(err) {
    if(err){
      res.send(400, {error: err.message});
    }else{
      res.ok({result: "Seed "+req.params.location+" model "+req.params.model+" created"});
    }
  });
}
