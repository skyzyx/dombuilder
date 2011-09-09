module('Generating HTML content');

/****************************************************************************************/

test('Return HTML representing generated nodes', function() {

	var element = _('p#abc.def')._([
		_('strong').html('This is bold text.'),
		_('em').html('This is italic text.')
	]).dom();

	equal(element.tagName.toLowerCase(), 'p', '<p> element created successfully');
	equal(element.className, 'def', 'Element has a class attribute');
	equal(element.id, 'abc', 'Element has an ID attribute');
	equal(element.innerHTML, '<strong>This is bold text.</strong><em>This is italic text.</em>', 'Element has correct HTML');
});

/****************************************************************************************/

test('Return HTML representing generated nodes using replacement', function() {

	var element = _('p#abc.def')._([
		_('strong').H('This is bold text.'),
		_('em').H('This is italic text.')
	])
	.H('Replace the previous nodes with this text', true)
	.dom();

	equal(element.tagName.toLowerCase(), 'p', '<p> element created successfully');
	equal(element.className, 'def', 'Element has a class attribute');
	equal(element.id, 'abc', 'Element has an ID attribute');
	equal(element.innerHTML, 'Replace the previous nodes with this text', 'Element has correct HTML');
});
