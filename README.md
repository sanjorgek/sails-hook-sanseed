# sails-hook-sanseed

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Build Status][build-image]][build-url]
  [![Code Climate][climate-image]][climate-url]
  [![Issue Count][issue-image]][issue-url]
  [![bitHound Overall Score][score-image]][score-url]
  [![bitHound Dependencies][dep-image]][dep-url]
  [![bitHound Dev Dependencies][devdep-image]][devdep-url]
  [![bitHound Code][code-image]][code-url]

## About
Hook for [sails](http://sailsjs.org/) to add items ('seed') to the base depending on different locations. See [faker.js](https://www.npmjs.com/package/faker#api-methods) for more details

  [![NPM][graph-image]][graph-url]

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
      gun: {
        scheme: [
          {
            data: {
              name: "revolver",
              ammo: 6
            }
          },
          {
            data: {
              name: "ak-47",
              ammo: 30
            }
          }
        ],
        //If you want to drop before seed
        migrate: "drop" //use safe to ignore DBErrors
      },
      user: {
        scheme: [
          {
            data: {
              //Some data
              username: "juan",
              name: "Paco",
              last: "Pedro",
              password: "de la mar"
            },
            relations: {
              //Use this to set Many-to-Many
              guns: [
                {
                  //Waterline query
                  name: "revolver"
                }
              ],
              // Use this to set One-to-Many and One-to-One
              favGun: {
                //Waterline query
                name: "ak-47"
              }
            }
          },
          {
            //More data
          }
        ],
        migrate: 'drop'
      }
    },
    //Another location
    production: {
      user: {
        scheme: {
          faker: {
            format: {
              username: "{{internet.userName}}",
              names: "{{name.firstName}} {{name.lastName}}",
              password: "{{internet.password}}"
            },
            locale: "es",
            quantity: 10
          },
          relations: {
            //Some relations
          }
        },
        // if you want to try without callback an error
        migrate: 'safe'
      }
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

## More

See [sails-sanseed-example](https://github.com/sanjorgek/sails-sanseed-example) for more details

[npm-image]: https://img.shields.io/npm/v/sails-hook-sanseed.svg
[npm-url]: https://npmjs.org/package/sails-hook-sanseed
[downloads-image]: https://img.shields.io/npm/dm/sails-hook-sanseed.svg
[downloads-url]: https://npmjs.org/package/sails-hook-sanseed
[build-image]: https://travis-ci.org/sanjorgek/sails-hook-sanseed.svg
[build-url]: https://travis-ci.org/sanjorgek/sails-hook-sanseed
[code-image]: https://www.bithound.io/github/sanjorgek/sails-hook-sanseed/badges/code.svg
[code-url]: https://www.bithound.io/github/sanjorgek/sails-hook-sanseed
[dep-image]: https://www.bithound.io/github/sanjorgek/sails-hook-sanseed/badges/dependencies.svg
[dep-url]: https://www.bithound.io/github/sanjorgek/sails-hook-sanseed/bithound/dependencies/npm
[devdep-image]: https://www.bithound.io/github/sanjorgek/sails-hook-sanseed/badges/devDependencies.svg
[devdep-url]: https://www.bithound.io/github/sanjorgek/sails-hook-sanseed/bithound/dependencies/npm
[score-image]: https://www.bithound.io/github/sanjorgek/sails-hook-sanseed/badges/score.svg
[score-url]: https://www.bithound.io/github/sanjorgek/sails-hook-sanseed
[issue-image]: https://codeclimate.com/github/sanjorgek/sails-hook-sanseed/badges/issue_count.svg
[issue-url]: https://codeclimate.com/github/sanjorgek/sails-hook-sanseed
[climate-image]: https://codeclimate.com/github/sanjorgek/sails-hook-sanseed/badges/gpa.svg
[climate-url]: https://codeclimate.com/github/sanjorgek/sails-hook-sanseed
[graph-image]: https://nodei.co/npm-dl/sails-hook-sanseed.png?months=6&height=1
[graph-url]: https://nodei.co/npm/sails-hook-sanseed/
