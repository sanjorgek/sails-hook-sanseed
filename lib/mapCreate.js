const faker = require("faker");
const _ = require("lodash");
const map = require("async/map");
const auxF = require("./initAux");
const  mapLimit = require("async/mapLimit");

const fakkerJson = (schemeForm) => {
  return (typeof schemeForm === "string")? faker.fake(schemeForm)
    : schemeForm;
};

module.export = (sails, modelSeed, name, done) => {
  if(modelSeed.faker){
    let fakerScheme = modelSeed.faker;
    let limit = fakerScheme.quantity ? fakerScheme.quantity : 1;
    faker.locale = fakerScheme.locale ? fakerScheme.locale : "en";
    modelSeed.scheme = Array(limit);
    _.map(modelSeed.scheme, (i) => {
      let jsonData = {};
      _.forEach(fakerScheme.format, (schemeForm, key) => {
        jsonData[key] = fakkerJson(schemeForm);
      });
      return {data: jsonData, oneTo: fakerScheme.oneTo, manyTo: fakerScheme.manyTo};
    });
  }
  mapLimit(modelSeed.scheme, 1, function(item, next) {
    let next2 = auxF.safeCb(modelSeed.migrate, next);
    return !sails.models[name] ? next2(new Error("Model "+name+" undefined"))
      : map(
        Object.keys(item.oneTo || {}),
        function(itemRelation, cbMap) {
          var modelAssociations = sails.models[name].associations;
          let model = auxF.modelName(modelAssociations, itemRelation);
          return model !== null ? sails.models[model].find(item.oneTo[itemRelation]).limit(1).exec(function(err, associatedModels) {
              if(!err && associatedModels.length!==0){
                item.data[itemRelation] = associatedModels[0].id;
              }
              return cbMap();
            })
            : cbMap();
        }, function() {
          if(item.faker){
            var fakerAttributes = Object.keys(item.faker);
            for(var k=0; k<fakerAttributes.length; k++){
              item.data[fakerAttributes[k]] = faker.fake(item.faker[fakerAttributes[k]]);
            }
          }
          return sails.models[name].create(item.data, function(err, recordCreated) {
            return err ? next2(err)
              : mapLimit(
                Object.keys(item.manyTo || {}), 
                1,
                function(itemRelation, cbMap) {
                  var modelAssociations = sails.models[name].associations;
                  let model = auxF.modelName(modelAssociations, itemRelation);
                  return model !== null ? sails.models[model].find({or: item.manyTo[itemRelation]}).exec(function(err, associatedModels) {
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
};
