var async = require('async');

module.exports = function myHook(sails) {
  return {
    configure: function() {
      return ;
    },

    initialize: function(cb) {
      sails.after(['hook:orm:loaded'], function() {
        function mapCreate (modelSeed, name, done) {
          async.mapLimit(modelSeed.data, 1, function(item, cb) {
            var cb2 = cb;
            if(modelSeed.migrate=='safe') cb2 = function(err) {
              cb();
            } 
            sails.models[name].create(item, cb2);
          }, done);
        }
        function seedModel(seed, name, done) {
          var modelSeed = sails.config.seed[seed][name];
          if(modelSeed==null || modelSeed==undefined) done(new Error('missing model'));
          else{
            if(modelSeed.migrate=="drop") dropModel(name, function(err) {
              if(err) done(err);
              else mapCreate(modelSeed, name, done);
            });
            else mapCreate(modelSeed, name, done);
          }
        };
        function dropModel (name, done) {
          sails.models[name].destroy({}, done);
        };
        sails.seed = {
          seedAll : function (name, done) {
            var seed = sails.config.seed[name];
            if(seed==null || seed==undefined) done(new Error('Seed not found'));
            else async.mapLimit(Object.keys(seed), 1, function(item, cb){
              seedModel(name, item, cb);
            },done);
          },
          seedModel: seedModel,
          dropModel: dropModel,
          dropAll: function(done) {
            var modelKeys = Object.keys(sails.models);
            async.mapLimit(modelKeys, 1, function(item, cb) {
              dropModel(item, cb);
            }, done)
          }
        }
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
        'get /seed/:location': function(req, res){
          sails.seed.seedAll(req.params.location, function (err) {
            if(err){
              res.send(400, {error: err.message});
            }else{
              res.ok({result: "Seed "+req.params.location+" complited"});
            }
          });
        },
        'get /seed/:location/:model': function (req, res) {
          sails.seed.seedModel(req.params.location, req.params.model, function(err) {
            if(err){
              res.send(400, {error: err.message});
            }else{
              res.ok({result: "Seed "+req.params.location+" model "+req.params.model+" created"});
            }
          });
        },
        'get /drop/:model': function(req, res) {
          sails.seed.dropModel(req.params.model,function(err) {
            if(err) res.send(400,{error: err.message});
            else res.ok({result: "Droped "+req.params.model+" borrado"});
          });
        },
        'get /drop': function(req, res) {
          sails.seed.dropAll(function(err) {
            if(err) res.send(400, {error: err.message});
            else res.ok({result: "Droped all models"});
          });
        }
      }
    }
  };
}
