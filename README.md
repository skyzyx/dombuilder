# DOMBuilder

## Documentation

Read the [documentation](http://skyzyx.github.com/dombuilder/) and [see the demo](http://ryanparman.com/labs/dombuilder/).

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
