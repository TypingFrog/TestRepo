import _gulp from 'gulp';
import gulpHelp from 'gulp-help';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import bump from 'gulp-bump';
import del from 'del';
// import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import path from 'path';

const gulp = gulpHelp(_gulp);

const paths = {
  es6: ['src/**/*.js'],
  es5: 'lib/',
  // Must be absolute or relative to source map
  sourceRoot: path.join(__dirname, 'src'),
};

gulp.task('clean', 'remove generated files in lib directory', () => {
  return del([
    'lib/**/*',
  ]);
});

gulp.task('bump', 'bump the patch version number', ['lib'], () => {
  gulp.src(['./package.json'])
    .pipe(bump({ type: 'patch' }))
    .pipe(gulp.dest('./'));
});

gulp.task('babel', 'generate es5 files in lib directory', ['clean'], () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({
    }))
    .pipe(gulp.dest('lib/'));
});

gulp.task('libdebug', 'build with sourcemaps', ['clean'], () => {
  return gulp.src(paths.es6)
    .pipe(sourcemaps.init())
    .pipe(babel({ optional: ['runtime'] }))
    .pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: paths.sourceRoot,
    }))
    .pipe(gulp.dest(paths.es5));
});

gulp.task('watch', 'watcher task to generate es5 files', () => {
  gulp.watch('*.js', ['babel']);
});

gulp.task('mocha', 'run the unit tests using mocha', ['env.test'], () => {
  return gulp.src(['test/**/*.test.js'])
    .pipe(mocha({
      compilers: {
        js: babel,
      },
    }));
});

gulp.task('lib', 'generate the es5 library in lib', ['babel']);

gulp.task('lint', 'run eslint on all the source files', () => {
  // Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

// Default Task
gulp.task('default', ['help']);
