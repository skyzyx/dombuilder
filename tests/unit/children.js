module('Generating Children');

/****************************************************************************************/

test('Generate a single child', function() {

	var element = _('p.myClass').child(
		_('a', { 'href': 'http://google.com' }).H('Google')
	).dom();

	equal(element.getElementsByTagName('*').length, 1, 'Element has one child');
	equal(element.getElementsByTagName('a')[0].getAttribute('href'), 'http://google.com', 'Element has a child with attributes');
	equal(element.getElementsByTagName('a')[0].innerHTML, 'Google', 'Element has a child with content');
});

/****************************************************************************************/

test('Generate multiple children', function() {

	var element = _('p.myClass').child([
		_('a', { 'href': 'http://google.com' }).H('Google'),
		_('span.mySpan').html('This is a span'),
		_('div#myElement').html('This is a DIV')
	]).dom();

	equal(element.getElementsByTagName('*').length, 3, 'Element has three children');
});

/****************************************************************************************/

test('Generate multiple nested children', function() {

	expect(5);

	var element = _('p.myClass').child([
		_('a', { 'href': 'http://google.com' }).H('Google'),
		_('span.mySpan').html('This is a span'),
		_('div#myElement')._([
			_('ul')._([
				_('li').H('One'),
				_('li').H('Two'),
				_('li').H('Three'),
			])
		])
	]).dom();

	equal(element.getElementsByTagName('*').length, 7, 'Element has seven children');

	var element2 = element.getElementsByTagName('li');
	equal(element2.length, 3, 'Element has three <li> nodes');

	element2 = element2[0];
	var elementChain = ['p', 'div', 'ul'];

	while (element2 = element2.parentNode) {
		var popped = elementChain.pop();
		equal(element2.tagName.toLowerCase(), popped, 'The parent element was <' + popped + '>');
	}
});

/****************************************************************************************/

test('Generate multiple nested children from a callback function', function() {

	expect(5);

	var data = ['One', 'Two', 'Three', 'Four', 'Five'];

	var element = _('p.myClass').child([
		_('a', { 'href': 'http://google.com' }).H('Google'),
		_('span.mySpan').html('This is a span'),
		_('div#myElement')._([
			_('ul')._(u.map(data, function(value) {
				return _('li').H(value);
			}))
		])
	]).dom();

	equal(element.getElementsByTagName('*').length, 9, 'Element has seven children');

	var element2 = element.getElementsByTagName('li');
	equal(element2.length, 5, 'Element has five <li> nodes');

	element2 = element2[0];
	var elementChain = ['p', 'div', 'ul'];

	while (element2 = element2.parentNode) {
		var popped = elementChain.pop();
		equal(element2.tagName.toLowerCase(), popped, 'The parent element was <' + popped + '>');
	}
});

/****************************************************************************************/

test('Generate multiple nested children mixed with text nodes', function() {

	var element = _('p.myClass').H('This is a ').child(
		_('a', { 'href': 'http://google.com' }).H('link')
	).H(' to Google.')
	.dom();

	equal(element.getElementsByTagName('*').length, 1, 'Element has one child');
	equal(element.innerHTML, 'This is a <a href="http://google.com">link</a> to Google.', 'innerHTML matches what is expected');
});

/****************************************************************************************/

test('Generate multiple nested children using innerHTML', function() {

	var element = _('p.myClass').H('This is a <a href="http://google.com">link</a> to Google.').dom();

	equal(element.getElementsByTagName('*').length, 1, 'Element has one child');
	equal(element.innerHTML, 'This is a <a href="http://google.com">link</a> to Google.', 'innerHTML matches what is expected');
});

/****************************************************************************************/

test('Generate multiple nested children by mixing text nodes and innerHTML', function() {

	var element = _('p.myClass').H('This is a ').child(
		_('a', { 'href': 'http://google.com' }).H('<strong>link</strong>')
	).H(' to Google.')
	.dom();

	equal(element.getElementsByTagName('*').length, 2, 'Element has two children');
	equal(element.innerHTML, 'This is a <a href="http://google.com"><strong>link</strong></a> to Google.', 'innerHTML matches what is expected');
});

/****************************************************************************************/

test('Generate multiple nested children by mixing native DOM methods and anonymous callbacks', function() {

	var element = _('p.myClass').dom(), a;

	element.appendChild(document.createTextNode('This is a '));
	element.appendChild(a = _('a', { 'href': 'http://google.com' }).dom());
	element.appendChild(document.createTextNode(' to Google.'));
	a.appendChild(function() {
		var strong = _('strong').dom(),
		    text = document.createTextNode('link');
		strong.appendChild(text);
		return strong;
	}());

	equal(element.getElementsByTagName('*').length, 2, 'Element has two children');
	equal(element.innerHTML, 'This is a <a href="http://google.com"><strong>link</strong></a> to Google.', 'innerHTML matches what is expected');
});
