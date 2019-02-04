import $ from 'jquery';
import { echo, destroy } from '../../src/';

// Parse HTML string into DOM node
function parseHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.removeChild(div.firstChild);
}

describe('echo', () => {
    it('should use the document element by default', () => {
        const vnode = echo();
        expect(vnode.nodeName).to.equal('HTML');
        const vnode2 = echo(document);
        expect(vnode2.nodeName).to.equal('HTML');
    });

    it('should support a selector string', () => {
        const vnode = echo('html');
        expect(vnode.nodeName).to.equal('HTML');
    });

    it('should return the same instance if the same source node is used twice', () => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        expect(echo(source)).to.equal(vnode);
        const vnode2 = echo();
        expect(echo(document)).to.equal(vnode2);
    });

    it('should support destroying the instance', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        destroy(vnode);
        vnode.setAttribute('id', 'foo');
        requestAnimationFrame(() => {
            expect(source.hasAttribute('id')).to.equal(false);
            done();
        });
    });

    it('should support adding attributes', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        vnode.setAttribute('id', 'foo');
        requestAnimationFrame(() => {
            expect(source.id).to.equal('foo');
            expect(source.outerHTML).to.equal('<div id="foo"></div>');
            done();
        });
    });

    it('should support adding deeply nested attributes', (done) => {
        const source = parseHTML('<section><div><span></span></div></section>');
        const vnode = echo(source);
        vnode.querySelector('span').setAttribute('id', 'foo');
        requestAnimationFrame(() => {
            expect(source.querySelector('span').id).to.equal('foo');
            expect(source.outerHTML).to.equal('<section><div><span id="foo"></span></div></section>');
            done();
        });
    });

    it('should support removing attributes', (done) => {
        const source = parseHTML('<div id="foo"></div>');
        const vnode = echo(source);
        vnode.removeAttribute('id');
        requestAnimationFrame(() => {
            expect(source.hasAttribute('id')).to.equal(false);
            expect(source.outerHTML).to.equal('<div></div>');
            done();
        });
    });

    it('should support removing deeply nested attributes', (done) => {
        const source = parseHTML('<section><div><span id="foo"></span></div></section>');
        const vnode = echo(source);
        vnode.querySelector('span').removeAttribute('id');
        requestAnimationFrame(() => {
            expect(source.querySelector('span').hasAttribute('id')).to.equal(false);
            expect(source.outerHTML).to.equal('<section><div><span></span></div></section>');
            done();
        });
    });

    it('should support adding elements', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        vnode.appendChild(document.createElement('span'));
        requestAnimationFrame(() => {
            expect(source.firstChild.nodeName).to.equal('SPAN');
            expect(source.outerHTML).to.equal('<div><span></span></div>');
            done();
        });
    });

    it('should support adding deeply nested elements', (done) => {
        const source = parseHTML('<section><div></div></section>');
        const vnode = echo(source);
        vnode.querySelector('div').appendChild(document.createElement('span'));
        requestAnimationFrame(() => {
            expect(source.querySelector('div').firstChild.nodeName).to.equal('SPAN');
            expect(source.outerHTML).to.equal('<section><div><span></span></div></section>');
            done();
        });
    });

    it('should support removing elements', (done) => {
        const source = parseHTML('<div><span></span></div>');
        const vnode = echo(source);
        vnode.removeChild(vnode.firstChild);
        requestAnimationFrame(() => {
            expect(source.firstChild).to.equal(null);
            expect(source.outerHTML).to.equal('<div></div>');
            done();
        });
    });

    it('should support removing deeply nested elements', (done) => {
        const source = parseHTML('<section><div><span></span></div></section>');
        const vnode = echo(source);
        const vdiv = vnode.querySelector('div');
        vdiv.removeChild(vdiv.firstChild);
        requestAnimationFrame(() => {
            expect(source.querySelector('div').firstChild).to.equal(null);
            expect(source.outerHTML).to.equal('<section><div></div></section>');
            done();
        });
    });

    it('should support adding text nodes', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        const text = document.createTextNode('foo');
        vnode.appendChild(text);
        requestAnimationFrame(() => {
            expect(source.textContent).to.equal('foo');
            expect(source.outerHTML).to.equal('<div>foo</div>');
            done();
        });
    });

    it('should support adding deeply nested text nodes', (done) => {
        const source = parseHTML('<section><div><span></span></div></section>');
        const vnode = echo(source);
        const text = document.createTextNode('foo');
        vnode.querySelector('span').appendChild(text);
        requestAnimationFrame(() => {
            expect(source.querySelector('span').textContent).to.equal('foo');
            expect(source.outerHTML).to.equal('<section><div><span>foo</span></div></section>');
            done();
        });
    });

    it('should support removing text nodes', (done) => {
        const source = parseHTML('<div>foo</div>');
        const vnode = echo(source);
        vnode.removeChild(vnode.firstChild);
        requestAnimationFrame(() => {
            expect(source.textContent).to.equal('');
            expect(source.outerHTML).to.equal('<div></div>');
            done();
        });
    });

    it('should support removing deeply nested text nodes', (done) => {
        const source = parseHTML('<section><div><span>foo</span></div></section>');
        const vnode = echo(source);
        const vspan = vnode.querySelector('span');
        vspan.removeChild(vspan.firstChild);
        requestAnimationFrame(() => {
            expect(source.querySelector('span').textContent).to.equal('');
            expect(source.outerHTML).to.equal('<section><div><span></span></div></section>');
            done();
        });
    });

    it('should support changing deeply nested text node data', (done) => {
        const source = parseHTML('<section><div><span></span></div></section>');
        const vnode = echo(source);
        const text = document.createTextNode('foo');
        vnode.querySelector('span').appendChild(text);
        requestAnimationFrame(() => {
            expect(source.querySelector('span').textContent).to.equal('foo');
            expect(source.outerHTML).to.equal('<section><div><span>foo</span></div></section>');
            text.data = 'bar';
            requestAnimationFrame(() => {
                expect(source.querySelector('span').textContent).to.equal('bar');
                expect(source.outerHTML).to.equal('<section><div><span>bar</span></div></section>');
                done();
            });
        });
    });

    it('should support changing the element type of nested nodes', (done) => {
        const source = parseHTML('<div><span></span></div>');
        const vnode = echo(source);
        vnode.replaceChild(document.createElement('em'), vnode.firstChild);
        requestAnimationFrame(() => {
            expect(source.firstChild.nodeName).to.equal('EM');
            expect(source.outerHTML).to.equal('<div><em></em></div>');
            done();
        });
    });

    it('should support changing the node type of nested nodes', (done) => {
        const source = parseHTML('<div><span></span></div>');
        const vnode = echo(source);
        vnode.replaceChild(document.createTextNode('foo'), vnode.firstChild);
        requestAnimationFrame(() => {
            expect(source.firstChild.nodeValue).to.equal('foo');
            expect(source.outerHTML).to.equal('<div>foo</div>');
            done();
        });
    });

    it('should support manipulation via innerHTML', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        vnode.innerHTML = '<section><span class="bar"></span></section>';
        requestAnimationFrame(() => {
            expect(source.outerHTML).to.equal('<div><section><span class="bar"></span></section></div>');
            vnode.innerHTML = '';
            requestAnimationFrame(() => {
                expect(source.outerHTML).to.equal('<div></div>');
                done();
            });
        });
    });

    it('should support complex changes', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        vnode.innerHTML = '<section><ul><li>1</li><li>2</li><li>3</li></ul></section><em>foo</em><span class="bar"></span>';
        requestAnimationFrame(() => {
            expect(source.outerHTML).to.equal('<div><section><ul><li>1</li><li>2</li><li>3</li></ul></section><em>foo</em><span class="bar"></span></div>');
            vnode.innerHTML = '<section id="foo"><ul><li>1</li><li foo="bar">2</li><li>3</li><li>4</li></ul></section><i>baz</i><span class="a b c"></span><em></em>';
            requestAnimationFrame(() => {
                expect(source.outerHTML).to.equal('<div><section id="foo"><ul><li>1</li><li foo="bar">2</li><li>3</li><li>4</li></ul></section><i>baz</i><span class="a b c"></span><em></em></div>');
                vnode.innerHTML = '<section id="bar"><ul><li>1</li><li>2</li></ul></section><span class="a c"></span><em>quz</em>';
                requestAnimationFrame(() => {
                    expect(source.outerHTML).to.equal('<div><section id="bar"><ul><li>1</li><li>2</li></ul></section><span class="a c"></span><em>quz</em></div>');
                    done();
                });
            });
        });
    });

    it('should support HTML entities', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        vnode.innerHTML = '&copy;';
        requestAnimationFrame(() => {
            expect(source.firstChild.nodeValue).to.equal('©');
            done();
        });
    });

    it('should support reading attributes and properties from the virtual node', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        vnode.setAttribute('id', 'foo');
        vnode.classList.add('foo', 'bar', 'baz');
        vnode.style.color = 'red';
        requestAnimationFrame(() => {
            expect(source.id).to.equal(vnode.id);
            expect(source.className).to.equal(vnode.className);
            expect(source.style.cssText).to.equal(vnode.style.cssText);
            done();
        });
    });

    it('should support the custom patch event', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        source.addEventListener('patch', (e) => {
            expect(e.type).to.equal('patch');
            expect(e.target).to.equal(source);
            expect(source.outerHTML).to.equal('<div><span></span></div>');
            done();
        });
        vnode.innerHTML = '<span></span>';
    });

    it('should support the style attribute', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        vnode.style.width = '10px';
        requestAnimationFrame(() => {
            expect(source.style.width).to.equal('10px');
            done();
        });
    });

    it('should support manipulation via jQuery', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        $(vnode)
            .attr('id', 'foo')
            .addClass('bar')
            .css({width: '20px', height: '20px'})
            .append('<span class="baz"></span>');
        requestAnimationFrame(() => {
            expect(source.id).to.equal('foo');
            expect(source.className).to.equal('bar');
            expect(source.style.cssText).to.equal('width: 20px; height: 20px;');
            expect(source.innerHTML).to.equal('<span class="baz"></span>');
            done();
        });
    });

    it('should not schedule a frame if the source DOM node is not rendered within the DOM', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        const spy = sinon.spy(window, 'requestAnimationFrame');
        vnode.setAttribute('id', 'foo');
        expect(spy.called).to.equal(false);
        requestAnimationFrame(() => {
            expect(source.id).to.equal('foo');
            spy.restore();
            done();
        });
    });

    it('should schedule a frame to update the source DOM node if it is rendered within the DOM', (done) => {
        const source = parseHTML('<div></div>');
        const vnode = echo(source);
        const spy = sinon.spy(window, 'requestAnimationFrame');
        document.body.appendChild(source);
        vnode.setAttribute('id', 'foo');
        requestAnimationFrame(() => {
            expect(spy.called).to.equal(true);
            requestAnimationFrame(() => {
                expect(source.id).to.equal('foo');
                document.body.removeChild(source);
                spy.restore();
                done();
            });
        });
    });
});
