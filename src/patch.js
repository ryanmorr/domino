/**
 * Patch a source node to match
 * the virtual node
 *
 * @param {Node} node
 * @param {String} name
 * @return {String|Null}
 * @api private
 */
function getAttribute(node, name) {
    const value = name in node ? node[name] : node.getAttribute(name);
    return value == null ? null : value;
}

/**
 * Patch a source node to match
 * the virtual node
 *
 * @param {Node} node
 * @param {Node} vnode
 * @api private
 */
export default function patch(node, vnode) {
    if (vnode.hasChildNodes()) {
        const vnodeChildNodes = vnode.childNodes;
        const nodeChildNodes = node.childNodes;
        for (let i = Math.min(nodeChildNodes.length, vnodeChildNodes.length) - 1; i >= 0; i--) {
            patch(nodeChildNodes[i], vnodeChildNodes[i]);
        }
        if (nodeChildNodes.length > vnodeChildNodes.length) {
            for (let i = nodeChildNodes.length - 1; i >= vnodeChildNodes.length; i--) {
                node.removeChild(nodeChildNodes[i]);
            }
        }
        if (nodeChildNodes.length < vnodeChildNodes.length) {
            for (let i = nodeChildNodes.length; i < vnodeChildNodes.length; i++) {
                node.appendChild(vnodeChildNodes[i].cloneNode(true));
            }
        }
    }
    if (vnode.hasAttributes()) {
        const vnodeAttrs = vnode.attributes;
        const nodeAttrs = node.attributes;
        for (let i = nodeAttrs.length - 1; i >= 0; i--) {
            const name = nodeAttrs[i].name;
            if (getAttribute(vnode, name) === null) {
                node.removeAttribute(name);
            }
        }
        for (let i = vnodeAttrs.length - 1; i >= 0; i--) {
            const attr = vnodeAttrs[i];
            const name = attr.name;
            const value = attr.value;
            if (getAttribute(node, name) !== value) {
                node.setAttribute(name, value);
            }
        }
    }
}
