const mix = require('laravel-mix');

/*
 | ----------------------------------------------------------------------
 |  Mix Asset Management
 | ----------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 */

// Mix options.
mix.setPublicPath('assets');

//  Compile JS.
mix.js('resources/js/app.js', 'js');

// Compile SASS and apply PostCSS plugins.
mix.sass('resources/sass/main.scss', 'css').options({
    postCss: [
        require('postcss-sort-media-queries')(),
    ],
});
