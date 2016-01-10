module('Generating a document fragment');

/****************************************************************************************/

test('Insert a document fragment with a single element into the live DOM', function() {

    $fixture = document.getElementById('qunit-fixture');

    $fixture.appendChild(_.DOM(
        _('p.myClass#myId')._(
            _('a', { 'name':'anchor' }).html('This is an in-page anchor link.')
        )
    ));

    equal($fixture.getElementsByTagName('*').length, 2, 'Two elements were inserted into the live DOM');
    equal($fixture.children.length, 1, 'One element is a direct child of the fixture node');
});

/****************************************************************************************/

test('Insert a document fragment with multiple elements into the live DOM', function() {

    $fixture = document.getElementById('qunit-fixture');

    $fixture.appendChild(_.DOM([
        _('p.myClass')._(
            _('span').html('This is an in-page anchor link.')
        ),
        _('p.myClass')._(
            _('span').html('This is an in-page anchor link.')
        ),
        _('p.myClass')._(
            _('span').html('This is an in-page anchor link.')
        )
    ]));

    equal($fixture.getElementsByTagName('*').length, 6, 'Six elements were inserted into the live DOM');
    equal($fixture.children.length, 3, 'Three elements are direct children of the fixture node');
});
