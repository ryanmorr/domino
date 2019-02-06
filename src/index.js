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
    const index = echos.findIndex((echo) => echo.getNode() === node);
    if (index !== -1) {
        return echos[index].getVNode();
    }
    const echo = new Echo(node);
    echos.push(echo);
    return echo.getVNode();
}

/**
 * Stop future updates
 *
 * @param {Element} node
 * @api public
 */
export function destroy(node) {
    const index = echos.findIndex((echo) => echo.getVNode() === node);
    if (index !== -1) {
        const echo = echos[index];
        echo.destroy();
        echos.splice(index, 1);
    }
}
