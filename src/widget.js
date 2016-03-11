'use strict';

var $ = require('jquery');
var instantsearch = require('instantsearch.js');

function slider(options) {
  if (!options.attributeName || !options.container) {
    throw new Error('ion.rangeSlider: usage: ionRangeSlider({container, attributeName})');
  }
  var $container = $(options.container);
  if ($container.length === 0) {
    throw new Error('ion.rangeSlider: cannot select \'' + options.container + '\'');
  }
  if (!$.fn.ionRangeSlider) {
    throw new Error('The ion.rangeSlider jQuery plugin is missing. Did you include ion.rangeSlider.min.js?');
  }
  var attributeName = options.attributeName;

  var needFacet = typeof options.min === 'undefined' || typeof options.max === 'undefined';

  return {
    getConfiguration: function() {
      return needFacet ? {
        disjunctiveFacets: [attributeName]
      } : {};
    },

    init: function(args) {
      var helper = args.helper;

      if (typeof options.min !== 'undefined') {
        helper.addNumericRefinement(attributeName, '>=', options.min);
      }
      if (typeof options.max !== 'undefined') {
        helper.addNumericRefinement(attributeName, '<=', options.max);
      }
    },

    render: function(args) {
      var helper = args.helper;

      var from = helper.state.getNumericRefinement(attributeName, '>=');
      from = from && from[0];

      var to = helper.state.getNumericRefinement(attributeName, '<=');
      to = to && to[0];

      var min;
      var max;
      if (needFacet) {
        var stats = args.results.getFacetStats(attributeName);
        min = stats.min;
        max = stats.max;
      } else {
        min = options.min;
        max = options.max;
      }
      from = from || min;
      to = to || max;

      var sliderOptions = {
        type: 'double',
        grid: true,
        min: min,
        max: max,
        from: from,
        to: to,
        onFinish: function(data) {
          if (data.from !== from) {
            helper.removeNumericRefinement(attributeName, '>=');
            helper.addNumericRefinement(attributeName, '>=', data.from);
            helper.search();
          }
          if (data.to !== to) {
            helper.removeNumericRefinement(attributeName, '<=');
            helper.addNumericRefinement(attributeName, '<=', data.to);
            helper.search();
          }
        }
      };
      $container.ionRangeSlider(sliderOptions);
    }
  };
}

module.exports = instantsearch.widgets.ionRangeSlider = slider;
