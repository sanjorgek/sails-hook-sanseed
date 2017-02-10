var _ = require('lodash'),
  map = require("async/map"),
  mapLimit = require("async/mapLimit"),
  optF = require("./functions"),
  safeCb = require('./safeCb'),
  modelName = require("./modelName"),
  faker = require("faker");

const fakkerJson = schemeForm => {
  return (typeof schemeForm === 'string')? faker.fake(schemeForm)
    : schemeForm;
};

module.exports = (sails) => (cb) => {
  sails.after(['hook:orm:loaded', 'hook:policies:loaded'], () => {
    const mapCreate = (modelSeed, name, done) => {
      if(modelSeed.faker){
        var fakerScheme = modelSeed.faker;
        modelSeed.scheme = [];
        let limit = (fakerScheme.quantity) ? fakerScheme.quantity : 1;
        faker.locale = fakerScheme.locale ? fakerScheme.locale : 'es';
        let schemeFakerJson = Array();
        modelSeed.scheme = _.map(Array(limit), (i) => {
          let jsonData = {};
          _.forEach(fakerScheme.format, (schemeForm, key) => {
            jsonData[key] = fakkerJson(schemeForm);
          });
          return {data: jsonData, oneTo: fakerScheme.oneTo, manyTo: fakerScheme.manyTo};
        });
      }
      mapLimit(modelSeed.scheme, 1, (item, next) => {
        const next2 = safeCb(modelSeed.migrate, next);
        return (!sails.models[name]) ? next2(new Error('Model '+name+" undefined"))
          : map(
            Object.keys(item.oneTo || {}),
            (itemRelation, cbMap) => {
              var modelAssociations = sails.models[name].associations;
              let model = modelName(modelAssociations, itemRelation);
              return model !== null ? sails.models[model].find(item.oneTo[itemRelation]).limit(1).exec((err, associatedModels) => {
                  if(!err && associatedModels.length!==0){
                    item.data[itemRelation] = associatedModels[0].id;
                  }
                  return cbMap();
                })
                : cbMap();
            }, 
            () => {
              if(item.faker){
                var fakerAttributes = Object.keys(item.faker);
                for(var k=0; k<fakerAttributes.length; k++){
                  item.data[fakerAttributes[k]] = faker.fake(item.faker[fakerAttributes[k]]);
                }
              }
              return sails.models[name].create(item.data, (err, recordCreated) => {
                if(err) next2(err);
                else mapLimit(
                  Object.keys(item.manyTo || {}), 
                  1,
                  (itemRelation, cbMap) => {
                    var modelAssociations = sails.models[name].associations;
                    let model = modelName(modelAssociations, itemRelation);     return model !== null ? sails.models[model].find({or: item.manyTo[itemRelation]}).exec((err, associatedModels) => {
                      if(!err || associatedModels!==[]){
                        for(var j=0; j<associatedModels.length; j++){
                          recordCreated[itemRelation].add(associatedModels[j].id);
                        }
                      }
                      recordCreated.save(cbMap);
                    })
                    : cbMap();
                  },
                  next2
                );
              });
            }
        );
      }, done);
    }
    const seedModel = (seed, name, done) => {
      let checkModel = !sails.config.seed.databases;
      checkModel = checkModel || !sails.config.seed.databases[seed];
      if(checkModel) return done(new Error('Database missing'));          
      let modelSeed = sails.config.seed.databases[seed][name];
      return (modelSeed===null || modelSeed===undefined) ? done(new Error('missing model'))
        : (modelSeed.migrate==="drop") ? dropModel(name, (err) => {
          return (err) ? done(err) : mapCreate(modelSeed, name, done);
        })
          : mapCreate(modelSeed, name, done);
    }
    const dropModel = (name, done) => {
      sails.models[name].destroy({}, done);
    }
    sails.seed = {
      seedAll (name, done) {
        return !sails.config.seed.databases ? done(new Error('Database missing'))
          : (!sails.config.seed.databases[name]) ? done(new Error('Seed not found'))
            : mapLimit(
              Object.keys(sails.config.seed.databases[name]), 
              1, 
              (item, next) => {
                seedModel(name, item, next);
              },
              done
            );
      },
      seedModel: seedModel,
      dropModel: dropModel,
      dropAll (done) {
        let modelKeys = Object.keys(sails.models);
        mapLimit(modelKeys, 1, (item, next) => {
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
