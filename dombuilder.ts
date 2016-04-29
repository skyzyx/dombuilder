(function() {
    interface Attributes {
        class: string[],
        id: string
    }

    class DOMBuilder {
        dotHashRe: RegExp = /[\.#]/;
        e: HTMLElement;
        eqRe: RegExp = /\[([^\]]*)\]/g;
        elem: string;
        match: string[];

        constructor(elem: string, attr) {
            let key: string;
            let k: string;

            this.elem = elem;
            attr = this.extend({}, (attr || {}), this.notation())

            if (this.dotHashRe.test(elem)) {
                this.e = document.createElement(this.elem.split(this.dotHashRe).shift());
            }
            else {
                this.e = document.createElement(elem);
            }

            if (attr) {
                for (key in attr) {
                    if (attr.hasOwnProperty(key)) {
                        if (attr[key] && Array === attr[key].constructor) {
                            attr[key] = attr[key].join(' ');
                        }

                        if (key.toString() === 'class') {
                            this.e.className = attr[key];
                        } else if (key === 'data') {
                            for (k in attr[key]) {
                                if (attr[key].hasOwnProperty(k)) {
                                    this.e.setAttribute('data-' + k, attr[key][k]);
                                }
                            }
                        } else {
                            this.e.setAttribute(key, attr[key]);
                        }
                    }
                }
            }
        }

        notation(): Object {
            if (!this.dotHashRe.test(this.elem) && !this.eqRe.test(this.elem)) {
                return {};
            }

            var att: Attributes = {
                class: [],
                id: ''
            };

            var kvPair: any[] = [];
            while ((this.match = this.eqRe.exec(this.elem)) !== null) {
                kvPair.push(this.match[1].split('='));
            }
            this.elem = this.elem.replace(this.eqRe, '');

            kvPair.forEach(function(val: string, idx: number, arr: string[]) {
                att[arr[idx][0]] = arr[idx][1];
            });

            let pieces: string[] = this.elem.split(this.dotHashRe);
            let elemType: string = pieces.shift();
            let pos: number = elemType.length;
            var classes: string[] = att['class'];

            pieces.forEach(function(val: string, idx: number, arr: string[]) {
                if (this.elem[pos] === '#') {
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

        extend(target: Object, source1: Object, source2: Object): Object {
            var attrname: string;
            target = target || {};

            for (attrname in source1) {
                if (source1.hasOwnProperty(attrname)) {
                    target[attrname] = source1[attrname];
                }
            }

            for (attrname in source2) {
                if (source2.hasOwnProperty(attrname)) {
                    target[attrname] = source2[attrname];
                }
            }

            return target;
        }

        _(obj: [any]): any {
            if (obj && Array === obj.constructor) {
                obj = [obj];
            }

            for (var i: number = 0, max: number = obj.length; i < max; i++) {
                if (typeof obj[i] === 'undefined') {
                    break;
                }

                if (typeof obj[i].dom !== 'undefined') {
                    this.e.appendChild(obj[i].dom());
                } else {
                    this.e.appendChild(obj[i]);
                }
            }

            return this;
        }

        H(str: string, replace: boolean): any {
            if (arguments.length === 0) {
                return this.asHTML();
            }

            replace = replace || false;
            if (replace) {
                this.e.innerHTML = str;
            } else {
                this.e.innerHTML += str;
            }

            return this;
        };

        T(str: string): any {
            if (arguments.length === 0) {
                return this.asText();
            }

            // Set the value
            if (this.e.innerText) {
                this.e.innerText = str;
            } else {
                var text: Text = document.createTextNode(str);
                this.e.appendChild(text);
            }

            return this;
        };

        dom(): HTMLElement {
            return this.e;
        }

        asHTML(): string {
            var t: HTMLDivElement = document.createElement('div');
            t.appendChild(this.e);
            return t.innerHTML;
        }

        asText(): string {
            var t: HTMLDivElement = document.createElement('div');
            t.appendChild(this.e);

            if (t.innerText) {
                return t.innerText;
            } else if (t.textContent) {
                return t.textContent;
            }
        }
    }

    window['DOMBuilder'] = (elem, attr) => new DOMBuilder(elem, attr);

    window['DOMBuilder'].append = function(nodes): Node {
        var f: Node = document.createDocumentFragment();
        var n: NodeList = new DOMBuilder('div', {})._(nodes).dom().childNodes;

        while (n.length) {
            f.appendChild(n[0]);
        }

        return f;
    }
})();
