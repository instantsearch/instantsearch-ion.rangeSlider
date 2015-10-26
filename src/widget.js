'use strict';

var $ = require('jquery');
require('ion-rangeslider');

var instantsearch = require('instantsearch.js');

function slider(options) {
  var $container = $(options.container);
  var facetName = options.facetName;

  return {
    getConfiguration: function() {
      return {
        disjunctiveFacets: [facetName]
      };
    },

    render: function(args) {
      var helper = args.helper;
      var stats = args.results.getFacetStats(facetName);

      var from = helper.state.getNumericRefinement(facetName, '>=');
      from = from && from[0] || stats.min;

      var to = helper.state.getNumericRefinement(facetName, '<=');
      to = to && to[0] || stats.max;

      var sliderOptions = {
        type: 'double',
        grid: true,
        min: stats.min,
        max: stats.max,
        from: from,
        to: to,
        onFinish: function(data) {
          if (data.from !== from) {
            helper.removeNumericRefinement(facetName, '>=');
            helper.addNumericRefinement(facetName, '>=', data.from);
            helper.search();
          }
          if (data.to !== to) {
            helper.removeNumericRefinement(facetName, '<=');
            helper.addNumericRefinement(facetName, '<=', data.to);
            helper.search();
          }
        }
      };
      $container.ionRangeSlider(sliderOptions);
    }
  };
}

module.exports = instantsearch.widgets.ionRangeSlider = slider;
