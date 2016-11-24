var async = require('async');
var debug = require('debug')('sails:hook:sanseed');

module.exports = function myHook(sails) {
  return {
    defaults: {
      seed: {
        routes: true
      }
    },

    configure: function() {
      if(!sails.config.seed.routes) sails.hooks.seed.routes = {};
      return ;
    },

    initialize: function(cb) {       
      sails.after(['hook:orm:loaded', 'hook:policies:loaded'], function() {
        function mapCreate (modelSeed, name, done) {
          async.mapLimit(modelSeed.data, 1, function(item, cb) {
            var cb2 = cb;
            if(modelSeed.migrate==='safe') cb2 = function(err) {
              debug(err);
              cb();
            };
            if(sails.models[name]) sails.models[name].create(item, cb2);
            else return cb(new Error('Model '+name+" undefined"));
          }, done);
        }
        function seedModel(seed, name, done) {
          var checkModel = !sails.config.seed.locations;
          checkModel = checkModel || !sails.config.seed.locations[seed];
          if(checkModel) return done(new Error('Location missing'));          
          var modelSeed = sails.config.seed.locations[seed][name];
          if(modelSeed===null || modelSeed===undefined){
            return done(new Error('missing model'));
          }else{
            if(modelSeed.migrate=="drop") dropModel(name, function(err) {
              if(err) return done(err);
              else return mapCreate(modelSeed, name, done);
            });
            else return mapCreate(modelSeed, name, done);
          }
        }
        function dropModel (name, done) {
          sails.models[name].destroy({}, done);
        }
        sails.seed = {
          seedAll : function (name, done) {
            if(!sails.config.seed.locations){
              return done(new Error('Location missing'));
            }
            var seed = sails.config.seed.locations[name];
            if(seed===null || seed===undefined){
              return done(new Error('Seed not found'));
            }else return async.mapLimit(
              Object.keys(seed), 
              1, 
              function(item, cb){
                seedModel(name, item, cb);
              },
              done
            );
          },
          seedModel: seedModel,
          dropModel: dropModel,
          dropAll: function(done) {
            var modelKeys = Object.keys(sails.models);
            async.mapLimit(modelKeys, 1, function(item, cb) {
              dropModel(item, cb);
            }, done);
          }
        };
        sails.hooks.policies.middleware.seedall = seedAllReq;
        sails.hooks.policies.middleware.seedall.identity = "seedall";
        sails.hooks.policies.middleware.seedall.globalId = "seedAll";
        sails.hooks.policies.middleware.seedall.sails = sails;

        sails.hooks.policies.middleware.seedmodel = seedModelReq;
        sails.hooks.policies.middleware.seedmodel.identity = "seedmodel";
        sails.hooks.policies.middleware.seedmodel.globalId = "seedModel";
        sails.hooks.policies.middleware.seedmodel.sails = sails;

        sails.hooks.policies.middleware.dropall = dropAllReq;
        sails.hooks.policies.middleware.dropall.identity = "dropall";
        sails.hooks.policies.middleware.dropall.globalId = "dropAll";
        sails.hooks.policies.middleware.dropall.sails = sails;

        sails.hooks.policies.middleware.dropmodel = dropModelReq;
        sails.hooks.policies.middleware.dropmodel.identity = "dropmodel";
        sails.hooks.policies.middleware.dropmodel.globalId = "dropModel";
        sails.hooks.policies.middleware.dropmodel.sails = sails;
        return cb();
      });
    },

    routes: {
      before: {
        'get /seed/*': function(req, res, next){
          next();
        },
        'get /drop/*': function(req, res, next) {
          next();
        }
      },

      after: {
        'get /seed/:location': seedModelReq,
        'get /seed/:location/:model': seedAllReq,
        'get /drop/:model': dropModelReq,
        'get /drop': dropAllReq
      }
    }
  };
};

function dropModelReq(req, res) {
  sails.seed.dropModel(req.params.model,function(err) {
    if(err) res.send(400,{error: err.message});
    else res.ok({result: "Droped "+req.params.model+" borrado"});
  });
}

function dropAllReq(req, res) {
  sails.seed.dropAll(function(err) {
    if(err) res.send(400, {error: err.message});
    else res.ok({result: "Droped all models"});
  });
}

function seedModelReq(req, res){
  sails.seed.seedAll(req.params.location, function (err) {
    if(err){
      res.send(400, {error: err.message});
    }else{
      res.ok({result: "Seed "+req.params.location+" complited"});
    }
  });
}

function seedAllReq(req, res) {
  sails.seed.seedModel(req.params.location, req.params.model, function(err) {
    if(err){
      res.send(400, {error: err.message});
    }else{
      res.ok({result: "Seed "+req.params.location+" model "+req.params.model+" created"});
    }
  });
}
