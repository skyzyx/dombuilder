// http://github.com/skyzyx/dombuilder/
var DOMBuilder=function(c,a){this.element=window.document.createElement(c);if(a){for(var b in a){if(b.toString()=="class"){this.element.className=a[b];}else{this.element.setAttribute(b,a[b]);}}}this.child=function(f){if(typeof f!=="object"||typeof f.length!=="number"||typeof f.splice!=="function"){f=[f];}for(var e=0,d=f.length;e<d;e++){if(typeof f[e].asDOM!=="undefined"){this.element.appendChild(f[e].asDOM());}else{this.element.appendChild(f[e]);}}return this;};this.html=function(e,d){d=d||false;if(d){this.element.innerHTML=e;}else{this.element.innerHTML+=e;}return this;};this.asDOM=function(){return this.element;};this.asHTML=function(){var d=document.createElement("div");d.appendChild(this.element);return d.innerHTML;};return this;};