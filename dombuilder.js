// **[DOMBuilder](http://github.com/skyzyx/dombuilder/)** is a tiny JavaScript class for generating DOM nodes
// on-the-fly. It is designed around a few basic goals:
//
// * Remove the _suck_ from using JavaScript's [DOM](https://developer.mozilla.org/en/Gecko_DOM_Reference) methods.
// * Small and lightweight.
// * Chainable like crazy.
// * Easy to embed into other, larger projects.
// * Doesn't _require_ another framework, but plays well with [Prototype](http://prototypejs.org),
//   [jQuery](http://jquery.com), [YUI](http://yuilibrary.com) and others.
//
// ## Browser Support
//
// DOMBuilder has been _tested_ in the following browsers:
//
// * [Firefox](http://firefox.com) 3+
// * [Safari](http://apple.com/safari) 3+
// * [Chrome](http://google.com/chrome) 3+
// * [Opera](http://opera.com) 10.10+
// * [Internet Explorer](http://microsoft.com/ie) 6+
//
// The JavaScript used isn't all that complex, so I would expect that DOMBuilder _supports_ other/older
// browsers as well.
//
// ## License
//
// DOMBuilder is copyright (c) 2009-2011 Ryan Parman, and released for use under the open-source
// [3-clause BSD License](http://opensource.org/licenses/bsd-license).
//
// ## Downloads
//
// _(Right-click, and use "Save As")_
//
// <table>
//   <tr>
//     <td><a href="http://github.com/skyzyx/dombuilder/raw/1.3/dombuilder.js">Development Version (1.3)</a></td>
//     <td><i>16.8 kb, uncompressed with comments</i></td>
//   </tr>
//   <tr>
//     <td><a href="http://github.com/skyzyx/dombuilder/raw/1.3/dombuilder.min.js">Production Version (1.3)</a></td>
//     <td><i>794 bytes, packed and gzip compressed</i></td>
//   </tr>
// </table>

/*
## HTML to generate:

<div id="test" class="sample">
    <p>This is a <a href="">sample of the code</a> that you may like.</p>
    <p>And another <a href="#"><strong>complex-ish</strong></a> one.</p>
    <ul class="sample">
        <li><a href="http://google.com">One</a></li>
        <li><em>Two</em></li>
        <li><strong>Three</strong></li>
    </ul>
</div>


## DOMBuilder code:

var _ = DOMBuilder,
    $body = document.body,
    $body.a = $body.appendChild;

$body.a(_.DOM(
    _('div#test.sample')._([
        _('p').H('This is a <a href="">sample of the code</a> that you may like.'),
        _('p').H('And another <a href="#"><strong>complex-ish</strong></a> one.'),
        _('ul.sample')._([
            _('li')._(_('a', { 'href':'http://google.com' }).html('One')),
            _('li')._(_('em').html('Two')),
            _('li')._(_('strong').html('Three'))
        ])
    ])
));
*/

// ## Digging into code

// Settings for Google Closure Compiler.
/*
==ClosureCompiler==
@compilation_level SIMPLE_OPTIMIZATIONS
==/ClosureCompiler==
*/

// Settings for JSLint or JSHint.
/*jslint white: false, onevar: true, browser: true, undef: true, nomen: false, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: false, newcap: true, immed: false */
/*global window */

// Do everything in a localized scope. We'll expose pieces to the global scope later.
(function() {


    // ## DOMBuilder
    //
    // Accepts a string representation of a tag name for the element parameter, and a JSON hash of key-value
    // pairs for the attributes parameter. Returns a self-reference to this by default. Provides methods,
    // described below. You can easily shorten this function name by assigning it to a variable.
    //
    //     // Assign to shorter variable
    //     var _ = DOMBuilder,
    //         $body = document.body,
    //         $body.a = $body.appendChild;
    //
    //     $body.a(_.DOM(
    //         _('p', {
    //             'id':'abc',
    //             'class':['def', 'ghi']
    //         })
    //     ));
    //
    //     // or...
    //
    //     $body.a(_.DOM(
    //         _('p#abc.def.ghi')
    //     ));
    //
    // This `X` variable will be exposed to the global scope as `DOMBuilder`.
    var X = function(elem, attr) {

        // Internally to DOMBuilder, we use very short variable names so that we can squeeze the file size
        // down as small as possible using YUI Compressor or Google Closure Compiler.
        var _ = this,
            d = document,
            dotHashRe = new RegExp("[.#]"),
            key;

        // Support CSS/jQuery-style notation for generating elements with IDs and classnames. (Internal-only!)
        //
        //     div#myId
        //     p#id.class1.class2
        function notation(elem) {

            var attr = { 'class': [] },
                dotHashRe = new RegExp("[.#]"),
                piece, pieces, elemType, pos, classes;

            if (!dotHashRe.test(elem)) {
                return {};
            }

            pieces = elem.split(dotHashRe);
            elemType = pieces.shift();
            pos = elemType.length;
            classes = attr['class'];

            for (piece in pieces) {
                if (pieces.hasOwnProperty(piece)) {
                    if (elem[pos] === '#') {
                        attr.id = pieces[piece];
                    }
                    else {
                        classes.push(pieces[piece]);
                    }
                    pos += pieces[piece].length + 1;
                }
            }

            attr['class'] = classes;
            if (!attr['class'].length) {
                delete attr['class'];
            }

            return attr;
        }

        // Merge the properties of one object with the properties of a second object. (Internal-only!)
        function merge_options(o1, o2) {

            var o3 = {},
                attrname;

            for (attrname in o1) {
                if (o1.hasOwnProperty(attrname)) {
                    o3[attrname] = o1[attrname];
                }
            }

            for (attrname in o2) {
                if (o2.hasOwnProperty(attrname)) {
                    o3[attrname] = o2[attrname];
                }
            }

            return o3;
        }

        // Merge options into a conglomo-hash!
        attr = merge_options(attr, notation(elem));

        // Construct the element, loop through the list of attributes and add them to the node. Because of
        // the way that IE works, class names need to be added explicitly via the `.className` property instead
        // of using `.setAttribute()`.
        if (dotHashRe.test(elem)) {
            _.e = d.createElement(elem.split(dotHashRe).shift());
        }
        else {
            _.e = d.createElement(elem);
        }

        if (attr) {
            for (key in attr) {
                if (attr.hasOwnProperty(key)) {
                    if (typeof attr[key] === 'object' && typeof attr[key].length === 'number' && typeof attr[key].splice === 'function') {
                        attr[key] = attr[key].join(' ');
                    }

                    if (key.toString() === 'class') {
                        _.e.className = attr[key];
                    }
                    else {
                        _.e.setAttribute(key, attr[key]);
                    }
                }
            }
        }

        // ### .child() or ._()
        //
        // The `child()` method is used to add children to a parent node, or to add a new tag to a
        // text string. Accepts one or more child nodes in the form of a `DOMBuilder` object or a native
        // `HTMLElement` node (created with `document.createElement()`). Multiple child nodes are passed as an
        // array of objects. Returns a self-reference to `this` by default.
        //
        //     // Assign to shorter variable
        //     var _ = DOMBuilder,
        //         $body = document.body,
        //         $body.a = $body.appendChild;
        //
        //     $body.a(_.DOM(
        //         _('p#abc.def')._([
        //             _('strong').H('This is bold text.'),
        //             _('em').H('This is italic text.')
        //         ])
        //     ));
        _.child = _._ = function(obj) {

            // If the object isn't an array, convert it to an array to maintain a single codepath below.
            if (typeof obj !== 'object' || typeof obj.length !== 'number' || typeof obj.splice !== 'function') {
                obj = [obj];
            }

            // Loop through the indexed array of children. If the node is a `DOMBuilder` object, convert it to
            // DOM and append it. Otherwise, assume it's a real DOM node.
            for (var i = 0, max = obj.length; i < max; i++) {

                if (typeof obj[i] === 'undefined') {
                    break;
                }

                if (typeof obj[i].asDOM !== 'undefined') {
                    _.e.appendChild(obj[i].asDOM());
                }
                else {
                    _.e.appendChild(obj[i]);
                }
            }

            return _;
        };

        // ### .html() or .H()
        //
        // The `html()` method is used for adding text or HTML content to a node. Since it leverages `.innerHTML`
        // under the hood, you can pass a string of content to the text parameter. The default behavior is to
        // append content.
        //
        // If you'd prefer to replace the existing `.innerHTML` content instead, pass a boolean `true` to the
        // `replace` parameter. Returns a self-reference to `this` by default.
        //
        // Pass no parameters to read back the node as a string of HTML.
        //
        //  // Assign to shorter variable
        //  var _ = DOMBuilder,
        //      $body = document.body,
        //      $body.a = $body.appendChild;
        //
        //  $body.a(_.DOM(
        //      _('p#abc.def')._([
        //          _('strong').H('This is bold text.'),
        //          _('em').H('This is italic text.')
        //      ])
        //      .H('Replace the previous nodes with this text', true)
        //  ));
        //
        //  _('p#abc.def')._([
        //      _('strong').H('This is bold text.'),
        //      _('em').H('This is italic text.')
        //  ]).html()
        _.html = _.H = function(str, replace) {

            // No parameters? Read the value instead. Alias for asHTML().
            if (arguments.length === 0) {
                return _.asHTML();
            }

            // Determine the default value for `replace`.
            replace = replace || false;

            // Set the value with innerHTML.
            if (replace) {
                _.e.innerHTML = str;
            }
            else {
                _.e.innerHTML += str;
            }

            return _;
        };

        // ### .text() or .T()
        //
        // The `text()` method is used for adding plain text content to a node. Since it leverages `.textContent`
        // or `.innerText` under the hood, you can pass a string of content to the text parameter. The default
        // behavior is to append content.
        //
        // If you'd prefer to replace the existing content instead, pass a boolean `true` to the `replace`
        // parameter. Returns a self-reference to `this` by default.
        //
        // Pass no parameters to read back the node as a string of plain text.
        //
        //  // Assign to shorter variable
        //  var _ = DOMBuilder,
        //      $body = document.body,
        //      $body.a = $body.appendChild;
        //
        //  $body.a(_.DOM(
        //      _('p#abc.def')._([
        //          _('strong').H('This is bold text.'),
        //          _('em').H('This is italic text.')
        //      ])
        //      .T('Replace the previous nodes with this text', true)
        //  ));
        //
        //  _('p#abc.def')._([
        //      _('strong').H('This is bold text.'),
        //      _('em').H('This is italic text.')
        //  ]).text()
        _.text = _.T = function(str) {

            // No parameters? Read the value instead. Alias for asText().
            if (arguments.length === 0) {
                return _.asText();
            }

            // Set the value
            if (_.e.innerText) {
                _.e.innerText = str;
            }
            else {
                var text = document.createTextNode(str);
                _.e.appendChild(text);
            }

            return _;
        };

        // ### .asDOM() or .dom()
        //
        // Returns a real DOM node for use with the standard JavaScript DOM methods. When DOMBuilder objects
        // are passed to the child method, `asDOM()` is optional. It is only required when it's the last method
        // in the chain while being passed into a real JavaScript DOM node.
        //
        //  // Assign to shorter variable
        //  var _ = DOMBuilder,
        //      $body = document.body,
        //      $body.a = $body.appendChild;
        //
        //  $body.a(
        //      _('p#abc.def')._([
        //          _('strong').H('This is bold text.'),
        //          _('em').H('This is italic text.')
        //      ]).dom()
        //  );
        _.asDOM = _.dom = function() {

            return _.e;
        };

        // ### .asHTML() or .html() or .H()
        //
        // Returns the DOM nodes as a string of HTML. It's as simple as that.
        //
        //  // Assign to shorter variable
        //  var _ = DOMBuilder;
        //
        //  var id = document.getElementById('id');
        //  id.innerHTML = _('p#abc.def').H('This is my text.').asHTML();
        _.asHTML = function() {

            var t = d.createElement('div');
            t.appendChild(_.e);
            return t.innerHTML;
        };

        // ### .asText() or .text() or .T()
        //
        // Returns the DOM nodes as a string of plain text. It's as simple as that.
        //
        //  // Assign to shorter variable
        //  var _ = DOMBuilder;
        //
        //  var id = document.getElementById('id');
        //  id.innerHTML = _('p#abc.def').H('This is my text.').asText();
        _.asText = function() {

            var t = d.createElement('div');
            t.appendChild(_.e);

            if (t.innerText) {
                return t.innerText;
            }
            else if (t.textContent) {
                return t.textContent;
            }
        };

        return _;
    };

    // ## Expose to the global scope
    //
    // Pre-instantiate the class on each call so that you never need to use `new`.
    window.DOMBuilder = function(elem, attr) {
        return new X(elem, attr);
    };

    // ## DOM()
    //
    // This is the function that all other `DOMBuilder` nodes are passed into, as it returns directly into the
    // `appendChild()` method. For a single `DOMBuilder` chain, this is interchangable with the `.asDOM()`
    // method (although they're used differently).
    //
    // If you are passing in multiple sibling nodes without a parent, `DOM()` leverages
    // [Document Fragments](http://ejohn.org/blog/dom-documentfragments/) to substantially speed up the process
    // of writing multiple nodes to the live DOM.
    //
    //  // Assign to shorter variable
    //  var _ = DOMBuilder,
    //      $body = document.body,
    //      $body.a = $body.appendChild;
    //
    //  $body.a(_.DOM([
    //      _('p#abc.def').H('This is my text.'),
    //      _('p').H('Something simpler.'),
    //      _('p').H('Let\'s add a third paragraph, for kicks.')
    //  ]));
    window.DOMBuilder.DOM = function(nodes) {

        // Create a document fragment. Grab and loop through the in-memory DOM nodes, and _move_ them to the
        // Document Fragment.
        var f = document.createDocumentFragment(), i, max,
            n = new X('div')._(nodes).dom().childNodes;

        while (n.length) {
            f.appendChild(n[0]);
        }

        // Return the Document Fragment to the calling method (presumably `.appendChild()`).
        return f;
    };
})();

// ## Change Log
//
// ### 1.3
// Added a number of shortcuts and niceties. Use `.dom()` as an alias for `.asDOM()`. Use `.html()` as an alias
// for `.asHTML()`. Use `._()` as an alias for `.child()`. You can now pass an array of class names to the 'class'
// hash attribute. You can also use CSS-style `#` and `.` notation for setting IDs and class names. Also now
// supports `.text()` and `.asText()` for working with plain text nodes. Added support for using `.T()` and
// `.H()` as shortcuts for `.text()` and `.html()`.
//
// ### 1.2
// Added `.DOM()` as the primary way of passing real DOM nodes back; useful for appending multiple
// nodes at once.
//
// ### 1.1
// Simplified the code under the hood. Now runs a little faster and compresses even smaller. Removed the
// need to instantiate the class, making it easier to alias. Ensured that it passed JSLint. Provided a
// version minified by Google Closure Compiler.
//
// ### 1.0
// Made sure that it worked with Internet Explorer 6 & 7. Improved the innards of `.child()` to be more efficient.
// Merged `.innerHTML()` and `.appendHTML()` together into the new `.html()` method. Provided a version minified
// by YUI Compressor.
//
// ### Pre-1.0
// Initial pre-release of DOMBuilder.
