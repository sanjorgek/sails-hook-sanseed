const mapLimit = require("async/mapLimit"),
  modelF = require("./modelFunc");

module.exports = (sails) => {
  return {
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
};
