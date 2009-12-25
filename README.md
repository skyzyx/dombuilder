# DOMBuilder
License: [http://creativecommons.org/licenses/BSD/](http://creativecommons.org/licenses/BSD/)

## Goals

1. Small and lightweight (less than 800 bytes after Google Closure Compiler)
2. Doesn't require another framework like Prototype, jQuery or YUI
3. Chainable like crazy
4. Easy to embed into other, larger projects

## Support

Tested in Firefox 3/3.5, Safari 3/4, IE 6/7/8. Not sure about Opera or Chrome, but I expect they'd work as well.

## Usage

### Here's the HTML we want to generate:

	<div class="location_select_control">
	    <a href="" class="location_select_label">
	        <label>This is my label</label>
	        <label>This is another label</label>
	    </a>
	</div>

### Here is how we'd do it with the standard DOM:

	control_div = document.createElement('div');
	control_div.className = "location_select_control";

	control_link = document.createElement('a');
	control_link.href = "";
	control_link.className = "location_select_label";

	control_label = document.createElement('label');
	control_label.innerHTML = "This is my label";

	control_label2 = document.createElement('label');
	control_label2.innerHTML = "This is another label";

	control_link.appendChild(control_label);
	control_link.appendChild(control_label2);
	control_div.appendChild(control_link);

	document.body.appendChild(control_div);

### Lastly, here's how we'd do it with DOMBuilder:

	// Define a shortcut. Let's pick underscore. It can be anything, really. Or nothing. Whatever.
	var _ = DOMBuilder;

	document.body.appendChild(
	    _('div', { 'class':'location_select_control' }).child(
	        _('a', { 'href':'', 'class':'location_select_label' }).child([
	            _('label').html('This is my label'),
	            _('label').html('This is another label')
	        ])
	    ).asDOM()
	);

See `index.htm` for more complex examples, or see it in action at [http://ryanparman.com/labs/dombuilder/](http://ryanparman.com/labs/dombuilder/).

## DOMBuilder(elem, attr) - _Constructor_

DOMBuilder generates DOM nodes with an object-oriented syntax.

### Parameters

* `elem` - {String} (Required) The name of the element to generate.
* `attr` - {Hash} (Optional) A JSON Hash of the attributes to apply to the element.

### Returns

* `DOMBuilder` - The original DOMBuilder object.


## child(obj) - _Method_

Append one or more child nodes.

### Parameters

* `obj` - {HTMLElement | DOMBuilder | Array} (Required) A DOM element, a DOMBuilder object, or an array of these for multiple children.

### Returns

* `DOMBuilder` - The original DOMBuilder object.


## html(text, replace) - _Method_

Set a value via innerHTML.

### Parameters

* `text` - {String} (Required) The string to assign via innerHTML.
* `replace` - {Boolean} (Optional) Whether this new value should replace the existing value. Defaults to append (false).

### Returns

* `DOMBuilder` - The original DOMBuilder object.


## asDOM() - _Method_

Return the DOM element for DOMBuilder that can be used with standard DOM methods. This is optional when passed into a DOMBuilder.child() method. This is required as the last method in the chain when passing to a native DOM method.

### Returns

* `HTMLElement` - The entire DOMBuilder object as a DOM node.


## asHTML() - _Method_

Return the DOMBuilder object as an HTML string.

### Returns

* `String` - The entire DOMBuilder object as a string of HTML.
