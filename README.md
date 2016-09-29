# sails-hook-sanseed
Hook for [sails](http://sailsjs.org/)

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

## About
Hook to add items to the base depending on different localities

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
  routes: true
}
~~~

## Use
Test using `/seed/production` or `/seed/test/user` routes to seed or `/drop/user` or `/drop` routes to drop models, if `sails.seed.routes==true` holds.

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
