/* eslint-disable max-len */

import { expect } from 'chai';
import domino from '../../src/domino';

// Parse HTML string into DOM node
function parseHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.removeChild(div.firstChild);
}

// Schedule a frame to call a function
function asap() {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || function requestAnimationFrame(cb) { return window.setTimeout(cb, 1000 / 60); };
}

describe('domino', () => {
    it('should support adding attributes', () => {
        const source = parseHTML('<div></div>');
        const node = domino(source);
        node.setAttribute('id', 'foo');
        asap(() => {
            expect(source.id).to.equal('foo');
        });
    });

    it('should support removing attributes', () => {
        const source = parseHTML('<div id="foo"></div>');
        const node = domino(source);
        node.removeAttribute('id');
        asap(() => {
            expect(source.hasAttribute('id')).to.equal(false);
        });
    });

    it('should support adding elements', () => {
        const source = parseHTML('<div></div>');
        const node = domino(source);
        node.appendChild(document.createElement('span'));
        asap(() => {
            expect(source.firstChild.nodeName).to.equal('SPAN');
        });
    });

    it('should support removing elements', () => {
        const source = parseHTML('<div><span></span></div>');
        const node = domino(source);
        node.removeChild(node.firstChild);
        asap(() => {
            expect(source.firstChild).to.equal(null);
        });
    });

    it('should support adding text nodes', () => {
        const source = parseHTML('<div></div>');
        const node = domino(source);
        const text = document.createTextNode('foo');
        node.appendChild(text);
        asap(() => {
            expect(source.textContent).to.equal('foo');
        });
    });

    it('should support removing text nodes', () => {
        const source = parseHTML('<div>foo</div>');
        const node = domino(source);
        node.removeChild(node.firstChild);
        asap(() => {
            expect(source.textContent).to.equal('');
        });
    });

    it('should support changing text node data', () => {
        const source = parseHTML('<div></div>');
        const node = domino(source);
        const text = document.createTextNode('foo');
        node.appendChild(text);
        asap(() => {
            expect(source.textContent).to.equal('foo');
            text.data = 'bar';
            asap(() => {
                expect(source.textContent).to.equal('bar');
            });
        });
    });

    it('should support destroying the instance', () => {
        const source = parseHTML('<div></div>');
        const node = domino(source);
        domino.destroy(node);
        node.setAttribute('id', 'foo');
        asap(() => {
            expect(source.hasAttribute('id')).to.equal(false);
        });
    });
});
