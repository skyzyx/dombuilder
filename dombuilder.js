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
function DOMBuilder(elem, attr) {

	// Construct the element and add attributes
	this.element = window.document.createElement(elem);
	if (attr) {
		for (var key in attr) {
			this.element.setAttribute(key, attr[key]);
		}
	}

	/**
	 * Append one or more child nodes.
	 * 
	 * @param obj - <HTMLElement|DOMBuilder|Array> (Required) A DOM element, a DOMBuilder object, or an array of these for multiple children.
	 * @returns <DOMBuilder> - The original DOMBuilder object.
	 */
	this.child = function(obj) {

		if (this.typeOf(obj) != 'array') {
			obj = [obj];
		}

		for (var i = 0, max = obj.length; i < max; i++) {
			if (this.isDOMBuilder(obj[i])) {
				this.element.appendChild(obj[i].asDOM());
			}
			else {
				this.element.appendChild(obj[i]);
			}
		}

		return this;
	};

	/**
	 * Set a value via innerHTML.
	 * 
	 * @param str - <String> (Required) The string to assign via innerHTML.
	 * @returns <DOMBuilder> - The original DOMBuilder object.
	 */
	this.innerHTML = function(str) {
		this.element.innerHTML = str;
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
		return this.element;
	};

	/**
	 * Return the DOMBuilder object as an HTML string.
	 * 
	 * @returns <String> - The entire DOMBuilder object as a string of HTML.
	 */
	this.asHTML = function() {
		var t = document.createElement('div');
		t.appendChild(this.element);
		return t.innerHTML;
	};


	/************************************************************************************/
	// PRIVATE

	/**
	 * Determine the typeOf value of an object. Works better than JavaScript's built-in typeof operator.
	 * 
	 * @param obj - <Object> (Required) The object to check the type of. Null will return null, Array will return array.
	 * @returns <String> - The type of the object.
	 */
	this.typeOf = function(obj) {
		var s = typeof obj;
		if (s === 'object') {
			if (obj) {
				if (typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length')) && typeof obj.splice === 'function') {
					s = 'array';
				}
			}
			else {
				s = 'null';
			}
		}
		return s;
	};

	/**
	 * Determine whether an object is a DOMBuilder object.
	 * 
	 * @param obj - <Object> (Required) The object to check.
	 * @returns <Boolean> - Whether the object is a DOMBuilder object.
	 */
	this.isDOMBuilder = function(obj) {
		return (obj.constructor.toString().indexOf('DOMBuilder') != -1);
	};

	return this;
}

/**
 * Shortened wrapper for the DOMBuilder class.
 */
function $dom(elem, attr) {
	return new DOMBuilder(elem, attr);
}
