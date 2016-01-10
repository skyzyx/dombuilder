# DOMBuilder

**[DOMBuilder](http://github.com/skyzyx/dombuilder/)** is a tiny JavaScript class for generating DOM nodes on-the-fly. It is designed around a few basic goals:

* Remove the _suck_ from using JavaScript's [DOM](https://developer.mozilla.org/en/Gecko_DOM_Reference) methods.
* Small and lightweight.
* Chainable like crazy.
* Easy to embed into other, larger projects.
* Doesn't _require_ another framework, but plays well with [Prototype](http://prototypejs.org), [jQuery](http://jquery.com), [YUI](http://yuilibrary.com) and others.


## Usage

### HTML to generate

```html
<div id="test" class="sample">
    <p>This is a <a href="">sample of the code</a> that you may like.</p>
    <p>And another <a href="#"><strong>complex-ish</strong></a> one.</p>
    <ul class="sample">
        <li><a href="http://google.com">One</a></li>
        <li><em>Two</em></li>
        <li><strong>Three</strong></li>
    </ul>
</div>
```

### DOMBuilder code

This is an example of how to generate it from JavaScript using DOMBuilder. This is using the shortest possible syntax, while still showing how it works. You can interleave DOM, `DOMBuilder` and HTML strings together.

(Notice that this example has aliased `DOMBuilder` to the `_` variable to make invocation shorter. Also note that the `._()` method is shorthand for `.child()`. It’s a lot of underscores, I know, but it makes typing a lot faster.)

```javascript
// Assign to shorter variables.
var _ = DOMBuilder;

// Do the generation and write to the live DOM
document.body.appendChild(_.DOM(
    _('div#test.sample')._([
        _('p').H('This is a <a href="">sample of the code</a> that you may like.'),
        _('p').H('And another <a href="#"><strong>complex-ish</strong></a> one.'),
        _('ul.sample')._([
            _('li')._(_('a', { 'href':'http://google.com' }).H('One')),
            _('li')._(_('em').H('Two')),
            _('li')._(_('strong').H('Three'))
        ])
    ])
));
```

Here is another example that _does not_ use any of the aforementioned shorthand, which is only _slightly_ shorter than the full-blown DOM syntax.

```javascript
// Do the generation and write to the live DOM
document.body.appendChild(DOMBuilder.DOM(
    DOMBuilder('div', {
        'id': '#test',
        'class': ['sample']
    }).child([
        DOMBuilder('p').html('This is a ').child(
            DOMBuilder('a', {
                'href': '#'
            }).html('sample of the code')
        ).html(' that you may like.'),
        DOMBuilder('p').html('And another ').child(
            DOMBuilder('a', {
                'href': '#'
            }).child(
                DOMBuilder('strong').html('complex-ish')
            )
        ).html(' one.'),
        DOMBuilder('ul', {
            'class': ['sample']
        }).child([
            DOMBuilder('li').child(
                DOMBuilder('a', {
                    'href': 'http://google.com'
                }).html('One')
            ),
            DOMBuilder('li').child(
                DOMBuilder('em').html('Two')
            ),
            DOMBuilder('li').child(
                DOMBuilder('strong').html('Three')
            )
        ])
    ])
));
```


## Browser Support

DOMBuilder has been _tested successfully_ in the following browsers:

* Internet Explorer 9+
* Edge 12+
* Firefox 21+
* Safari 6+
* Chrome 23+
* Opera 15+
* Android 4.4+
* iOS 7+

The JavaScript used isn't all that complex, so I would expect that DOMBuilder _supports_ other/older browsers as well. I would encourage you to [run the unit tests in your browser](http://skyzyx.github.com/dombuilder/tests/test-runner.html) and let me know about any failing tests and which browser/version you're running.

For a more detailed description of DOMBuilder, see the [documentation](http://skyzyx.github.com/dombuilder/) or [view the source](http://github.com/skyzyx/dombuilder/).


## File sizes

| Filename               | Description            | File sizes |
| ---------------------- | ---------------------- | ---------- |
| `dombuilder.typed.js`  | Main source file       | `12841` |
| `dombuilder.js`        | De-typed source        | `12468` |
| `dombuilder.min.js`    | Mangled and minified   | `1917` |
| `dombuilder.min.js.gz` | Gzip `-9` compressed   | `866` |


## Why not React?

1. DOMBuilder was originally designed in 2009 — _long_ before React existed.
1. Some of us don't necessarily like or work with React, for business or pleasure.


## Makefile

Before anything, you need to install the dependencies.

```bash
make install
```

### Building the minified version

```bash
make build
```


### Linting your changes

First, run the style linter.

```bash
make lint
```

Next, run the type checker.

```bash
make typecheck
```


### Running the tests

DOMBuilder leverages the [QUnit](https://github.com/jquery/qunit) unit testing framework. You can run the tests by opening `tests/test-runner.html` in your web browser.

```bash
make test
open tests/test-runner.html
```

Alternatively, you can [run the tests for the latest release](http://skyzyx.github.com/dombuilder/tests/test-runner.html).


## Inspiration

[DOMBrew](https://github.com/glebm/DOMBrew/) (for CoffeeScript) was originally inspired by DOMBuilder 1.2. DOMBrew added some awesome new features, so DOMBuilder 1.3 added a number of matching features.


## License

DOMBuilder 1.4 is licensed under the MIT license.

Copyright (c) 2009–2016 Ryan Parman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<http://opensource.org/licenses/MIT>
