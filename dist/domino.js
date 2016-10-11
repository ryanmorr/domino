/*! domino v0.1.0 | https://github.com/ryanmorr/domino */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.domino = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Import dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _patch = require('./patch');

var _patch2 = _interopRequireDefault(_patch);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Cache of all `Domino` instances
 */
var dominos = [];

/**
 * Get the supported `MutationObserver`
 */
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

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
 * @class Domino
 * @api private
 */

var Domino = function () {

    /**
     * Instantiate the class providing the
     * DOM node to create a virtual DOM clone
     * out of
     *
     * @constructor
     * @param {Node|String} node
     * @api private
     */
    function Domino(node) {
        _classCallCheck(this, Domino);

        this.node = (0, _util.getNode)(node);
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


    _createClass(Domino, [{
        key: 'destroy',
        value: function destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = this.node = this.vnode = null;
            }
        }

        /**
         * Get the source DOM node
         *
         * @return {Node}
         * @api private
         */

    }, {
        key: 'getNode',
        value: function getNode() {
            return this.node;
        }

        /**
         * Get the virtual DOM node
         *
         * @return {Node}
         * @api private
         */

    }, {
        key: 'getVNode',
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
        key: 'update',
        value: function update() {
            if (!this.renderer) {
                this.renderer = this.render.bind(this);
                (0, _util.updateDOM)(this.renderer);
            }
        }

        /**
         * Render the changes of the virtual
         * DOM tree to the source DOM tree
         *
         * @api private
         */

    }, {
        key: 'render',
        value: function render() {
            this.renderer = null;
            (0, _patch2.default)(this.node, this.vnode);
            this.getNode().dispatchEvent((0, _util.createEvent)('patch'));
        }

        /**
         * Called anytime a change is made to
         * the virtual DOM tree
         *
         * @api private
         */

    }, {
        key: 'onChange',
        value: function onChange() {
            if ((0, _util.contains)(document, this.getNode())) {
                this.update();
                return;
            }
            this.render();
        }
    }]);

    return Domino;
}();

/**
 * Factory function for creating
 * `Domino` instances
 *
 * @param {Node|String} node (optional)
 * @return {Domino}
 * @api public
 */


function domino() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

    node = (0, _util.getNode)(node);
    var index = (0, _util.findIndex)(dominos, function (dom) {
        return dom.getNode() === node;
    });
    if (index !== -1) {
        return dominos[index].getVNode();
    }
    var dom = new Domino(node);
    dominos.push(dom);
    return dom.getVNode();
}

/**
 * Stop future updates
 *
 * @param {Node} node
 * @api public
 */
domino.destroy = function destroy(node) {
    var index = (0, _util.findIndex)(dominos, function (dom) {
        return dom.getVNode() === node;
    });
    if (index !== -1) {
        var dom = dominos[index];
        dom.destroy();
        dominos.splice(index, 1);
    }
};

/**
 * Export the `domino` function
 */
exports.default = domino;
module.exports = exports['default'];

},{"./patch":2,"./util":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = patch;
/**
 * Patch a source node to match
 * the virtual node
 *
 * @param {Node} node
 * @param {Node} vnode
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
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getNode = getNode;
exports.findIndex = findIndex;
exports.contains = contains;
exports.updateDOM = updateDOM;
exports.createEvent = createEvent;
/**
 * Common variables
 */
var frame = void 0;
var batch = [];

/**
 * Feature test support for creating
 * event via Event constructors
 */
var supportsEventConstructors = function () {
    try {
        new CustomEvent('foo'); // eslint-disable-line no-new
        return true;
    } catch (e) {
        return false;
    }
}();

/**
 * Resolve a DOM node to return
 * an element node
 *
 * @param {Node|String} node
 * @return {Node}
 * @api private
 */
function getNode(node) {
    if (typeof node === 'string') {
        return document.querySelector(node);
    }
    return node.nodeType === 9 ? node.documentElement : node;
}

/**
 * Search an array for the first item
 * that satisfies a given condition and
 * return its index
 *
 * @param {Array} arr
 * @param {Function} fn
 * @return {Number}
 * @api public
 */
function findIndex(arr, fn) {
    if ('findIndex' in arr) {
        return arr.findIndex(fn);
    }
    for (var i = 0, len = arr.length; i < len; i++) {
        if (fn.call(arr[i], arr[i], i, arr)) {
            return i;
        }
    }
    return -1;
}

/**
 * Does the provided root element contain
 * the provided node
 *
 * @param {Element} root
 * @param {Element} el
 * @return {Boolean}
 * @api private
 */
function contains(root, el) {
    if ('contains' in root) {
        return root.contains(el);
    }
    return !!(root.compareDocumentPosition(el) & 16);
}

/**
 * Use `requestAnimationFrame` to
 * batch DOM updates to boost
 * performance
 *
 * @param {Function} fn
 * @api private
 */
function updateDOM(fn) {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.push(fn);
    frame = requestAnimationFrame(function () {
        frame = null;
        var render = void 0;
        while (render = batch.shift()) {
            render();
        }
    });
}

/**
 * Create a custom event to dispatch
 * on an element
 *
 * @param {String} type
 * @return {Event}
 * @api private
 */
function createEvent(type) {
    if (supportsEventConstructors) {
        return new CustomEvent(type, { bubbles: false, cancelable: false });
    }
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(type, false, false, null);
    return evt;
}

},{}]},{},[1])(1)
});

