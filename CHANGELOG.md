# CHANGELOG

## Unreleased

* Switched from the 3-clause BSD license to the MIT license.
* Updated the build chain to use modern tools.
    * JSLint → ESLint
    * Bash to `make`
    * Google Closure Compiler → Uglify
    * Dependency resolution with `npm` and `bower`.
    * Updated to latest QUnit release.
* Switched CHANGELOG to use the format from <http://keepachangelog.com>.
* Lots of updates to the README and the generated documentation.

## 1.3 - 2011-07-08

This release was heavily inspired by [DOMBrew](https://github.com/glebm/DOMBrew/).

* Added a number of shortcuts and niceties.
* Use `.dom()` as an alias for `.asDOM()`.
* Use `.html()` as an alias for `.asHTML()`.
* Use `._()` as an alias for `.child()`.
* You can now pass an array of class names to the 'class' hash attribute.
* You can also use CSS-style `#` and `.` notation for setting IDs and class names.
* Also now supports `.text()` and `.asText()` for working with plain text nodes.
* Added support for using `.T()` and `.H()` as shortcuts for `.text()` and `.html()`.


## 1.2 - 2010-01-02

* Added `.DOM()` as the primary way of passing real DOM nodes back; useful for appending multiple nodes at once.


## 1.1 - 2009-12-28

* Simplified the code under the hood. Now runs a little faster and compresses even smaller.
* Removed the need to instantiate the class, making it easier to alias.
* Ensured that it passed JSLint.
* Provided a version minified by Google Closure Compiler.


## 1.0 - 2009-12-15

* Made sure that it worked with Internet Explorer 6 & 7.
* Improved the innards of `.child()` to be more efficient.
* Merged `.innerHTML()` and `.appendHTML()` together into the new `.html()` method.
* Provided a version minified by YUI Compressor.


## 0.0 - 2009

Initial pre-release of DOMBuilder.
