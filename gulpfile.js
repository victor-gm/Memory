const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss')
const htmlMinifier = require('gulp-html-minifier2');
const javascriptObfuscator = require('gulp-javascript-obfuscator');

gulp.task('html', function(){
    return gulp.src('src/index.html')
    .pipe(htmlMinifier({collapseWhitespace:true}))
    .pipe(gulp.dest('build'))
});

gulp.task('css', function(){
    return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/css'))
});

gulp.task('js',function(){
    return gulp.src('src/js/*.js')
    /*.pipe(javascriptObfuscator({
        compact:true,
        sourceMap: true
    }))*/
    .pipe(gulp.dest('build/js'))
});

gulp.task('media',function(){
    return gulp.src('src/media/*/*.jpg')

    .pipe(gulp.dest('build/media'))
});

gulp.task('watch', function(){
    gulp.watch('src/**/*.scss', ['css']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/media/*/*.png', ['media']);
    gulp.watch('src/js/*.js', ['js']);

});



gulp.task('default', ['watch','media','html','css','js']);
