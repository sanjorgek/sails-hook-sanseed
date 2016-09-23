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
In `config/seed.js`
~~~js
module.exports.seed = {
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
      migration: 'drop'
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
      migration: 'safe'
  },
  serverX: {
    //Some data
  }
}
~~~

## Use
Test at `/seed/production` or `/seed/test/user` to seed.

And `/drop/user` or `/drop` to drop models.


[npm-image]: https://img.shields.io/npm/v/sails-hook-sanseed.svg
[npm-url]: https://npmjs.org/package/sails-hook-sanseed
[downloads-image]: https://img.shields.io/npm/dm/sails-hook-sanseed.svg
[downloads-url]: https://npmjs.org/package/sails-hook-sanseed
