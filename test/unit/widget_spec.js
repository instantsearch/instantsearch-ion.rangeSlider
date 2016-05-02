'use strict';

/* eslint-env mocha, jasmine */

var $ = global.jQuery = require('jquery');
var instantsearch = require('instantsearch.js');
require('ion-rangeslider');

describe('Widget', function() {
  require('jasmine-jquery');
  require('../../src/widget.js');

  beforeEach(function() {
    this.$fixture = $(setFixtures('<div id="slider"></div>'));
  });

  it('registers the widget', function() {
    expect(instantsearch.widgets.ionRangeSlider).not.toBe(undefined);
  });

  it('throws if the container is not valid', function() {
    expect(function() {
      instantsearch.widgets.ionRangeSlider({container: '#slider-doesnt-exist', attributeName: 'price'});
    }).toThrow();
  });

  it('throws if the attributeName is not defined', function() {
    expect(function() {
      instantsearch.widgets.ionRangeSlider({container: '#slider'});
    }).toThrow();
  });

  it('throws if the ion.rangeSlider is not defined', function() {
    var old = $.fn.ionRangeSlider;
    try {
      $.fn.ionRangeSlider = undefined;
      expect(function() {
        instantsearch.widgets.ionRangeSlider({container: '#slider', attributeName: 'price'});
      }).toThrow();
    } finally {
      $.fn.ionRangeSlider = old;
    }
  });

  describe('when instantiated', function() {
    var widget;

    beforeEach(function() {
      widget = instantsearch.widgets.ionRangeSlider({container: '#slider', attributeName: 'price'});
    });

    it('configures the helper', function() {
      expect(widget.getConfiguration()).toEqual({disjunctiveFacets: ['price']});
    });

    it('renders the slider', function() {
      var results = {
        getFacetStats: sinon.stub().returns({min: 0, max: 100})
      };
      var helper = {
        state: {
          getNumericRefinement: sinon.stub().returns(null)
        },
        removeNumericRefinement: sinon.spy(),
        addNumericRefinement: sinon.spy(),
        search: sinon.spy()
      };
      widget.render({helper: helper, results: results});
      expect(results.getFacetStats.calledTwice).toBe(true);
      expect(helper.state.getNumericRefinement.calledTwice).toBe(true);
      expect(helper.removeNumericRefinement.called).toBe(false);
      expect(helper.addNumericRefinement.called).toBe(false);
      expect(helper.search.called).toBe(false);
    });
  });
});
