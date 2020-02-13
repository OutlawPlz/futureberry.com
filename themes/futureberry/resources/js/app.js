window._ = require('lodash');

/*
 | ----------------------------------------------------------------------
 |  Bootstrap
 | ----------------------------------------------------------------------
 |
 | Bootstrap depends on jQuery and Popper, make sure to add both of
 | them to your package.json using: npm install --save-dev jquery popper.js
 |
 | https://getbootstrap.com/docs/4.4/getting-started/webpack/#installing-bootstrap
 */

try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');

    //require('bootstrap');
} catch (error) {}

/*
 | ----------------------------------------------------------------------
 |  Components
 | ----------------------------------------------------------------------
 */

import hotword from './components/hotword';

hotword();
