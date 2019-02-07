# echo

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> A virtual DOM library minus the virtual

A proof of concept, echo works much like your typical virtual DOM library, providing a virtual node that is a clone of a source node. Any manipulation to the virtual node is automatically reflected in the source node. The difference is that echo returns a *real* DOM node, not an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree). Manipulating the virtual node outside of the DOM avoids unnecessarily triggering layouts and paints, allowing echo to handle updates to the source node in the most efficient manner. Because it's just a DOM node. there is no API to learn, so you can take advantage of all the DOM methods you're accustomed to for maximum flexibility and portability.

## Install

Download the [development](http://github.com/ryanmorr/echo/raw/master/dist/echo.js) or [minified](http://github.com/ryanmorr/echo/raw/master/dist/echo.min.js) version, or install via NPM:

``` sh
npm install @ryanmorr/echo
```

## Usage

Create a virtual node for a specific element by passing a DOM element or selector string to the `echo` function. Passing no arguments will create a virtual node for the entire document:

``` javascript
import { echo } from '@ryanmorr/echo';

// Returns a clone of the `#container` element
const vcontainer = echo('#container');

// Returns a clone of the <html> element
const vhtml = echo();

// They're just DOM nodes, no tricks
vcontainer.nodeType; //=> 1
vhtml.nodeName; //=> "HTML"
```

Manipulating any part of the virtual DOM tree will automatically trigger updates via a mutation observer, and schedule a frame to patch the source node:

``` javascript
const source = document.createElement('div');
const vnode = echo(source);

// Manipulate the virtual DOM tree
vnode.setAttribute('foo', 'bar');

// Updates are made in the following frame
requestAnimationFrame(() => {
    source.getAttribute('foo'); //=> "bar"
});
```

How you manipulate the virtual node is inconsequential, because the source node will always be patched efficiently. This means you can use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) and `innerHTML` for quick templating without concern for performance:

``` javascript
const source = document.querySelector('#users');
const vnode = echo(source);

// Data structure
const users = [
    'Joe',
    'John',
    'Lisa'
];

// Update the content
vnode.innerHTML = `
    <ul>  
        ${users.map((name) => `<li>${name}</li>`).join('')}
    </ul>
`;
```

Listen for the `patch` event to detect when changes have occurred to the source DOM node:

``` javascript
const source = document.querySelector('#foo');
const vnode = echo(source);

// Remember to add the event listener to the source DOM node, not the virtual DOM node!
source.addEventListener('patch', (e) => {
    // React to changes
});

// Change something on the virtual node to dispatch the patch event
vnode.classList.add('foo');
```

Since the returned node is just an ordinary DOM node, it is [jQuery](http://jquery.com/)-compatible:

``` javascript
// Wrap the virtual node with jQuery
const vnode = $(echo('#foo'));

// Use jQuery like you usually do
vnode.attr('foo', 'bar');
vnode.addClass('baz');
vnode.css({width: '20px', height: '20px'});
vnode.append('<span class="baz"></span>');
```

To stop functionality, pass the virtual DOM node to the `destroy` function:

``` javascript
import { destroy } from '@ryanmorr/echo';

// Create virtual node
const vnode = echo();

// Stop future updates
destroy(vnode);
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/echo
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fecho.svg
[build-url]: https://travis-ci.org/ryanmorr/echo
[build-image]: https://travis-ci.org/ryanmorr/echo.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE