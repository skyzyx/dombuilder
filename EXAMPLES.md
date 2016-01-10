# Examples

This is meant to compare the different ways to generate HTML from JavaScript.

## HTML to generate

```html
<div id='test' class='sample'>
    <p>This is a <a href=''>sample of the code</a> that you may like.</p>
    <p>And another <a href='#'><strong>complex-ish</strong></a> one.</p>
    <ul class='sample'>
        <li><a href='http://google.com'>One</a></li>
        <li><em>Two</em></li>
        <li><strong>Three</strong></li>
    </ul>
</div>
```

## Short-form DOMBuilder code

```javascript
// Assign to shorter variables.
var _ = DOMBuilder;

// Do the generation and write to the live DOM
document.body.appendChild(_.DOM(
    _('div#test.sample')._([
        _('p').H('This is a <a href=''>sample of the code</a> that you may like.'),
        _('p').H('And another <a href='#'><strong>complex-ish</strong></a> one.'),
        _('ul.sample')._([
            _('li')._(_('a[href=http://google.com]').H('One')),
            _('li')._(_('em').H('Two')),
            _('li')._(_('strong').H('Three'))
        ])
    ])
));
```

## Longest-form DOMBuilder code

```javascript
// Do the generation and write to the live DOM
document.body.appendChild(DOMBuilder.DOM(
    DOMBuilder('div', {
        'id': '#test',
        'class': ['sample']
    }).child([
        DOMBuilder('p').html('This is a ').child(
            DOMBuilder('a', {
                'href': '#'
            }).html('sample of the code')
        ).html(' that you may like.'),
        DOMBuilder('p').html('And another ').child(
            DOMBuilder('a', {
                'href': '#'
            }).child(
                DOMBuilder('strong').html('complex-ish')
            )
        ).html(' one.'),
        DOMBuilder('ul', {
            'class': ['sample']
        }).child([
            DOMBuilder('li').child(
                DOMBuilder('a', {
                    'href': 'http://google.com'
                }).html('One')
            ),
            DOMBuilder('li').child(
                DOMBuilder('em').html('Two')
            ),
            DOMBuilder('li').child(
                DOMBuilder('strong').html('Three')
            )
        ])
    ])
));
```

## Raw DOM

```javascript
// Parent <div>
var div = document.createElement('div');
div.id = 'test';
div.className = 'sample';

    // First paragraph
    var p1 = document.createElement('p');
    p1.appendChild(document.createTextNode('This is a '));
        var a1 = document.createElement('a');
        a1.setAttribute('href', '');
        a1.appendChild(document.createTextNode('sample of the code'));
    p1.appendChild(a1);
    p1.appendChild(document.createTextNode(' that you may like.'));

    // Second paragraph
    var p2 = document.createElement('p');
    p2.appendChild(document.createTextNode('And another '));
        var a2 = document.createElement('a');
        a2.setAttribute('href', '#');
            var strong1 = document.createElement('strong');
            strong1.appendChild(document.createTextNode('complex-ish'))
        a2.appendChild(strong);
    p1.appendChild(a1);
    p1.appendChild(document.createTextNode(' one.'));

    // Unordered list
    var ul = document.createElement('ul');
    ul.className = 'sample';
        var li1 = document.createElement('li');
            var a3 = document.createElement('a');
            a3.setAttribute('href', 'http://google.com');
            a3.appendChild(document.createTextNode('One'));
        li1.appendChild(a3);
        var li2 = document.createElement('li');
            var em = document.createElement('em');
            a3.appendChild(document.createTextNode('Two'));
        li2.appendChild(em);
        var li3 = document.createElement('li');
            var strong2 = document.createElement('strong');
            strong2.appendChild(document.createTextNode('Three'));
        li3.appendChild(em);
    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);

div.appendChild(p1);
div.appendChild(p2);
div.appendChild(ul);
```
