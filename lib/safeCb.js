const debug = require("debug")("sails:hook:sanseed");

module.exports = (migrate, next) => {
  return migrate==="safe" ? 
    ((cb) => (err) => {
      debug(err);
      cb();
    })(next):
    next;
};
