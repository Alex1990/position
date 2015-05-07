/*!
 * position - position an element relative to the other element
 * MIT license | (c) 2015 Alex Chao
 */

!(function(global, factory) {

  // Uses CommonJS, AMD or browser global to create a jQuery plugin.
  // See: https://github.com/umdjs/umd
  if (typeof define === 'function' && define.amd) {
    // Expose this plugin as an AMD module. Register an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS module
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(global.jQuery);
  }

}(this, function($) {

  'use strict';

  // Default settings.
  var defaults = {
    my: 'center',
    at: 'center',
    of: null
  };

  var rPosKey = /^(top|left|center|right|bottom)?([+-]\d*\.?\d*%?)?$/;
  var posKeyMap = {
    top: 0,
    left: 0,
    center: 0.5,
    right: 1,
    bottom: 1
  };

  // Normalize the my/at option value.
  // Examples:
  //   'center' => 'center center'
  //   'top' => 'center top'
  //   'left' => 'left center'
  function normalizePosKey(posKey) {
    var posKeys = $.trim(posKey).split(/\s+/);

    if (!posKeys[1]) {
      if (/top|bottom/.test(posKeys[0])) {
        posKeys[1] = posKeys[0];
        posKeys[0] = 'center';
      } else {
        posKeys[1] = 'center';
      }
    }

    return posKeys;
  }

  // Calculate the pixel value.
  function calcPos(posKeys, width, height) {
    var pos = [0, 0];
    var dimension = [width, height];

    for (var i = 0; i < posKeys.length; i++) {
      posKeys[i].replace(rPosKey, function(m, s1, s2) {
        if (s1) {
          pos[i] += posKeyMap[s1] * dimension[i];
        }
        if (s2) {
          if (s2.indexOf('%') > 1) {
            pos[i] += dimension[i] * parseFloat(s2) / 100;
          } else {
            pos[i] += parseFloat(s2);
          }
        }
      });
    }

    return pos;
  }

  var originalPosition = $.fn.position;

  // If no argument is passed, the original position method will be called.
  // If a configurable object is passed, the element will be positioned.
  $.fn.position = function(opts) {
    if (arguments.length) {
      opts = $.extend({}, defaults, opts);
      this.each(function(i, my) {
        var $my = $(my);
        var $at = $(opts.of);
        var $offsetParent = $my.offsetParent();

        var myW = $my.outerWidth();
        var myH = $my.outerHeight();
        var atW = $at.outerWidth();
        var atH = $at.outerHeight();
        var atPos = $at.offset();
        var offsetParentPos = $offsetParent.offset();
        var atOffset = calcPos(normalizePosKey(opts.at), atW, atH);
        var myOffset = calcPos(normalizePosKey(opts.my), myW, myH);

        $my.css({
          position: 'absolute',
          left: atOffset[0] - myOffset[0] + atPos.left - offsetParentPos.left,
          top: atOffset[1] - myOffset[1] + atPos.top - offsetParentPos.top
        });
      });

      return this;
    } else {
      originalPosition.call(this);
    }
  };

}));
