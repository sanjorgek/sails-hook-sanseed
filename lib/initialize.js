var mapCreate = require("./mapCreate"),
  mapLimit = require("async/mapLimit"),
  optF = require("./functions");

module.exports = function(sails) {
  return function(cb){       
    sails.after(["hook:orm:loaded", "hook:policies:loaded"], function() {
      const dropModel = (name, done) => {
        sails.models[name].destroy({}, done);
      };
      const seedModel = (seed, name, done) => {
        var checkModel = !sails.config.seed.databases;
        checkModel = checkModel || !sails.config.seed.databases[seed];
        if(checkModel) return done(new Error("Database missing"));          
        var modelSeed = sails.config.seed.databases[seed][name];
        return (modelSeed===null || modelSeed===undefined) ? done(new Error("missing model"))
          : modelSeed.migrate==="drop" ? dropModel(name, function(err) {
            return err ? done(err) : mapCreate(sails, modelSeed, name, done);
          }) 
            : mapCreate(sails, modelSeed, name, done);
      };
      sails.seed = {
        seedAll (name, done) {
          const seedAllModels = (seed) => {
            return (seed===null || seed===undefined) ? done(new Error("Seed not found"))
              : mapLimit(
                Object.keys(seed), 
                1, 
                function(item, next){
                  seedModel(name, item, next);
                },
                done
              );
          };
          return !sails.config.seed.databases ? done(new Error("Database missing"))
            : seedAllModels(sails.config.seed.databases[name]);
        },
        seedModel,
        dropModel,
        dropAll (done) {
          let modelKeys = Object.keys(sails.models);
          mapLimit(modelKeys, 1, function(item, next) {
            dropModel(item, next);
          }, done);
        }
      };
      const optFS = optF(sails);
      sails.hooks.policies.middleware.seedall = optFS.seedAllReq;
      sails.hooks.policies.middleware.seedall.identity = "seedall";
      sails.hooks.policies.middleware.seedall.globalId = "seedAll";
      sails.hooks.policies.middleware.seedall.sails = sails;

      sails.hooks.policies.middleware.seedmodel = optFS.seedModelReq;
      sails.hooks.policies.middleware.seedmodel.identity = "seedmodel";
      sails.hooks.policies.middleware.seedmodel.globalId = "seedModel";
      sails.hooks.policies.middleware.seedmodel.sails = sails;

      sails.hooks.policies.middleware.dropall = optFS.dropAllReq;
      sails.hooks.policies.middleware.dropall.identity = "dropall";
      sails.hooks.policies.middleware.dropall.globalId = "dropAll";
      sails.hooks.policies.middleware.dropall.sails = sails;

      sails.hooks.policies.middleware.dropmodel = optFS.dropModelReq;
      sails.hooks.policies.middleware.dropmodel.identity = "dropmodel";
      sails.hooks.policies.middleware.dropmodel.globalId = "dropModel";
      sails.hooks.policies.middleware.dropmodel.sails = sails;
      return cb();
    });
  };
};
