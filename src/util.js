/**
 * Common variables
 */
let frame;
const batch = [];

/**
 * Resolve a DOM node to return
 * an element node
 *
 * @param {Element|String} node
 * @return {Element}
 * @api private
 */
export function getElement(node) {
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
export function scheduleRender(callback) {
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
    while (batch.length) batch.pop()();
}
