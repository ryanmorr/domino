/**
 * Import dependencies
 */
import Echo from './echo';
import { getElement } from './util';

/**
 * Cache of all `Echo` instances
 */
const echos = [];

/**
 * Factory function for creating
 * `Echo` instances
 *
 * @param {Element|String} node (optional)
 * @return {Echo}
 * @api public
 */
export function echo(node = document) {
    node = getElement(node);
    const index = echos.findIndex((dom) => dom.getNode() === node);
    if (index !== -1) {
        return echos[index].getVNode();
    }
    const dom = new Echo(node);
    echos.push(dom);
    return dom.getVNode();
}

/**
 * Stop future updates
 *
 * @param {Element} node
 * @api public
 */
export function destroy(node) {
    const index = echos.findIndex((dom) => dom.getVNode() === node);
    if (index !== -1) {
        const dom = echos[index];
        dom.destroy();
        echos.splice(index, 1);
    }
}
