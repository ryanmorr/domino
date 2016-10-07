/**
 * Patch a source node to match
 * the virtual node
 *
 * @param {NamedNodeMap} attrs
 * @param {String} name
 * @return {String|Undefined}
 * @api private
 */
function getAttribute(attrs, name) {
    for (let i = attrs.length - 1; i >= 0; i--) {
        if (attrs[i].name === name) {
            return attrs[i].value;
        }
    }
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
    const vnodeAttrs = vnode.attributes;
    const nodeAttrs = node.attributes;
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
    if (vnodeAttrs) {
        for (let i = nodeAttrs.length - 1; i >= 0; i--) {
            const name = nodeAttrs[i].name;
            if (getAttribute(vnodeAttrs, name) === undefined) {
                node.removeAttribute(name);
            }
        }
        for (let i = vnodeAttrs.length - 1; i >= 0; i--) {
            const attr = vnodeAttrs[i];
            const name = attr.name;
            const value = attr.value;
            if (getAttribute(nodeAttrs, name) !== value) {
                node.setAttribute(name, value);
            }
        }
    }
}
