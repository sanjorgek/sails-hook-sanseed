const mapCreate = require("./mapCreate");

const dropModel = (sails) => (name, done) => {
  sails.models[name].destroy({}, done);
};

const seedModel = (sails) => (seed, name, done) => {
  let checkModel = !sails.config.seed.databases;
  checkModel = checkModel || !sails.config.seed.databases[seed];
  if(checkModel) return done(new Error("Database missing"));          
  let modelSeed = sails.config.seed.databases[seed][name];
  return (!modelSeed) ? 
    done(new Error("missing model")) :
    (modelSeed.migrate==="drop") ? 
      dropModel(sails)(name, (err) => {
        return (err) ? done(err) : mapCreate(sails)(modelSeed, name, done);
      }) :
      mapCreate(sails)(modelSeed, name, done);
};

module.exports = {
  seedModel,
  dropModel
};
