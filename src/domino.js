/**
 * Import dependencies
 */
import patch from './patch';
import { getNode, findIndex, contains, updateDOM } from './util';

/**
 * Cache of all `Domino` instances
 */
const dominos = [];

/**
 * Get the supported `MutationObserver`
 */
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

/**
 * Virtual DOM class
 *
 * @class Domino
 * @api public
 */
class Domino {

    /**
     * Instantiate the class providing the
     * DOM node to create a virtual DOM clone
     * out of
     *
     * @constructor
     * @param {Node} node
     * @api public
     */
    constructor(node) {
        this.node = getNode(node);
        this.vnode = this.node.cloneNode(true);
        this.observer = new MutationObserver(this.onChange.bind(this));
        this.observer.observe(this.vnode, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true
        });
    }

    /**
     * Disconnect the mutation observer
     * and nullify the properties
     *
     * @api public
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = this.node = this.vnode = null;
        }
    }

    /**
     * Get the source DOM node
     *
     * @return {Node}
     * @api public
     */
    getNode() {
        return this.node;
    }

    /**
     * Get the virtual DOM node
     *
     * @return {Node}
     * @api public
     */
    getVNode() {
        return this.vnode;
    }

    /**
     * Schedule a frame to update the
     * source DOM tree
     *
     * @api private
     */
    update() {
        if (!this.renderer) {
            this.renderer = this.render.bind(this);
            updateDOM(this.renderer);
        }
    }

    /**
     * Render the changes of the virtual
     * DOM tree to the source DOM tree
     *
     * @api private
     */
    render() {
        this.renderer = null;
        patch(this.node, this.vnode);
    }

    /**
     * Called anytime a change is made to
     * the virtual DOM tree
     *
     * @api private
     */
    onChange() {
        if (contains(document, this.getNode())) {
            this.update();
            return;
        }
        this.render();
    }
}

/**
 * Factory function for creating
 * `Domino` instances
 *
 * @param {Node} node (optional)
 * @return {Domino}
 * @api public
 */
function domino(node = document) {
    node = getNode(node);
    const index = findIndex(dominos, (dom) => dom.getNode() === node);
    if (index !== -1) {
        return dominos[index].getVNode();
    }
    const dom = new Domino(node);
    dominos.push(dom);
    return dom.getVNode();
}

/**
 * Factory function for creating
 * `Domino` instances
 *
 * @param {Node} node
 * @api public
 */
domino.destroy = function destroy(node) {
    const index = findIndex(dominos, (dom) => dom.getVNode() === node);
    if (index !== -1) {
        const dom = dominos[index];
        dom.destroy();
        dominos.splice(index, 1);
    }
};

/**
 * Export the `domino` function
 */
export default domino;
