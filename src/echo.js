/**
 * Import dependencies
 */
import patch from './patch';
import { scheduleRender } from './util';

/**
 * MutationObserver options
 */
const observerOptions = {
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
export default class Echo {

    /**
     * Instantiate the class providing the
     * DOM node to create a virtual DOM clone
     * out of
     *
     * @constructor
     * @param {Element} node
     * @api private
     */
    constructor(node) {
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
    destroy() {
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
    getNode() {
        return this.node;
    }

    /**
     * Get the virtual DOM node
     *
     * @return {Element}
     * @api private
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
            scheduleRender(this.renderer);
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
    onChange() {
        if (document.contains(this.getNode())) {
            this.update();
            return;
        }
        this.render();
    }
}
