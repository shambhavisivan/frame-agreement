const gulp = require('gulp');
const zip = require('gulp-zip');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const forceDeploy = require('gulp-jsforce-deploy');
const credentials = require('./credentials.js');
const prettier = require('gulp-prettier');
const sassbeautify = require('gulp-sassbeautify');

gulp.task('prettier', () => {
  return gulp.src(['src/**/*.jsx', 'src/**/*.js'])
    .pipe(prettier({ singleQuote: true , useTabs: true}))
    .pipe(gulp.dest('src'));
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
gulp.task('pretty', ['prettier', 'beautify-scss']);

// credentials.js:
// ---------------
// module.exports = {
//   username: {username},    // 'john.doe@someorg.com'
//   password: {pass + token} // 'pass12345LAodFDscgRQhf4qwRix0gKA8'
// };