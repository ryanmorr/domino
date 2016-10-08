/**
 * Import dependencies
 */
import patch from './patch';

/**
 * Cache of all `Domino` instances
 */
const items = [];

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
        this.dom = node.nodeType === 9 ? node.documentElement : node;
        this.vdom = this.dom.cloneNode(true);
        this.observer = new MutationObserver(this.onChange.bind(this));
        this.observer.observe(this.vdom, {
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
        this.observer.disconnect();
        this.observer = this.dom = this.vdom = null;
    }

    /**
     * Get the virtual DOM node
     *
     * @return {Node}
     * @api public
     */
    getVirtualDOM() {
        return this.vdom;
    }

    /**
     * Called anytime a change is made to
     * the virtual DOM tree
     *
     * @api private
     */
    onChange() {
        patch(this.dom, this.vdom);
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
    const dom = new Domino(node);
    items.push(dom);
    return dom.getVirtualDOM();
}

/**
 * Factory function for creating
 * `Domino` instances
 *
 * @param {Node} node (optional)
 * @api public
 */
domino.destroy = function destroy(node = document) {
    items.forEach((item, i) => {
        if (item.getVirtualDOM() === node) {
            item.destroy();
            items.splice(i, 1);
            return;
        }
    });
};

/**
 * Export the `domino` function
 */
export default domino;
