var mapLimit = require("async/mapLimit"),
  modelF = require("./modelFunc"),
  optF = require("./functions");

module.exports = (sails) => (cb) => {
  sails.after(["hook:orm:loaded", "hook:policies:loaded"], () => {
    sails.seed = {
      seedAll (name, done) {
        return !sails.config.seed.databases ? done(new Error("Database missing"))
          : (!sails.config.seed.databases[name]) ? done(new Error("Seed not found"))
            : mapLimit(
              Object.keys(sails.config.seed.databases[name]), 
              1, 
              (item, next) => {
                modelF.seedModel(sails)(name, item, next);
              },
              done
            );
      },
      seedModel: modelF.seedModel(sails),
      dropModel: modelF.dropModel(sails),
      dropAll (done) {
        let modelKeys = Object.keys(sails.models);
        mapLimit(modelKeys, 1, (item, next) => {
          modelF.dropModel(sails)(item, next);
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
