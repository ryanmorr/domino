/* eslint-disable max-len */

import { expect } from 'chai';
import sinon from 'sinon';
import domino from '../../src/domino';

// Polyfill `requestAnimationFrame` and 'cancelAnimationFrame'
// for PhantomJS
window.requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || function requestAnimationFrame(cb) { return window.setTimeout(cb, 1000 / 60); };

window.cancelAnimationFrame = window.cancelAnimationFrame
    || function cancelAnimationFrame(id) { window.clearTimeout(id); };

// Parse HTML string into DOM node
function parseHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.removeChild(div.firstChild);
}

// Schedule a frame to call a function
function frame(fn) {
    requestAnimationFrame(fn);
}

describe('domino', () => {
    it('should use the document element by default', () => {
        const vnode = domino();
        expect(vnode.nodeName).to.equal('HTML');
        const vnode2 = domino(document);
        expect(vnode2.nodeName).to.equal('HTML');
    });

    it('should return the same instance if the same source node is used twice', () => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        expect(domino(source)).to.equal(vnode);
        const vnode2 = domino();
        expect(domino(document)).to.equal(vnode2);
    });

    it('should support destroying the instance', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        domino.destroy(vnode);
        vnode.setAttribute('id', 'foo');
        frame(() => {
            expect(source.hasAttribute('id')).to.equal(false);
            done();
        });
    });

    it('should support adding attributes', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        vnode.setAttribute('id', 'foo');
        frame(() => {
            expect(source.id).to.equal('foo');
            expect(source.outerHTML).to.equal('<div id="foo"></div>');
            done();
        });
    });

    it('should support adding deeply nested attributes', (done) => {
        const source = parseHTML('<section><div><span></span></div></section>');
        const vnode = domino(source);
        vnode.querySelector('span').setAttribute('id', 'foo');
        frame(() => {
            expect(source.querySelector('span').id).to.equal('foo');
            expect(source.outerHTML).to.equal('<section><div><span id="foo"></span></div></section>');
            done();
        });
    });

    it('should support removing attributes', (done) => {
        const source = parseHTML('<div id="foo"></div>');
        const vnode = domino(source);
        vnode.removeAttribute('id');
        frame(() => {
            expect(source.hasAttribute('id')).to.equal(false);
            expect(source.outerHTML).to.equal('<div></div>');
            done();
        });
    });

    it('should support removing deeply nested attributes', (done) => {
        const source = parseHTML('<section><div><span id="foo"></span></div></section>');
        const vnode = domino(source);
        vnode.querySelector('span').removeAttribute('id');
        frame(() => {
            expect(source.querySelector('span').hasAttribute('id')).to.equal(false);
            expect(source.outerHTML).to.equal('<section><div><span></span></div></section>');
            done();
        });
    });

    it('should support adding elements', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        vnode.appendChild(document.createElement('span'));
        frame(() => {
            expect(source.firstChild.nodeName).to.equal('SPAN');
            expect(source.outerHTML).to.equal('<div><span></span></div>');
            done();
        });
    });

    it('should support adding deeply nested elements', (done) => {
        const source = parseHTML('<section><div></div></section>');
        const vnode = domino(source);
        vnode.querySelector('div').appendChild(document.createElement('span'));
        frame(() => {
            expect(source.querySelector('div').firstChild.nodeName).to.equal('SPAN');
            expect(source.outerHTML).to.equal('<section><div><span></span></div></section>');
            done();
        });
    });

    it('should support removing elements', (done) => {
        const source = parseHTML('<div><span></span></div>');
        const vnode = domino(source);
        vnode.removeChild(vnode.firstChild);
        frame(() => {
            expect(source.firstChild).to.equal(null);
            expect(source.outerHTML).to.equal('<div></div>');
            done();
        });
    });

    it('should support removing deeply nested elements', (done) => {
        const source = parseHTML('<section><div><span></span></div></section>');
        const vnode = domino(source);
        const vdiv = vnode.querySelector('div');
        vdiv.removeChild(vdiv.firstChild);
        frame(() => {
            expect(source.querySelector('div').firstChild).to.equal(null);
            expect(source.outerHTML).to.equal('<section><div></div></section>');
            done();
        });
    });

    it('should support adding text nodes', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        const text = document.createTextNode('foo');
        vnode.appendChild(text);
        frame(() => {
            expect(source.textContent).to.equal('foo');
            expect(source.outerHTML).to.equal('<div>foo</div>');
            done();
        });
    });

    it('should support adding deeply nested text nodes', (done) => {
        const source = parseHTML('<section><div><span></span></div></section>');
        const vnode = domino(source);
        const text = document.createTextNode('foo');
        vnode.querySelector('span').appendChild(text);
        frame(() => {
            expect(source.querySelector('span').textContent).to.equal('foo');
            expect(source.outerHTML).to.equal('<section><div><span>foo</span></div></section>');
            done();
        });
    });

    it('should support removing text nodes', (done) => {
        const source = parseHTML('<div>foo</div>');
        const vnode = domino(source);
        vnode.removeChild(vnode.firstChild);
        frame(() => {
            expect(source.textContent).to.equal('');
            expect(source.outerHTML).to.equal('<div></div>');
            done();
        });
    });

    it('should support removing deeply nested text nodes', (done) => {
        const source = parseHTML('<section><div><span>foo</span></div></section>');
        const vnode = domino(source);
        const vspan = vnode.querySelector('span');
        vspan.removeChild(vspan.firstChild);
        frame(() => {
            expect(source.querySelector('span').textContent).to.equal('');
            expect(source.outerHTML).to.equal('<section><div><span></span></div></section>');
            done();
        });
    });

    it('should support changing deeply nested text node data', (done) => {
        const source = parseHTML('<section><div><span></span></div></section>');
        const vnode = domino(source);
        const text = document.createTextNode('foo');
        vnode.querySelector('span').appendChild(text);
        frame(() => {
            expect(source.querySelector('span').textContent).to.equal('foo');
            expect(source.outerHTML).to.equal('<section><div><span>foo</span></div></section>');
            text.data = 'bar';
            frame(() => {
                expect(source.querySelector('span').textContent).to.equal('bar');
                expect(source.outerHTML).to.equal('<section><div><span>bar</span></div></section>');
                done();
            });
        });
    });

    it('should support changing the element type of nested nodes', (done) => {
        const source = parseHTML('<div><span></span></div>');
        const vnode = domino(source);
        vnode.replaceChild(document.createElement('em'), vnode.firstChild);
        frame(() => {
            expect(source.firstChild.nodeName).to.equal('EM');
            expect(source.outerHTML).to.equal('<div><em></em></div>');
            done();
        });
    });

    it('should support changing the node type of nested nodes', (done) => {
        const source = parseHTML('<div><span></span></div>');
        const vnode = domino(source);
        vnode.replaceChild(document.createTextNode('foo'), vnode.firstChild);
        frame(() => {
            expect(source.firstChild.nodeValue).to.equal('foo');
            expect(source.outerHTML).to.equal('<div>foo</div>');
            done();
        });
    });

    it('should support manipulation via innerHTML', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        vnode.innerHTML = '<section><ul><li>1</li><li>2</li><li>3</li></ul></section><em>foo</em><span class="bar"></span>';
        frame(() => {
            expect(source.outerHTML).to.equal('<div><section><ul><li>1</li><li>2</li><li>3</li></ul></section><em>foo</em><span class="bar"></span></div>');
            vnode.innerHTML = '';
            frame(() => {
                expect(source.outerHTML).to.equal('<div></div>');
                done();
            });
        });
    });

    it('should support HTML entities', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        vnode.innerHTML = '&copy;';
        frame(() => {
            expect(source.firstChild.nodeValue).to.equal('©');
            done();
        });
    });

    it('should support the custom patch event', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        source.addEventListener('patch', (e) => {
            expect(e.type).to.equal('patch');
            expect(e.target).to.equal(source);
            expect(source.outerHTML).to.equal('<div><span></span></div>');
            done();
        });
        vnode.innerHTML = '<span></span>';
    });

    it('should not schedule a frame if the source DOM node is not rendered within the DOM', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        const spy = sinon.spy(window, 'requestAnimationFrame');
        vnode.setAttribute('id', 'foo');
        expect(spy.called).to.equal(false);
        frame(() => {
            expect(source.id).to.equal('foo');
            spy.restore();
            done();
        });
    });

    it('should schedule a frame to update the source DOM node if it is rendered within the DOM', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = domino(source);
        const spy = sinon.spy(window, 'requestAnimationFrame');
        document.body.appendChild(source);
        vnode.setAttribute('id', 'foo');
        frame(() => {
            expect(spy.called).to.equal(true);
            frame(() => {
                expect(source.id).to.equal('foo');
                document.body.removeChild(source);
                spy.restore();
                done();
            });
        });
    });
});
