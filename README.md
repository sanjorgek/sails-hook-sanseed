# sails-hook-sanseed

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

## About
Hook Hook for [sails](http://sailsjs.org/) to add items ('seed') to the base depending on different locations

  [![NPM](https://nodei.co/npm-dl/sails-hook-sanseed.png?months=6&height=1)](https://nodei.co/npm/sails-hook-sanseed/)

## Settings
Install
~~~
npm install sails-hook-sanseed
~~~
Define at `config/seed.js`
~~~js
module.exports.seed = {
  locations : {
    test: {
      user: {
        data: [
          {
            //Some data
            username: "juan",
            name: "Paco",
            last: "Pedro",
            password: "de la mar"
          },
          {
            //Some data
          }
        ],
        //If you want to drop before seed
        migrate: 'drop'
    },
    production: {
      user: {
        data: [
          {
            //Some data
            username: "test",
            name: "Test",
            last: "Test",
            password: "iamademo"
          },
          {
            //Some data
          }
        ],
        // if you want to try without callback an error
        migrate: 'safe'
    },
    serverX: {
      //Some data
    }
  },
  //optional
  routes: true //Defult routes
}
~~~

## Use
If `sails.seed.routes` is true seed your models with `/seed/:location` or `/seed/:location/:model` routes, and `/drop/:model` or `/drop` routes to drop models.

### Aviable Functions
Also you have `sails.seed` with

#### seedModel(location, modelName, callback)

__Arguments__

* `location` - A string with location name.
* `modelName` - A string with model name.
* `callback(err)` - A callback which is called when all task have finished, or an error occurs.

#### seedAll(location, callback)

__Arguments__

* `location` - A string with location name.
* `callback(err)` - A callback which is called when all task have finished, or an error occurs.

#### dropModel(modelName, callback)

__Arguments__

* `modelName` - A string with model name.
* `callback(err)` - A callback which is called when all task have finished, or an error occurs.

#### dropAll(callback)

__Arguments__

* `callback(err)` - A callback which is called when all task have finished, or an error occurs.

Define at `/config/routes.js`:
~~~js
module.exports.routes{
  'get /sanseed/:location': function  (req, res, next) {
    sails.seed.seedAll(req.params.location, function(err){
      if(err){
        //do something
      }else{
        //do something
      }
    });
  }
}
~~~

### Policies
You have:
* `seedModel`
* `seedAll`
* `dropModel`
* `dropAll`


Define at `/config/routes.js`:
~~~js
module.exports.routes{
  'get /sandrop' : [{policy: 'dropAll'}]
}
~~~

[npm-image]: https://img.shields.io/npm/v/sails-hook-sanseed.svg
[npm-url]: https://npmjs.org/package/sails-hook-sanseed
[downloads-image]: https://img.shields.io/npm/dm/sails-hook-sanseed.svg
[downloads-url]: https://npmjs.org/package/sails-hook-sanseed
