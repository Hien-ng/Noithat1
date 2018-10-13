'use strict';

import fs from 'fs';
import path from 'path';
import foldero from 'foldero';
import jade from 'jade';

module.exports = function(gulp, setgulp, plugins, config, target, browserSync) {
  let url = config;
  let dest = path.join(target, 'tools');
  let dataPath = path.join(url.source, url.data);

  // Run task

  // Jade template compile
  gulp.task('jadeindex', () => {
    let siteData = {};
    if (fs.existsSync(dataPath)) {
      // Convert directory to JS Object
      siteData = foldero(dataPath, {
        recurse: true,
        whitelist: '(.*/)*.+\.(json)$',
        loader: function loadAsString(file) {
          let json = {};
          try {
            json = JSON.parse(fs.readFileSync(file, 'utf8'));
          } catch (e) {
            console.log('Error Parsing JSON file: ' + file);
            console.log('==== Details Below ====');
            console.log(e);
          }
          return json;
        }
      });
    }

    // Add --debug option to your gulp task to view
    // what data is being loaded into your templates
    if (setgulp.debug) {
      console.log('==== DEBUG: site.data being injected to templates ====');
      console.log(siteData);
      console.log('\n==== DEBUG: package.json config being injected to templates ====');
      console.log(config);
    }

    return gulp.src([
        path.join(url.source, url.layouts.jade, 'tools', '*.jade'),
        '!' + path.join(url.source, '{**/\_*,**/\_*/**}')
      ])
      .pipe(plugins.changed(dest))
      .pipe(plugins.plumber())
      .pipe(plugins.jade({
        jade: jade,
        pretty: true,
        locals: {
          config: config,
          debug: true,
          site: {
            data: siteData
          }
        }
      }))
      .pipe(plugins.htmlmin({
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        removeCommentsFromCDATA: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true
      }))
      .pipe(gulp.dest(dest))
      .on('end', browserSync.reload);
  });
}
