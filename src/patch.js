/**
 * Patch a source node to match
 * the virtual node
 *
 * @param {Node} node
 * @param {Node} vnode
 * @api private
 */
export default function patch(node, vnode) {
    if (node.nodeType !== vnode.nodeType || node.nodeName !== vnode.nodeName) {
        node.parentNode.replaceChild(vnode.cloneNode(true), node);
    } else if (vnode.nodeType === 3) {
        const data = vnode.data;
        if (node.data !== vnode.data) {
            node.data = data;
        }
    } else {
        const vnodeChildNodes = vnode.childNodes;
        const nodeChildNodes = node.childNodes;
        const vnodeAttrs = vnode.attributes;
        const nodeAttrs = node.attributes;
        for (let i = Math.min(nodeChildNodes.length, vnodeChildNodes.length) - 1; i >= 0; i--) {
            patch(nodeChildNodes[i], vnodeChildNodes[i]);
        }
        if (nodeChildNodes.length > vnodeChildNodes.length) {
            for (let i = nodeChildNodes.length - 1; i >= vnodeChildNodes.length; i--) {
                node.removeChild(nodeChildNodes[i]);
            }
        } else if (nodeChildNodes.length < vnodeChildNodes.length) {
            const frag = document.createDocumentFragment();
            for (let i = nodeChildNodes.length; i < vnodeChildNodes.length; i++) {
                frag.appendChild(vnodeChildNodes[i].cloneNode(true));
            }
            node.appendChild(frag);
        }
        for (let i = nodeAttrs.length - 1; i >= 0; i--) {
            const name = nodeAttrs[i].name;
            if (!vnode.hasAttribute(name)) {
                node.removeAttribute(name);
            }
        }
        for (let i = vnodeAttrs.length - 1; i >= 0; i--) {
            const attr = vnodeAttrs[i];
            const name = attr.name;
            const value = attr.value;
            if (node.getAttribute(name) !== value) {
                node.setAttribute(name, value);
            }
        }
    }
}
