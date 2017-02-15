const mapCreate = require("./mapCreate");

const dropModel = (sails) => (name, done) => {
  sails.models[name].destroy({}, done);
};

const mapSeed = (sails) => (modelSeed, name, done) => {
  return (!modelSeed) ? 
    done(new Error("missing model")) :
    (modelSeed.migrate==="drop") ? 
      dropModel(sails)(name, (err) => {
        return (err) ? done(err) : mapCreate(sails)(modelSeed, name, done);
      }) :
      mapCreate(sails)(modelSeed, name, done);
};

const seedModel = (sails) => (seed, name, done) => {
  let checkModel = !sails.config.seed.databases;
  checkModel = checkModel || !sails.config.seed.databases[seed];
  return checkModel ?
    done(new Error("Database missing")):
    mapSeed(sails)(sails.config.seed.databases[seed][name], name, done);
};

module.exports = {
  seedModel,
  dropModel
};
