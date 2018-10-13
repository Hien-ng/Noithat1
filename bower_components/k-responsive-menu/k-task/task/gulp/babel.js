'use strict';

import path from 'path';
import del from 'del';
import babel from 'gulp-babel';
import through from 'through2';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';

module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
    let url = config;
    let dest = path.join(target);
    let destconfig = path.join(target, url.config);
    let destjs = path.join(target, url.scripts.assets);

    // Run task
    gulp.task('babel', () => {
        return gulp.src([
                '!' + path.join(url.source, url.ignore.scripts),
                path.join(url.source, url.scripts.javascript, '**/*.js')
            ])
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.babel({
                presets: ['es2015']
            }))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(plugins.changed(dest))
            .pipe(gulp.dest(destjs));
    });

};