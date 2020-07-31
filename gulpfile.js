const gulp = require('gulp');
const zip = require('gulp-zip');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const forceDeploy = require('gulp-jsforce-deploy');
// const credentials = require('./credentials.js');
const prettier = require('gulp-prettier');
const sassbeautify = require('gulp-sassbeautify');

gulp.task('prettier', () => {
  return gulp.src(['src/**/*.jsx', 'src/**/*.js'])
    .pipe(prettier({ singleQuote: true , useTabs: true,  printWidth: 100}))
    .pipe(gulp.dest('src'));
});

gulp.task('prettierDist', () => {
  return gulp.src(['dist/DiscountCodes.js', 'dist/DynamicGroup.js', 'dist/local_data.js'])
    .pipe(prettier({ singleQuote: true , useTabs: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('prettierLocal', () => {
  return gulp.src(['src/**/*.{js,jsx}'])
    .pipe(prettier({ singleQuote: true , useTabs: true, parser: "babel", printWidth: 140}))
    .pipe(gulp.dest('src'));
});

gulp.task('prettierTest', () => {
  return gulp.src(['__tests__/**/*.{js,jsx}'])
    .pipe(prettier({ singleQuote: true , useTabs: true, parser: "babel", printWidth: 140}))
    .pipe(gulp.dest('__tests__'));
});

gulp.task('beautify-scss', () => {
  return gulp.src('src/**/*.scss')
    .pipe(sassbeautify())
    .pipe(gulp.dest('src'))
})

gulp.task('convert', function () {
  return gulp.src(['dist/bundle.js'])
    .pipe(rename('RateCardManagment.resource'))
    .pipe(gulp.dest('./pkg/staticresources/'));
});

gulp.task('static', function() {
  gulp.src(['./pkg/staticresources/RateCardManagment**','./pkg/package.xml'], { base: "." })
    .pipe(zip('pkg.resource'))
    .pipe(forceDeploy({
      username: credentials.username,
      password: credentials.password
    }));
});

gulp.task('deploy', function (callback) {
  return runSequence('convert', 'static',
    callback
  );
});

gulp.task('default', ['deploy']);
gulp.task('pretty', ['prettier', 'prettierDist', 'beautify-scss']);
gulp.task('format', ['prettierLocal', 'prettierDist', 'prettierTest']);

// credentials.js:
// ---------------
// module.exports = {
//   username: {username},    // 'john.doe@someorg.com'
//   password: {pass + token} // 'pass12345LAodFDscgRQhf4qwRix0gKA8'
// };