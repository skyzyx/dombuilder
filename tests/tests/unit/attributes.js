module('Testing complex attributes');

/****************************************************************************************/

test('Test form attributes', function() {

    var element = _('form', {
        'action': '#',
        'method': 'GET',
    })._([
        _('input#abc', {
            'name': 'def',
            'type': 'text',
            'checked': true,
            'disabled': true,
            'readonly': false
        }),
        _('label', {
            'for': 'def'
        }),
    ]).dom();

    equal(element.getAttribute('action'), '#', 'Set the form action to #');
    equal(element.getAttribute('method').toLowerCase(), 'get', 'Set the form method to GET');
    equal(element.children[0].tagName.toLowerCase(), 'input', 'The input field exists');
    equal(element.children[0].getAttribute('name'), 'def', 'The input field is named def');
    equal(element.children[0].getAttribute('type'), 'text', 'The input field has a type of text');
    equal(element.children[0].getAttribute('checked'), 'true', 'The checked state of the input field');
    equal(element.children[0].getAttribute('disabled'), 'true', 'The disabled state of the input field');
    equal(element.children[0].getAttribute('readonly'), 'false', 'The readonly state of the input field');
    equal(element.children[1].tagName.toLowerCase(), 'label', 'The label exists');
    equal(element.children[1].getAttribute('for'), 'def', 'The label is intended for the field named def');
});

/****************************************************************************************/

test('Test data attributes', function() {

    var element = _('label', {
        'for': 'def',
        'data-columns': '3',
        'data-index-number': '12314',
        'data-parent': 'cars'
    }).dom();

    equal(element.getAttribute('data-columns'), '3', 'Check the data columns');
    equal(element.getAttribute('data-index-number'), '12314', 'Check the data index number');
    equal(element.getAttribute('data-parent'), 'cars', 'Check the data cars');
});

/****************************************************************************************/

test('Test data attributes with data enhancement', function() {

    var element = _('label', {
        'for': 'def',
        'data': {
            'columns': '3',
            'index-number': '12314',
            'parent': 'cars'
        }
    }).dom();

    equal(element.getAttribute('data-columns'), '3', 'Check the data columns');
    equal(element.getAttribute('data-index-number'), '12314', 'Check the data index number');
    equal(element.getAttribute('data-parent'), 'cars', 'Check the data cars');
});
