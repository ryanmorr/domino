/**
 * Resolve a DOM node to return
 * an element node
 *
 * @param {Node} node
 * @return {Node}
 * @api private
 */
export function getNode(node) {
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
export function findIndex(arr, fn) {
    if ('findIndex' in arr) {
        return arr.findIndex(fn);
    }
    for (let i = 0, len = arr.length; i < len; i++) {
        if (fn.call(arr[i], arr[i], i, arr)) {
            return i;
        }
    }
    return -1;
}
