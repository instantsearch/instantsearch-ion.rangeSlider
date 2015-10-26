'use strict';

/* eslint-env jasmine */

var wd = require('yiewd');
var colors = require('colors');
var expect = require('chai').expect;
var f = require('util').format;
var env = process.env;

var browser;
var caps;

browser = (process.env.BROWSER || 'chrome').split(':');

caps = {
  name: f('[%s] instantsearch-ion.rangeSlider ui', browser.join(' , ')),
  browserName: browser[0]
};

setIf(caps, 'version', browser[1]);
setIf(caps, 'platform', browser[2]);
setIf(caps, 'tunnel-identifier', env['TRAVIS_JOB_NUMBER']);
setIf(caps, 'build', env['TRAVIS_BUILD_NUMBER']);
setIf(caps, 'tags', env['CI'] ? ['CI'] : ['local']);

function setIf(obj, key, val) {
  val && (obj[key] = val);
}

describe('instantsearch-ion.rangeSlider.js', function() {
  var driver;
  var allPassed = true;

  this.timeout(300000);

  before(function(done) {
    var host = 'ondemand.saucelabs.com';
    var port = 80;
    var username;
    var password;

    if (env['CI']) {
      host = 'localhost';
      port = 4445;
      username = env['SAUCE_USERNAME'];
      password = env['SAUCE_ACCESS_KEY'];
    }

    driver = wd.remote(host, port, username, password);
    driver.configureHttp({
      timeout: 30000,
      retries: 5,
      retryDelay: 200
    });

    driver.on('status', function(info) {
      console.log(info.cyan);
    });

    driver.on('command', function(meth, path, data) {
      console.log(' > ' + meth.yellow, path.grey, data || '');
    });

    driver.run(function*() {
      yield this.init(caps);
      yield this.get((env['TEST_HOST'] || 'http://localhost:8888') + '/test/integration/test.html');
      done();
    });
  });

  beforeEach(function(done) {
    driver.run(function*() {
      yield body.click();
      done();
    });
  });

  afterEach(function() {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(function(done) {
    driver.run(function*() {
      yield this.quit();
      yield driver.sauceJobStatus(allPassed);
      done();
    });
  });

  describe('context', function() {
    it('should test', function(done) {
      driver.run(function*() {
        done();
      });
    });
  });
});
