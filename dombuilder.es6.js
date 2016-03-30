
// For all code examples below, please assume that we've done the following aliasing — just to keep things a little less verbose.
//
//     // Assign to shorter variables.
//     var _ = DOMBuilder, $body = document.body;
//     $body.a = $body.appendChild;

// ## Digging into code

// Do everything in a localized scope. We'll expose pieces to the global scope later.
;(() => {
    // ## DOMBuilder
    //
    // Accepts a string representation of a tag name for the element parameter, and a JSON hash of key-value
    // pairs for the attributes parameter. Returns a self-reference to this by default. Provides methods,
    // described below. You can easily shorten this function name by assigning it to a variable.
    //
    //     // Longer-form
    //     $body.a(_.DOM(
    //         _('p', {
    //             'id':'abc',
    //             'class':['def', 'ghi']
    //         })
    //     ));
    //
    //     // or...
    //
    //     // Shorter-form
    //     $body.a(_.DOM(
    //         _('p#abc.def.ghi')
    //     ));
    //
    // This `X` variable will be exposed to the global scope as `DOMBuilder`.

    const X = function (elem, attr) {

        // Internally to DOMBuilder, we use very short variable names so that we can squeeze the file size
        // down as small as possible using Uglify.
        const _ = this;
        const d = document;
        const dotHashRe = new RegExp(/[\.#]/);
        const eqRe = new RegExp(/\[([^\]]*)\]/g);
        let key;
        let k;
        let match;

        // Set a default internal value
        attr = attr || {};

        // Support CSS/jQuery-style notation for generating elements with IDs, classnames, and simple attributes.
        //
        //     div#myId
        //     p#id.class1.class2
        //     a[href=https://google.com]
        function notation() {

            if (!dotHashRe.test(elem) && !eqRe.test(elem)) {
                return {};
            }

            const att = {
                class: [],
                id: ''
            };

            // Collect all of the `[k=v]` blocks.
            const kvPair = [];
            while ((match = eqRe.exec(elem)) !== null) {
                kvPair.push(match[1].split('='));
            }
            elem = elem.replace(eqRe, '');

            kvPair.forEach((val, idx, arr) => {
                att[arr[idx][0]] = arr[idx][1];
            });

            // Support CSS/jQuery-style notation for generating elements with IDs and classnames.
            const pieces = elem.split(dotHashRe);
            const elemType = pieces.shift();
            let pos = elemType.length;
            const classes = att['class'];

            pieces.forEach((val, idx, arr) => {
                if (elem[pos] === '#') {
                    att.id = val;
                } else {
                    classes.push(val);
                }

                pos += arr[idx].length + 1;
            });

            att['class'] = classes;
            if (!att['class'].length) {
                delete att['class'];
            }
            if (att['id'] === '') {
                delete att['id'];
            }

            return att;
        }

        // Merge the properties of one object with the properties of a second object. (Internal-only!)
        function mergeOptions(o1, o2) {
            const o3 = {};
            let attrname;

            for (attrname in o1) {
                if (o1.hasOwnProperty(attrname)) {
                    o3[attrname] = o1[attrname];
                }
            }

            for (attrname in o2) {
                if (o2.hasOwnProperty(attrname)) {
                    o3[attrname] = o2[attrname];
                }
            }

            return o3;
        }

        // Merge options into a conglomo-hash!
        attr = mergeOptions(attr, notation());

        // Construct the element, loop through the list of attributes and add them to the node.
        if (dotHashRe.test(elem)) {
            _.e = d.createElement(elem.split(dotHashRe).shift());
        } else {
            _.e = d.createElement(elem);
        }

        if (attr) {
            for (key in attr) {
                if (attr.hasOwnProperty(key)) {
                    if (typeof attr[key] === 'object' && typeof attr[key].length === 'number' && typeof attr[key].splice === 'function') {
                        attr[key] = attr[key].join(' ');
                    }

                    // Because of the way that IE works, class names need to be added explicitly via the `.className`
                    // property instead of using `.setAttribute()`.
                    if (key.toString() === 'class') {
                        _.e.className = attr[key];

                        // Support `data: {}` for data attributes
                    } else if (key.toString() === 'data') {
                            for (k in attr[key]) {
                                if (attr[key].hasOwnProperty(k)) {
                                    _.e.setAttribute(`data-${k}`, attr[key][k]);
                                }
                            }
                        } else {
                            _.e.setAttribute(key, attr[key]);
                        }
                }
            }
        }

        // ### .child() or ._()
        //
        // The `child()` method is used to add children to a parent node, or to add a new tag to a
        // text string. Accepts one or more child nodes in the form of a `DOMBuilder` object or a native
        // `HTMLElement` node (created with `document.createElement()`). Multiple child nodes are passed as an
        // array of objects. Returns a self-reference to `this` by default.
        //
        //     $body.a(_.DOM(
        //         _('p#abc.def')._([
        //             _('strong').H('This is bold text.'),
        //             _('em').H('This is italic text.')
        //         ])
        //     ));
        _.child = _._ = obj => {

            // If the object isn't an array, convert it to an array to maintain a single codepath below.
            if (typeof obj !== 'object' || typeof obj.length !== 'number' || typeof obj.splice !== 'function') {
                obj = [obj];
            }

            // Loop through the indexed array of children. If the node is a `DOMBuilder` object, convert it to
            // DOM and append it. Otherwise, assume it's a real DOM node.
            for (let i = 0, max = obj.length; i < max; i++) {

                if (typeof obj[i] === 'undefined') {
                    break;
                }

                if (typeof obj[i].asDOM !== 'undefined') {
                    _.e.appendChild(obj[i].asDOM());
                } else {
                    _.e.appendChild(obj[i]);
                }
            }

            return _;
        };

        // ### .html() or .H()
        //
        // The `html()` method is used for adding text or HTML content to a node. Since it leverages `.innerHTML`
        // under the hood, you can pass a string of content to the text parameter. The default behavior is to
        // append content.
        //
        // If you'd prefer to replace the existing `.innerHTML` content instead, pass a boolean `true` to the
        // `replace` parameter. Returns a self-reference to `this` by default.
        //
        // Pass no parameters to read back the node as a string of HTML.
        //
        //     $body.a(_.DOM(
        //         _('p#abc.def')._([
        //             _('strong').H('This is bold text.'),
        //             _('em').H('This is italic text.')
        //         ])
        //         .H('Replace the previous nodes with this text', true)
        //     ));
        //
        //     _('p#abc.def')._([
        //         _('strong').H('This is bold text.'),
        //         _('em').H('This is italic text.')
        //     ]).html()
        _.html = _.H = function (str, replace) {

            // No parameters? Read the value instead. Alias for asHTML().
            if (arguments.length === 0) {
                return _.asHTML();
            }

            // Determine the default value for `replace`.
            replace = replace || false;

            // Set the value with innerHTML.
            if (replace) {
                _.e.innerHTML = str;
            } else {
                _.e.innerHTML += str;
            }

            return _;
        };

        // ### .text() or .T()
        //
        // The `text()` method is used for adding plain text content to a node. Since it leverages `.textContent`
        // or `.innerText` under the hood, you can pass a string of content to the text parameter. The default
        // behavior is to append content.
        //
        // If you'd prefer to replace the existing content instead, pass a boolean `true` to the `replace`
        // parameter. Returns a self-reference to `this` by default.
        //
        // Pass no parameters to read back the node as a string of plain text.
        //
        //     $body.a(_.DOM(
        //         _('p#abc.def')._([
        //             _('strong').H('This is bold text.'),
        //             _('em').H('This is italic text.')
        //         ])
        //         .T('Replace the previous nodes with this text', true)
        //     ));
        //
        //     _('p#abc.def')._([
        //         _('strong').H('This is bold text.'),
        //         _('em').H('This is italic text.')
        //     ]).text()
        _.text = _.T = function (str) {

            // No parameters? Read the value instead. Alias for asText().
            if (arguments.length === 0) {
                return _.asText();
            }

            // Set the value
            if (_.e.innerText) {
                _.e.innerText = str;
            } else {
                const text = document.createTextNode(str);
                _.e.appendChild(text);
            }

            return _;
        };

        // ### .asDOM() or .dom()
        //
        // Returns a real DOM node for use with the standard JavaScript DOM methods. When DOMBuilder objects
        // are passed to the child method, `asDOM()` is optional. It is only required when it's the last method
        // in the chain while being passed into a real JavaScript DOM node.
        //
        //     $body.a(
        //         _('p#abc.def')._([
        //             _('strong').H('This is bold text.'),
        //             _('em').H('This is italic text.')
        //         ]).dom()
        //     );
        _.asDOM = _.dom = () => _.e;

        // ### .asHTML() or .html() or .H()
        //
        // Returns the DOM nodes as a string of HTML. It's as simple as that.
        //
        //     var id = document.getElementById('id');
        //     id.innerHTML = _('p#abc.def').H('This is my text.').asHTML();
        _.asHTML = () => {

            const t = d.createElement('div');
            t.appendChild(_.e);
            return t.innerHTML;
        };

        // ### .asText() or .text() or .T()
        //
        // Returns the DOM nodes as a string of plain text. It's as simple as that.
        //
        //     var id = document.getElementById('id');
        //     id.innerHTML = _('p#abc.def').H('This is my text.').asText();
        _.asText = () => {

            const t = d.createElement('div');
            t.appendChild(_.e);

            if (t.innerText) {
                return t.innerText;
            } else if (t.textContent) {
                return t.textContent;
            }
        };

        return _;
    };

    // ## Expose to the global scope
    //
    // Pre-instantiate the class on each call so that you never need to use `new`.
    window.DOMBuilder = (elem, attr) => new X(elem, attr);

    // ## DOM()
    //
    // This is the function that all other `DOMBuilder` nodes are passed into, as it returns directly into the
    // `appendChild()` method. For a single `DOMBuilder` chain, this is interchangable with the `.asDOM()`
    // method (although they're used differently).
    //
    // If you are passing in multiple sibling nodes without a parent, `DOM()` leverages
    // [Document Fragments](http://ejohn.org/blog/dom-documentfragments/) to substantially speed up the process
    // of writing multiple nodes to the live DOM.
    //
    //     $body.a(_.DOM([
    //         _('p#abc.def').H('This is my text.'),
    //         _('p').H('Something simpler.'),
    //         _('p').H('Let\'s add a third paragraph, for kicks.')
    //     ]));
    window.DOMBuilder.DOM = nodes => {

        // Create a document fragment. Grab and loop through the in-memory DOM nodes, and _move_ them to the

        const f = document.createDocumentFragment(), n = new X('div')._(nodes).dom().childNodes;

        while (n.length) {
            f.appendChild(n[0]);
        }

        // Return the Document Fragment to the calling method (presumably `.appendChild()`).
        return f;
    };
})();
