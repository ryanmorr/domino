/*! @ryanmorr/echo v1.0.0 | https://github.com/ryanmorr/echo */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.echo = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _patch = _interopRequireDefault(require("./patch"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * MutationObserver options
 */
var observerOptions = {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true
};
/**
 * Virtual DOM class
 *
 * @class Echo
 * @api private
 */

var Echo =
/*#__PURE__*/
function () {
  /**
   * Instantiate the class providing the
   * DOM node to create a virtual DOM clone
   * out of
   *
   * @constructor
   * @param {Element} node
   * @api private
   */
  function Echo(node) {
    _classCallCheck(this, Echo);

    this.node = node;
    this.vnode = this.node.cloneNode(true);
    this.observer = new MutationObserver(this.onChange.bind(this));
    this.observer.observe(this.vnode, observerOptions);
  }
  /**
   * Disconnect the mutation observer
   * and nullify the properties
   *
   * @api private
   */


  _createClass(Echo, [{
    key: "destroy",
    value: function destroy() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = this.node = this.vnode = null;
      }
    }
    /**
     * Get the source DOM node
     *
     * @return {Element}
     * @api private
     */

  }, {
    key: "getNode",
    value: function getNode() {
      return this.node;
    }
    /**
     * Get the virtual DOM node
     *
     * @return {Element}
     * @api private
     */

  }, {
    key: "getVNode",
    value: function getVNode() {
      return this.vnode;
    }
    /**
     * Schedule a frame to update the
     * source DOM tree
     *
     * @api private
     */

  }, {
    key: "update",
    value: function update() {
      if (!this.renderer) {
        this.renderer = this.render.bind(this);
        (0, _util.scheduleRender)(this.renderer);
      }
    }
    /**
     * Render the changes of the virtual
     * DOM tree to the source DOM tree
     *
     * @api private
     */

  }, {
    key: "render",
    value: function render() {
      this.renderer = null;
      (0, _patch.default)(this.node, this.vnode);
      this.getNode().dispatchEvent(new CustomEvent('patch', {
        bubbles: false,
        cancelable: false
      }));
    }
    /**
     * Called anytime a change is made to
     * the virtual DOM tree
     *
     * @api private
     */

  }, {
    key: "onChange",
    value: function onChange() {
      if (document.contains(this.getNode())) {
        this.update();
        return;
      }

      this.render();
    }
  }]);

  return Echo;
}();

exports.default = Echo;
module.exports = exports.default;

},{"./patch":3,"./util":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.echo = echo;
exports.destroy = destroy;

var _echo2 = _interopRequireDefault(require("./echo"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Import dependencies
 */

/**
 * Cache of all `Echo` instances
 */
var echos = [];
/**
 * Factory function for creating
 * `Echo` instances
 *
 * @param {Element|String} node (optional)
 * @return {Echo}
 * @api public
 */

function echo() {
  var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  node = (0, _util.getElement)(node);
  var index = echos.findIndex(function (echo) {
    return echo.getNode() === node;
  });

  if (index !== -1) {
    return echos[index].getVNode();
  }

  var echo = new _echo2.default(node);
  echos.push(echo);
  return echo.getVNode();
}
/**
 * Stop future updates
 *
 * @param {Element} node
 * @api public
 */


function destroy(node) {
  var index = echos.findIndex(function (echo) {
    return echo.getVNode() === node;
  });

  if (index !== -1) {
    var _echo = echos[index];

    _echo.destroy();

    echos.splice(index, 1);
  }
}

},{"./echo":1,"./util":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patch;

/**
 * Patch a source node to match
 * the virtual node
 *
 * @param {Element} node
 * @param {Element} vnode
 * @api private
 */
function patch(node, vnode) {
  if (node.nodeType !== vnode.nodeType || node.nodeName !== vnode.nodeName) {
    node.parentNode.replaceChild(vnode.cloneNode(true), node);
    return;
  }

  if (vnode.nodeType === 3) {
    var data = vnode.data;

    if (node.data !== data) {
      node.data = data;
    }

    return;
  }

  var nodeChildNodes = node.childNodes;
  var vnodeChildNodes = vnode.childNodes;

  for (var i = Math.min(nodeChildNodes.length, vnodeChildNodes.length) - 1; i >= 0; i--) {
    patch(nodeChildNodes[i], vnodeChildNodes[i]);
  }

  if (!node.isEqualNode(vnode)) {
    var nodeAttrs = node.attributes;
    var vnodeAttrs = vnode.attributes;

    if (nodeChildNodes.length > vnodeChildNodes.length) {
      for (var _i = nodeChildNodes.length - 1; _i >= vnodeChildNodes.length; _i--) {
        node.removeChild(nodeChildNodes[_i]);
      }
    } else if (nodeChildNodes.length < vnodeChildNodes.length) {
      var frag = document.createDocumentFragment();

      for (var _i2 = nodeChildNodes.length; _i2 < vnodeChildNodes.length; _i2++) {
        frag.appendChild(vnodeChildNodes[_i2].cloneNode(true));
      }

      node.appendChild(frag);
    }

    for (var _i3 = nodeAttrs.length - 1; _i3 >= 0; _i3--) {
      var name = nodeAttrs[_i3].name;

      if (!vnode.hasAttribute(name)) {
        node.removeAttribute(name);
      }
    }

    for (var _i4 = vnodeAttrs.length - 1; _i4 >= 0; _i4--) {
      var attr = vnodeAttrs[_i4];
      var _name = attr.name;
      var value = attr.value;

      if (node.getAttribute(_name) !== value) {
        node.setAttribute(_name, value);
      }
    }
  }
}

module.exports = exports.default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElement = getElement;
exports.scheduleRender = scheduleRender;

/**
 * Common variables
 */
var frame;
var batch = [];
/**
 * Resolve a DOM node to return
 * an element node
 *
 * @param {Element|String} node
 * @return {Element}
 * @api private
 */

function getElement(node) {
  if (typeof node === 'string') {
    return document.querySelector(node);
  }

  return node.nodeType === 9 ? node.documentElement : node;
}
/**
 * Schedule a frame to render DOM
 * updates
 *
 * @param {Function} callback
 * @api private
 */


function scheduleRender(callback) {
  if (!frame) {
    frame = requestAnimationFrame(render);
  }

  batch.push(callback);
}
/**
 * Render all the updates
 *
 * @api private
 */


function render() {
  frame = null;

  while (batch.length) {
    batch.pop()();
  }
}

},{}]},{},[2])(2)
});

