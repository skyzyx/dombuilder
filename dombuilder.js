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
 * #### Browser Support
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
 * #### Downloads
 *
 * _(Right-click, and use "Save As")_
 *
 * <table>
 * 	<tr>
 * 		<td><a href="http://github.com/skyzyx/dombuilder/raw/1.2/dombuilder.js">Development Version (1.2)</a></td>
 * 		<td><i>4.5 kb, uncompressed with comments</i></td>
 * 	</tr>
 * 	<tr>
 * 		<td><a href="http://github.com/skyzyx/dombuilder/raw/1.2/dombuilder.min.js">Production Version (1.2)</a></td>
 * 		<td><i>450 bytes, packed and gzip compressed</i></td>
 * 	</tr>
 * </table>
 */

#! ==ClosureCompiler==
#! @compilation_level SIMPLE_OPTIMIZATIONS
#! ==/ClosureCompiler==

#! /*jslint white: false, onevar: true, browser: true, undef: true, nomen: false, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: false, newcap: true, immed: false */
#! /*global window */


(function() {

	/**
	 * DOMBuilder generates DOM nodes with an object-oriented syntax.
	 *
	 * @param elem - <String> (Required) The name of the element to generate.
	 * @param attr - <Hash> (Optional) A JSON Hash of the attributes to apply to the element.
	 * @returns <DOMBuilder> - A DOMBuilder object.
	 */

	// Backbone.Events
	// -----------------
	var X = function(elem, attr) {

		var _ = this,
			d = document,
			key;

		// Construct the element and add attributes
		_.e = d.createElement(elem);

		// If we have attributes...
		if (attr) {

			// Loop through the hash (i.e. associative array, key-value pairs)
			for (key in attr) {

				// Handle 'class' differently for IE.
				if (key.toString() === 'class') {

					// Add it to the element
					_.e.className = attr[key];
				}
				else {

					// Add them to the element
					_.e.setAttribute(key, attr[key]);
				}
			}
		}

		/**
		 * Append one or more child nodes.
		 *
		 * @param obj - <HTMLElement|DOMBuilder|Array> (Required) A DOM element, a DOMBuilder object, or an array of these for multiple children.
		 * @returns <DOMBuilder> - The original DOMBuilder object.
		 */
		_.child = function(obj) {

			// If the object isn't an array...
			if (typeof obj !== 'object' || typeof obj.length !== 'number' || typeof obj.splice !== 'function') {

				// Turn it into an array to simplify the logic below
				obj = [obj];
			}

			// Loop through the indexed array of children
			for (var i = 0, max = obj.length; i < max; i++) {

				// If there was accidentally an extra comma, ignore it.
				if (typeof obj[i] === 'undefined') {
					break;
				}

				// Is this child a DOMBuilder object?
				if (typeof obj[i].asDOM !== 'undefined') {

					// Automatically append with DOMBuilder.asDOM()
					_.e.appendChild(obj[i].asDOM());
				}
				else {

					// Let's assume this is a native DOM 'HTMLElement' object
					_.e.appendChild(obj[i]);
				}
			}

			// Return the DOMBuilder object so we can chain it
			return _;
		};

		/**
		 * Set a value via innerHTML.
		 *
		 * @param str - <String> (Required) The string to assign via innerHTML.
		 * @param replace - <Boolean> (Optional) Whether this new value should replace the existing value. Defaults to append (false).
		 * @returns <DOMBuilder> - The original DOMBuilder object.
		 */
		_.html = function(str, replace) {

			replace = replace || false;

			// Set the value with innerHTML
			if (replace) {
				_.e.innerHTML = str;
			}
			else {
				_.e.innerHTML += str;
			}

			// Return the DOMBuilder object so we can chain it
			return _;
		};

		/**
		 * Return the DOM element for DOMBuilder that can be used with standard DOM methods.
		 * This is optional when passed into a DOMBuilder.child() method. This is required
		 * as the last method in the chain when passing to a native DOM method.
		 *
		 * @returns <HTMLElement> - The entire DOMBuilder object as a DOM node.
		 */
		_.asDOM = function() {

			// Return the native DOM object that can be used with standard DOM methods
			return _.e;
		};

		/**
		 * Return the DOMBuilder object as an HTML string.
		 *
		 * @returns <String> - The entire DOMBuilder object as a string of HTML.
		 */
		_.asHTML = function() {

			// Create a new DOM element in memory
			var t = d.createElement('div');

			// Append our DOM object to the in-memory element
			t.appendChild(_.e);

			// Read the content back as a string
			return t.innerHTML;
		};

		// Return the DOMBuilder object so we can chain it
		return _;
	};

	// Expose DOMBuilder, pre-instantiated
	window.DOMBuilder = function(elem, attr) {
		return new X(elem, attr);
	};

	window.DOMBuilder.DOM = function(nodes) {

		// Create a document fragment
		var f = document.createDocumentFragment(), i, max,

			// Grab the already-processed nodes.
			n = new X('div').child(nodes).asDOM().childNodes;

		// Loop through the items. These are live DOM nodes.
		while (n.length) {

			// This is a native DOM 'HTMLElement' object
			f.appendChild(n[0]);
		}

		return f;
	};
})();
