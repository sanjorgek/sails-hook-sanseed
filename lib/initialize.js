var async = require('async');
var auxF = require('./functions');
var debug = require('debug')('sails:hook:sanseed');
var faker = require('faker');

module.exports = function(cb) {       
  sails.after(['hook:orm:loaded', 'hook:policies:loaded'], function() {
    function mapCreate (modelSeed, name, done) {
      if(modelSeed.faker){
        var limit = 0;
        if(modelSeed.faker.locale) faker.locale = modelSeed.faker.locale;
        if(modelSeed.faker.quantity) limit = modelSeed.faker.quantity;
        var keys = Object.keys(modelSeed.faker.format);
        modelSeed.data = [];
        for(var i = 0; i < limit; i++){
          var jsonData = {};              
          for(var j = 0; j < keys.length; j++){
            jsonData[keys[j]] = faker.fake(modelSeed.faker.format[keys[j]]);
          }
          modelSeed.data.push(jsonData);
        }
      }
      async.mapLimit(modelSeed.data, 1, function(item, next) {
        var next2 = next;
        if(modelSeed.migrate==='safe') next2 = function(err) {
          debug(err);
          next();
        };
        if(sails.models[name]) sails.models[name].create(item, next2);
        else return next2(new Error('Model '+name+" undefined"));
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
        if(modelSeed.migrate==="drop") dropModel(name, function(err) {
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
          function(item, next){
            seedModel(name, item, next);
          },
          done
        );
      },
      seedModel: seedModel,
      dropModel: dropModel,
      dropAll: function(done) {
        var modelKeys = Object.keys(sails.models);
        async.mapLimit(modelKeys, 1, function(item, next) {
          dropModel(item, next);
        }, done);
      }
    };
    sails.hooks.policies.middleware.seedall = auxF.seedAllReq;
    sails.hooks.policies.middleware.seedall.identity = "seedall";
    sails.hooks.policies.middleware.seedall.globalId = "seedAll";
    sails.hooks.policies.middleware.seedall.sails = sails;

    sails.hooks.policies.middleware.seedmodel = auxF.seedModelReq;
    sails.hooks.policies.middleware.seedmodel.identity = "seedmodel";
    sails.hooks.policies.middleware.seedmodel.globalId = "seedModel";
    sails.hooks.policies.middleware.seedmodel.sails = sails;

    sails.hooks.policies.middleware.dropall = auxF.dropAllReq;
    sails.hooks.policies.middleware.dropall.identity = "dropall";
    sails.hooks.policies.middleware.dropall.globalId = "dropAll";
    sails.hooks.policies.middleware.dropall.sails = sails;

    sails.hooks.policies.middleware.dropmodel = auxF.dropModelReq;
    sails.hooks.policies.middleware.dropmodel.identity = "dropmodel";
    sails.hooks.policies.middleware.dropmodel.globalId = "dropModel";
    sails.hooks.policies.middleware.dropmodel.sails = sails;
    return cb();
  });
};
