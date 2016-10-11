# domino

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![Dependencies][dependencies-image]][project-url]
[![License][license-image]][license-url]
[![File Size][file-size-image]][project-url]

> Virtual DOM library minus the virtual

Much like your typical virtual DOM library, domino returns a virtual node that is a clone of a source node. Any manipulation to the virtual node is automatically reflected in the source node in the most efficient manner possible. The difference is that domino returns a real DOM node, not an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree). This means there is no API to learn as you can take advantage of all the DOM methods you're accustomed to for maximum flexibility and portability.

## Usage

Create a virtual node for the entire document by passing no arguments:

``` javascript
// Returns a clone of the <html> element
const vhtml = domino();

// It's just a DOM node, no tricks
vhtml.nodeName; // "HTML"

// Manipulate the virtual DOM tree
vhtml.classList.add('foo');

// Query for and manipulate child nodes
const vcontainer = vhtml.querySelector('#container');
vcontainer.setAttribute('foo', 'bar');
```

Pass a DOM element or selector string to get a virtual node for a specific portion of the DOM tree:

``` javascript
// Returns a clone for the `#container` element
const vcontainer = domino('#container');

// Changes are restricted to the source element
vcontainer.style.width = '100%';
```

Since the returned node is just an ordinary DOM node, it is [jQuery](http://jquery.com/)-compatible:

``` javascript
// Wrap the virtual node with jQuery
const vnode = $(domino('#foo'));

// Use jQuery like you usually do
vnode.attr('foo', 'bar');
vnode.addClass('baz');
vnode.css({width: '20px', height: '20px'});
vnode.append('<span class="baz"></span>');
```

Use a templating engine, such as [Handlebars.js](http://handlebarsjs.com/):

``` javascript
// Define an HTML template string
var html = `
    <section>
        <ul>  
            {{#users}}
                <li>{{name}}</li>
            {{/users}}
        </ul>
    </section>
`;

// Create virtual node
const vnode = domino('#users');

// Compile the template
const template = Handlebars.compile(html);

// Use `innerHTML` without concern for performance
vnode.innerHTML = template({
    users: [
        {name: 'Joe'}, 
        {name: 'John'},
        {name: 'Lisa'}
    ]
});
```

Use the `patch` event to detect when changes have occurred to the source DOM node:

``` javascript
// Get source and virtual nodes
const source = document.querySelector('#container');
const vnode = domino(source);

// Remember to add the event listener to the source DOM node, not the virtual DOM node!
source.addEventListener('patch', (e) => {
    // React to changes
});

// Change something to invoke the patch event
vnode.classList.add('foo');
```

To stop functionality, pass the virtual DOM node to the `domino.destroy` function:

``` javascript
// Create virtual node
const vnode = domino();

// Stop future updates
domino.destroy(vnode);

// Nullify the reference to clean up memory
vnode = null
```

## Installation

domino is [CommonJS](http://www.commonjs.org/) and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) compatible with no dependencies. You can download the [development](http://github.com/ryanmorr/domino/raw/master/dist/domino.js) or [minified](http://github.com/ryanmorr/domino/raw/master/dist/domino.min.js) version, or install it in one of the following ways:

``` sh
npm install ryanmorr/domino

bower install ryanmorr/domino
```

## Tests

Open `test/runner.html` in your browser or test with PhantomJS by issuing the following commands:

``` sh
npm install
npm install -g gulp
gulp test
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/domino
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fdomino.svg
[build-url]: https://travis-ci.org/ryanmorr/domino
[build-image]: https://travis-ci.org/ryanmorr/domino.svg
[dependencies-image]: https://david-dm.org/ryanmorr/domino.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE
[file-size-image]: https://badge-size.herokuapp.com/ryanmorr/domino/master/dist/domino.min.js.svg?color=blue&label=file%20size