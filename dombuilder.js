/**
 * **[DOMBuilder](http://github.com/skyzyx/dombuilder/)** is a tiny JavaScript class for generating DOM nodes
 * on-the-fly. It is designed around a few basic goals:
 *
 * * Remove the _suck_ from using JavaScript's [DOM](https://developer.mozilla.org/en/Gecko_DOM_Reference) methods.
 * * Small and lightweight.
 * * Chainable like crazy.
 * * Easy to embed into other, larger projects.
 * * Doesn't _require_ another framework, but plays well with [Prototype](http://prototypejs.org),
 *   [jQuery](http://jquery.com), [YUI](http://yuilibrary.com) and others.
 *
 * ## Browser Support
 *
 * DOMBuilder has been _tested_ in the following browsers:
 *
 * * [Firefox](http://firefox.com) 3+
 * * [Safari](http://apple.com/safari) 3+
 * * [Chrome](http://google.com/chrome) 3+
 * * [Opera](http://opera.com) 10.10+
 * * [Internet Explorer](http://microsoft.com/ie) 6+
 *
 * The JavaScript used isn't all that complex, so I would expect that DOMBuilder _supports_ other/older
 * browsers as well.
 *
 * ## License
 *
 * DOMBuilder is copyright (c) 2009-2011 Ryan Parman, and released for use under the open-source
 * [3-clause BSD License](http://opensource.org/licenses/bsd-license).
 *
 * ## Downloads
 *
 * _(Right-click, and use "Save As")_
 *
 * <table>
 * 	<tr>
 * 		<td><a href="http://github.com/skyzyx/dombuilder/raw/1.2/dombuilder.js">Development Version (1.2)</a></td>
 * 		<td><i>10.5 kb, uncompressed with comments</i></td>
 * 	</tr>
 * 	<tr>
 * 		<td><a href="http://github.com/skyzyx/dombuilder/raw/1.2/dombuilder.min.js">Production Version (1.2)</a></td>
 * 		<td><i>450 bytes, packed and gzip compressed</i></td>
 * 	</tr>
 * </table>
 */

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

var _ = DOMBuilder;
document.body.appendChild(_.DOM(
    _('div', { 'id':'test', 'class':'sample' }).child([
        _('p').html('This is a <a href="">sample of the code</a> that you may like.'),
        _('p').html('And another ').child(_('a', { 'href':'#' }).child(_('strong').html('complex-ish'))).html(' one.'),
        _('ul', { 'class':'sample' }).child([
            _('li').child(_('a', { 'href':'http://google.com' }).html('One')),
            _('li').child(_('em').html('Two')),
            _('li').child(_('strong').html('Three'))
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

	/**
	 * ## DOMBuilder
	 *
	 * Accepts a string representation of a tag name for the element parameter, and a JSON hash of key-value
	 * pairs for the attributes parameter. Returns a self-reference to this by default. Provides methods,
	 * described below. You can easily shorten this function name by assigning it to a variable.
	 *
	 * 	// Assign to shorter variable
	 * 	var _ = DOMBuilder;
	 *
	 * 	document.body.appendChild(_.DOM(
	 * 		_('p', {
	 * 			'id':'abc',
	 * 			'class':'def'
	 * 		})
	 * 	));
	 *
	 * This `X` variable will be exposed to the global scope as `DOMBuilder`.
	 */
	var X = function(elem, attr) {

		// Internally to DOMBuilder, we use very short variable names so that we can squeeze the file size
		// down as small as possible using YUI Compressor or Google Closure Compiler.
		var _ = this,
			d = document,
			key;

		// Construct the element, loop through the list of attributes and add them to the node. Because of
		// the way that IE works, class names need to be added explicitly via the `.className` property instead
		// of using `.setAttribute()`.
		_.e = d.createElement(elem);

		if (attr) {
			for (key in attr) {
				if (key.toString() === 'class') {
					_.e.className = attr[key];
				}
				else {
					_.e.setAttribute(key, attr[key]);
				}
			}
		}

		/**
		 * ### child()
		 *
		 * The `child()` method is used to add children to a parent node, or to add a new tag to a
		 * text string. Accepts one or more child nodes in the form of a `DOMBuilder` object or a native
		 * `HTMLElement` node (created with `document.createElement()`). Multiple child nodes are passed as an
		 * array of objects. Returns a self-reference to `this` by default.
		 *
		 * 	// Assign to shorter variable
		 * 	var _ = DOMBuilder;
		 *
		 * 	document.body.appendChild(_.DOM(
		 * 		_('p', { 'id':'abc', 'class':'def' }).child([
		 * 			_('strong').html('This is bold text.'),
		 * 			_('em').html('This is italic text.')
		 * 		])
		 * 	));
		 */
		_.child = function(obj) {

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

			// Return the `DOMBuilder` object so we can chain it.
			return _;
		};

		/**
		 * ### html()
		 *
		 * The `html()` method is used for adding text or HTML content to a node. Since it leverages `.innerHTML`
		 * under the hood, you can pass a string of content to the text parameter. The default behavior is to
		 * append content.
		 *
		 * If you'd prefer to replace the existing `.innerHTML` content instead, pass a boolean `true` to the
		 * `replace` parameter. Returns a self-reference to `this` by default.
		 *
		 * 	// Assign to shorter variable
		 * 	var _ = DOMBuilder;
		 *
		 * 	document.body.appendChild(_.DOM(
		 * 		_('p', { 'id':'abc', 'class':'def' }).child([
		 * 			_('strong').html('This is bold text.'),
		 * 			_('em').html('This is italic text.')
		 * 		])
		 * 		.html('Replace the previous nodes with this text', true)
		 * 	));
		 */
		_.html = function(str, replace) {

			// Determine the default value for `replace`.
			replace = replace || false;

			// Set the value with innerHTML.
			if (replace) {
				_.e.innerHTML = str;
			}
			else {
				_.e.innerHTML += str;
			}

			// Return the `DOMBuilder` object so we can chain it.
			return _;
		};

		/**
		 * ### asDOM()
		 *
		 * Returns a real DOM node for use with the standard JavaScript DOM methods. When DOMBuilder objects
		 * are passed to the child method, asDOM is optional. It is only required when it's the last method
		 * in the chain while being passed into a real JavaScript DOM node.
		 *
		 * 	// Assign to shorter variable
		 * 	var _ = DOMBuilder;
		 *
		 * 	document.body.appendChild(
		 * 		_('p', { 'id':'abc', 'class':'def' }).child([
		 * 			_('strong').html('This is bold text.'),
		 * 			_('em').html('This is italic text.')
		 * 		]).asDOM()
		 * 	);
		 */
		_.asDOM = function() {
			return _.e;
		};

		/**
		 * ### asHTML()
		 *
		 * Returns the DOM nodes as a string of HTML. It's as simple as that.
		 *
		 * 	// Assign to shorter variable
		 * 	var _ = DOMBuilder;
		 *
		 * 	var id = document.getElementById('id');
		 * 	id.innerHTML = _('p', {
		 * 		'id':'abc',
		 * 		'class':'def'
		 * 	}).html('This is my text.').asHTML();
		 */
		_.asHTML = function() {

			// Create a new DOM element in memory, append our DOM object to the in-memory element, then read
			// the content back as a string.
			var t = d.createElement('div');
			t.appendChild(_.e);
			return t.innerHTML;
		};

		// Return the `DOMBuilder` object so we can chain it.
		return _;
	};

	/**
	 * ## Expose to the global scope
	 *
	 * Pre-instantiate the class on each call so that you never need to use `new`.
	 */
	window.DOMBuilder = function(elem, attr) {
		return new X(elem, attr);
	};

	/**
	 * ## DOM()
	 *
	 * This is the function that all other `DOMBuilder` nodes are passed into, as it returns directly into the
	 * `appendChild()` method. For a single `DOMBuilder` chain, this is interchangable with the `.asDOM()`
	 * method (although they're used differently).
	 *
	 * If you are passing in multiple sibling nodes without a parent, `DOM()` leverages
	 * [Document Fragments](http://ejohn.org/blog/dom-documentfragments/) to substantially speed up the process
	 * of writing multiple nodes to the live DOM.
	 *
	 * 	// Assign to shorter variable
	 * 	var _ = DOMBuilder;
	 *
	 * 	document.body.appendChild(_.DOM([
	 * 		_('p', { 'id':'abc', 'class':'def' }).html('This is my text.'),
	 * 		_('p').html('Something simpler.'),
	 * 		_('p').html('Let\'s add a third paragraph, for kicks.')
	 * 	]));
	 */
	window.DOMBuilder.DOM = function(nodes) {

		// Create a document fragment. Grab and loop through the in-memory DOM nodes, and _move_ them to the
		// Document Fragment.
		var f = document.createDocumentFragment(), i, max,
			n = new X('div').child(nodes).asDOM().childNodes;

		while (n.length) {
			f.appendChild(n[0]);
		}

		// Return the Document Fragment to the calling method (presumably `.appendChild()`).
		return f;
	};
})();

/**
 * ## Change Log
 *
 * ### 1.2
 * Added `.DOM()` as the primary way of passing real DOM nodes back; useful for appending multiple
 * nodes at once.
 *
 * ### 1.1
 * Simplified the code under the hood. Now runs a little faster and compresses even smaller. Removed the
 * need to instantiate the class, making it easier to alias. Ensured that it passed JSLint. Provided a
 * version minified by Google Closure Compiler.
 *
 * ### 1.0
 * Made sure that it worked with Internet Explorer 6 & 7. Improved the innards of `.child()` to be more efficient.
 * Merged `.innerHTML()` and `.appendHTML()` together into the new `.html()` method. Provided a version minified
 * by YUI Compressor.
 *
 * ### Pre-1.0
 * Initial pre-release of DOMBuilder.
 */
