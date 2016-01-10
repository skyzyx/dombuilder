module('Element creation syntax (CSS-style)');

/****************************************************************************************/

test('Generate simple nodes with a class name', function() {

    expect(5);

    var element = _('p.myClass').dom();

    equal(element.tagName.toLowerCase(), 'p', '<p> element created successfully');
    equal(element.className, 'myClass', 'Element has a class attribute of myClass');
    equal(element.id, '', 'Element does not have an ID attribute');
    equal(element.getAttribute('name'), null, 'Element does not have a name attribute');
    equal(element.getAttribute('for'), null, 'Element does not have a for attribute');
});

/****************************************************************************************/

test('Generate simple nodes with multiple class names', function() {

    expect(5);

    var element = _('p.myClass1.myClass2.myClass3').dom();

    equal(element.tagName.toLowerCase(), 'p', '<p> element created successfully');
    equal(element.className, 'myClass1 myClass2 myClass3', 'Element has a class attribute with multiple values');
    equal(element.id, '', 'Element does not have an ID attribute');
    equal(element.getAttribute('name'), null, 'Element does not have a name attribute');
    equal(element.getAttribute('for'), null, 'Element does not have a for attribute');
});

/****************************************************************************************/

test('Generate simple nodes with an ID', function() {

    expect(5);

    var element = _('p#myId').dom();

    equal(element.tagName.toLowerCase(), 'p', '<p> element created successfully');
    equal(element.className, '', 'Element does not have a class attribute');
    equal(element.id, 'myId', 'Element has an ID attribute of myId');
    equal(element.getAttribute('name'), null, 'Element does not have a name attribute');
    equal(element.getAttribute('for'), null, 'Element does not have a for attribute');
});

/****************************************************************************************/

test('Generate simple nodes with multiple attributes', function() {

    expect(6);

    var element = _('div#myId.myClass', {
        'name': 'myName',
        'for': 'myFor',
        'custom': 'myCustom'
    }).dom();

    equal(element.tagName.toLowerCase(), 'div', '<div> element created successfully');
    equal(element.className, 'myClass', 'Element has a class attribute of myClass');
    equal(element.id, 'myId', 'Element has an ID attribute of myId');
    equal(element.getAttribute('name'), 'myName', 'Element has a name attribute of myName');
    equal(element.getAttribute('for'), 'myFor', 'Element has a for attribute of myFor');
    equal(element.getAttribute('custom'), 'myCustom', 'Element has a custom attribute of myCustom');
});

/****************************************************************************************/

test('Generate attributes with CSS-style [x=y] syntax', function() {

    expect(2);

    var element = _('a[href=https://google.com]').dom();

    equal(element.tagName.toLowerCase(), 'a', '<a> element created successfully');
    equal(element.getAttribute('href'), 'https://google.com', 'Link set to google.com');
});

/****************************************************************************************/

test('Generate more attributes with CSS-style [x=y] syntax', function() {

    expect(5);

    var element = _('a.abc#def[href=#][for=def]').dom();

    equal(element.tagName.toLowerCase(), 'a', '<a> element created successfully');
    equal(element.className, 'abc', 'Element has a class attribute of abc');
    equal(element.id, 'def', 'Element has an ID attribute of def');
    equal(element.getAttribute('href'), '#', 'Element has an href attribute of #');
    equal(element.getAttribute('for'), 'def', 'Element has a for attribute of def');
});
