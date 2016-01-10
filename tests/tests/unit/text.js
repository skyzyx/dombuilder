module('Generating Text content');

/****************************************************************************************/

test('HTMLify some plain text', function() {

    var element = _('p').text('&amp;&copy;&reg;&trade;').H();

    equal(element, '<p>&amp;amp;&amp;copy;&amp;reg;&amp;trade;</p>', 'Element has correct HTML');
});

/****************************************************************************************/

test('Textify some HTML', function() {

    var element = _('p').html('&amp;&quot;').T();

    equal(element, '&"', 'Element has correct HTML');
});

/****************************************************************************************/

test('Text in, text out', function() {

    var element = _('p').text('&amp;&copy;&reg;&trade;').text();

    equal(element, '&amp;&copy;&reg;&trade;', 'Element has correct HTML');
});

/****************************************************************************************/

test('HTML in, HTML out', function() {

    var element = _('p').html('&amp;&quot;').html();

    equal(element, '<p>&amp;"</p>', 'Element has correct HTML');
});
