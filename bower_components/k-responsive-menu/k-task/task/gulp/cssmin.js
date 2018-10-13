'use strict';

import path from 'path';
import del from 'del';
import minifyCss from 'gulp-minify-css';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import gulpif from 'gulp-if';

module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
    let url = config;
    let dest = path.join(target);

    // Run task

    gulp.task('cssmin', () => {

        return gulp.src(path.join(target, '**/*.css'))
            .pipe(gulpif(!setgulp.production, plugins.sourcemaps.init()))
            .pipe(minifyCss())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulpif(!setgulp.production, plugins.sourcemaps.write('./')))
            .pipe(plugins.changed(dest))
            .pipe(gulp.dest(dest));

    });

}