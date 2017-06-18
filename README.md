[![view on npm](https://img.shields.io/npm/v/lws-spa.svg)](https://www.npmjs.org/package/lws-spa)
[![npm module downloads](https://img.shields.io/npm/dt/lws-spa.svg)](https://www.npmjs.org/package/lws-spa)
[![Build Status](https://travis-ci.org/lwsjs/spa.svg?branch=master)](https://travis-ci.org/lwsjs/spa)
[![Dependency Status](https://david-dm.org/lwsjs/spa.svg)](https://david-dm.org/lwsjs/spa)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# lws-spa

Adds the "Single Page Application" feature to lws.

## Synopsis

You're building a web app with client-side routing, so mark `index.html` as the SPA.
```sh
$ lws --stack spa --spa index.html
```

By default, typical SPA paths (e.g. `/user/1`, `/login`) would return `404 Not Found` as a file does not exist with that path. By marking `index.html` as the SPA you create this rule:

*If a static file at the requested path exists (e.g. `/css/style.css`) then serve it, if it does not (e.g. `/login`) then serve the specified SPA and handle the route client-side.*

[Example](https://github.com/75lb/local-web-server/tree/master/example/spa).

* * *

&copy; 2016-17 Lloyd Brookes <75pound@gmail.com>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).