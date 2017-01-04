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
Hook for [sails](http://sailsjs.org/) to add items ('seed') to the database depending on different locations. See [faker.js](http://marak.github.io/faker.js/) for more details.

  [![NPM][graph-image]][graph-url]

## Settings
Install

```
npm install sails-hook-sanseed
```

Define at `config/seed.js`

```js
module.exports.seed = {
  databases : {
    test: {
      // A simple model creation
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
              name: "ak-47"
            },
            faker: {
              ammo: "{{random.number}}" // use faker to fill an attribute
            },
            locale: "es", // set lang, default en
          }
        ],
        //If you want to drop before seed
        migrate: "drop" //use safe to ignore DBErrors
      },
      // A model with associations
      user: {
        scheme: [
          {
            data: {
              username: "juan",
              name: "Paco",
              last: "Pedro",
              password: "de la mar"
            },
            // Use this to set One-to-Many and One-to-One
            oneTo: {
              // Use a JSON
              favGun: {
                //Waterline query
                name: "ak-47"
              }
            },
            //Use this to set Many-to-Many
            manyTo: {
              // Use an Array
              guns: [
                {
                  //Waterline query
                  name: "revolver"
                },
                {/** */}
              ],
            }
          },
          {
            //More data
          }
        ],
        migrate: 'drop'
      }
    },
    //Another database
    production: {
      // Use Faker.js to fill schemas
      user: {
        faker: {
          format: {
            username: "{{internet.userName}}",
            names: "{{name.firstName}} {{name.lastName}}",
            password: "{{internet.password}}"
          },
          locale: "es", // set lang, default en
          quantity: 10, // set many elements as you wish, default 1
          oneTo: {/** */},
          manyTo: {/** */}
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
```

## Use
If `sails.seed.routes` is true seed your models with `/seed/:database` or `/seed/:database/:model` routes, and `/drop/:model` or `/drop` routes to drop models.

### Aviable Functions
Also you have `sails.seed` with

#### seedModel(database, modelName, callback)

__Arguments__

* `database` - A string with database name.
* `modelName` - A string with model name.
* `callback(err)` - A callback which is called when all task have finished, or an error occurs.

#### seedAll(database, callback)

__Arguments__

* `database` - A string with database name.
* `callback(err)` - A callback which is called when all task have finished, or an error occurs.

#### dropModel(modelName, callback)

__Arguments__

* `modelName` - A string with model name.
* `callback(err)` - A callback which is called when all task have finished, or an error occurs.

#### dropAll(callback)

__Arguments__

* `callback(err)` - A callback which is called when all task have finished, or an error occurs.

Define at `/config/routes.js`:

```js
module.exports.routes{
  'get /sanseed/:database': function  (req, res, next) {
    sails.seed.seedAll(req.params.database, function(err){
      if(err){
        //do something
      }else{
        //do something
      }
    });
  }
}
```

### Policies
You have:

* `seedModel`
* `seedAll`
* `dropModel`
* `dropAll`

Define at `/config/routes.js`:

```js
module.exports.routes{
  'get /sandrop' : [{policy: 'dropAll'}]
}
```

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
