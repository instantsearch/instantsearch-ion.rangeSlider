'use strict';

/* eslint-env mocha, jasmine */

global.jQuery = require('jquery');

describe('Widget', function() {
  var $ = require('jquery');
  require('jasmine-jquery');
  require('../../src/widget.js');

  describe('now', function() {
    it('should test', function() {
      expect(true).toBe(true);
    });

  });
});
