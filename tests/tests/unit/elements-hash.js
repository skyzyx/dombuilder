module('Element creation syntax (Hash-style)');

/****************************************************************************************/

test('Generate simple nodes', function() {

    expect(5);

    var element = _('p').dom();

    equal(element.tagName.toLowerCase(), 'p', '<p> element created successfully');
    equal(element.className, '', 'Element does not have a class attribute');
    equal(element.id, '', 'Element does not have an ID attribute');
    equal(element.getAttribute('name'), null, 'Element does not have a name attribute');
    equal(element.getAttribute('for'), null, 'Element does not have a for attribute');
});

/****************************************************************************************/

test('Generate simple nodes with a class name', function() {

    expect(5);

    var element = _('p', { 'class': 'myClass' }).dom();

    equal(element.tagName.toLowerCase(), 'p', '<p> element created successfully');
    equal(element.className, 'myClass', 'Element has a class attribute of myClass');
    equal(element.id, '', 'Element does not have an ID attribute');
    equal(element.getAttribute('name'), null, 'Element does not have a name attribute');
    equal(element.getAttribute('for'), null, 'Element does not have a for attribute');
});

/****************************************************************************************/

test('Generate simple nodes with multiple class names', function() {

    expect(5);

    var element = _('p', { 'class': ['myClass1', 'myClass2', 'myClass3'] }).dom();

    equal(element.tagName.toLowerCase(), 'p', '<p> element created successfully');
    equal(element.className, 'myClass1 myClass2 myClass3', 'Element has a class attribute with multiple values');
    equal(element.id, '', 'Element does not have an ID attribute');
    equal(element.getAttribute('name'), null, 'Element does not have a name attribute');
    equal(element.getAttribute('for'), null, 'Element does not have a for attribute');
});

/****************************************************************************************/

test('Generate simple nodes with an ID', function() {

    expect(5);

    var element = _('p', { 'id': 'myId' }).dom();

    equal(element.tagName.toLowerCase(), 'p', '<p> element created successfully');
    equal(element.className, '', 'Element does not have a class attribute');
    equal(element.id, 'myId', 'Element has an ID attribute of myId');
    equal(element.getAttribute('name'), null, 'Element does not have a name attribute');
    equal(element.getAttribute('for'), null, 'Element does not have a for attribute');
});

/****************************************************************************************/

test('Generate simple nodes with multiple attributes', function() {

    expect(6);

    var element = _('div', {
        'class': 'myClass',
        'id': 'myId',
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

