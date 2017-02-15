var sailsBuilder = require("sails").Sails;
var request = require("supertest");


function normalSucces(done){
  return function(err) {
    return err ?
			done(err):
			done();
  };
}

function lowerSails (sails) {
  return function (done) {
		return sails ?
			sails.lower(done):
			done();
	};
}

describe("Basic tests 1 ::", function() {
	// Var to hold a running sails app instance
	var sails;
	// Before running any tests, attempt to lift Sails
	before(function (done) {
		// Hook will timeout in 10 seconds
		this.timeout(11000);
		// Attempt to lift sails
		sailsBuilder().lift({
			hooks: {
				// Load the hook
        seed: require("../"),
				// Skip grunt (unless your hook uses it)
				"grunt": false
			},
			log: {level: "error"},
      seed: {
        databases: {
          test: {}
        },
        routes: true
      }
		},function (err, _sails) {
			sails = _sails;			
			return (err) ? done(err) : done();
		});
	});
	// After tests are complete, lower Sails
	after(lowerSails(sails));
	// Test that Sails can lift with the hook in place
	it ("sails does not crash", function() {
		return true;
	});
	
	it("dont die", function (done) {
		request(sails.hooks.http.app).get("/seed/test")
		.expect(200)
		.end(normalSucces(done));
	});

  it("database not found", function (done) {
		request(sails.hooks.http.app).get("/seed/other")
		.expect(400)
		.end(normalSucces(done));
	});

  it("model missing", function (done) {
		request(sails.hooks.http.app).get("/seed/test/lol")
		.expect(400)
		.end(normalSucces(done));
	});
});

describe("Basic tests 2 ::", function() {
	// Var to hold a running sails app instance
	var sails;
	// Before running any tests, attempt to lift Sails
	before(function (done) {
		// Hook will timeout in 10 seconds
		this.timeout(11000);
		// Attempt to lift sails
		sailsBuilder().lift({
			hooks: {
				// Load the hook
        seed: require("../"),
				// Skip grunt (unless your hook uses it)
				"grunt": false
			},
			log: {level: "error"},
      seed: {
        databases: {
          test: {}
        },
        routes: false
      },
      port: 1338
		},function (err, _sails) {
			sails = _sails;			
			return (err) ? done(err) : done();
		});
	});
	// After tests are complete, lower Sails
	after(lowerSails(sails));
	// Test that Sails can lift with the hook in place
	it ("sails does not crash", function() {
		return true;
	});
	
	it("dont die", function (done) {
		request(sails.hooks.http.app).get("/seed/test")
		.expect(404)
		.end(normalSucces(done));
	});
});
