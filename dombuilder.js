/**
 * DOM BUILDER
 * http://github.com/skyzyx/dombuilder/
 * BSD Licensed - http://creativecommons.org/licenses/BSD/
 *
 * Usage documentation available at the project site.
 */

/**
 * DOMBuilder generates DOM nodes with an object-oriented syntax.
 *
 * @param elem - <String> (Required) The name of the element to generate.
 * @param attr - <Hash> (Optional) A JSON Hash of the attributes to apply to the element.
 * @returns <DOMBuilder> - A DOMBuilder object.
 */
var DOMBuilder = function(elem, attr) {

	// Construct the element and add attributes
	this.element = window.document.createElement(elem);

	// If we have attributes...
	if (attr) {

		// Loop through the hash (i.e. associative array, key-value pairs)
		for (var key in attr) {

			// Handle 'class' differently for IE.
			if (key.toString() == 'class') {

				// Add it to the element
				this.element.className = attr[key];
			}
			else {

				// Add them to the element
				this.element.setAttribute(key, attr[key]);
			}
		}
	}

	/**
	 * Append one or more child nodes.
	 *
	 * @param obj - <HTMLElement|DOMBuilder|Array> (Required) A DOM element, a DOMBuilder object, or an array of these for multiple children.
	 * @returns <DOMBuilder> - The original DOMBuilder object.
	 */
	this.child = function(obj) {

		// If the object isn't an array...
		if (typeof obj !== 'object' || typeof obj.length !== 'number' || typeof obj.splice !== 'function') {

			// Turn it into an array to simplify the logic below
			obj = [obj];
		}

		// Loop through the indexed array of children
		for (var i = 0, max = obj.length; i < max; i++) {

			// Is this child a DOMBuilder object?
			if (typeof obj[i].asDOM !== 'undefined') {

				// Automatically append with DOMBuilder.asDOM()
				this.element.appendChild(obj[i].asDOM());
			}
			else {

				// Let's assume this is a native DOM 'HTMLElement' object
				this.element.appendChild(obj[i]);
			}
		}

		// Return the DOMBuilder object so we can chain it
		return this;
	};

	/**
	 * Set a value via innerHTML.
	 *
	 * @param str - <String> (Required) The string to assign via innerHTML.
	 * @param replace - <Boolean> (Optional) Whether this new value should replace the existing value. Defaults to append (false).
	 * @returns <DOMBuilder> - The original DOMBuilder object.
	 */
	this.html = function(str, replace) {

		replace = replace || false;

		// Set the value with innerHTML
		if (replace) {
			this.element.innerHTML = str;
		}
		else {
			this.element.innerHTML += str;
		}

		// Return the DOMBuilder object so we can chain it
		return this;
	};

	/**
	 * Return the DOM element for DOMBuilder that can be used with standard DOM methods.
	 * This is optional when passed into a DOMBuilder.child() method. This is required
	 * as the last method in the chain when passing to a native DOM method.
	 *
	 * @returns <HTMLElement> - The entire DOMBuilder object as a DOM node.
	 */
	this.asDOM = function() {

		// Return the native DOM object that can be used with standard DOM methods
		return this.element;
	};

	/**
	 * Return the DOMBuilder object as an HTML string.
	 *
	 * @returns <String> - The entire DOMBuilder object as a string of HTML.
	 */
	this.asHTML = function() {

		// Create a new DOM element in memory
		var t = document.createElement('div');

		// Append our DOM object to the in-memory element
		t.appendChild(this.element);

		// Read the content back as a string
		return t.innerHTML;
	};

	// Return the DOMBuilder object so we can chain it
	return this;
};
