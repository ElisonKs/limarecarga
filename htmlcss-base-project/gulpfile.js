const {task, src, dest, watch, series, parallel} = require('gulp');

const clean = require('gulp-clean');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const terser = require('gulp-terser');
const browserSync = require('browser-sync');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const sassGlob = require('gulp-sass-glob');
const imagemin = require('gulp-imagemin');

const server = browserSync.create();

task('serve', function(done) {
  server.init({server: './src'});
  done();
});

task('reload', function(done) {
  server.reload();
  done();
});

task('clean', function() {
  return src('build', {read: false, allowEmpty: true})
      .pipe(clean());
});

task('watchers', function() {
  watch('src/assets/scss/**/*.scss', series('styles', 'reload'));
  watch('src/**/*.{html,js,css}', series('reload'));
});

task('styles', function() {
  return src('src/assets/scss/main.scss')
      .pipe(sassGlob())
      .pipe(sass({
        includePaths: ['node_modules'],
      }).on('error', sass.logError))
      .pipe(autoprefixer({cascade: false}))
      .pipe(dest('src/assets/css'));
});

task('images', function() {
  return src('src/assets/img/**/*.{jpg,jpeg,png,svg,gif}')
      .pipe(imagemin())
      .pipe(dest('build/img'));
});

task('vendor', function() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
  ])
      .pipe(concat('vendor.js'))
      .pipe(dest('src/assets/js'));
});

task('html', function() {
  return src('src/*.html')
      .pipe(useref())
      .pipe(gulpif('*.js', terser()))
      .pipe(gulpif('*.css', cssnano()))
      .pipe(gulpif('*.js', rev()))
      .pipe(gulpif('*.css', rev()))
      .pipe(revReplace())
      .pipe(gulpif('*.html', htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })))
      .pipe(dest('build'));
});

task('assets', function() {
  return src([
    'src/**/assets/docs/**/*',
    'src/**/assets/favicon/**/*',
    'src/**/assets/fonts/**/*',
  ]).pipe(dest('build'));
});

task('default', series('vendor', parallel('serve', 'watchers')));
task('build', series('clean', 'vendor', 'assets', 'images', 'html'));
