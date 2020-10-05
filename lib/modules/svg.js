'use strict';

module.exports = function (one) {

    one.defaultOptions.svg = {
        src: null,
        exts: ['svg'],
        rename: {},
        minify: {
            plugins: [
                {
                    removeViewBox: false,
                },
                {
                    removeDimensions: true,
                }
            ]
        },
        store: {
            inlineSvg: true
        },
        preprocess: {
            includePaths: [one.options.src]
        }
    };

    one.sources.svg = () =>
        one.src.fromExts(one.options.svg.src || one.options.src, one.options.svg.exts);

    one.transforms.svg = {
        rename: svg => {
            let rename = require('gulp-rename');

            return svg
                .pipe(one.cache.cached('svg.rename'))
                .pipe(rename(one.options.svg.rename))
                .pipe(one.cache.remember('svg.rename'));
        },
        minify: svg => {
            let svgmin = require('gulp-svgmin');

            return svg
                .pipe(one.cache.cached('svg.minify'))
                .pipe(svgmin(one.options.svg.minify))
                .pipe(one.cache.remember('svg.minify'));
        },
        store: svg => {
            let svgstore = require('gulp-svgstore');

            return svg
                .pipe(svgstore(one.options.svg.store));
        },
        inject: (html, svgs) => {
            let inject = require('gulp-inject');

            return html
                .pipe(inject(svgs, {
                    transform: (filePath, file) => file.contents.toString()
                }));
        }
    };
};