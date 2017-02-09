// ---------- modules ---------- //


var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    cache       = require('gulp-cache'),
// css
    sass        = require('gulp-sass'),
    cssnano     = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
// js
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
// imgs
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant');


// ---------- variables ---------- //


var browsers = ['last 2 versions', 'ie >= 9', 'ios >= 7'];
var stylesheets_paths = [
    // 'node_modules/bootstrap-sass/assets/stylesheets'
];
var scripts_paths = [
    'node_modules/jquery/dist/jquery.min.js',
    'app/js/main.js'
];


// ---------- tasks ---------- //


gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.sass')
               .pipe(sass({includePaths: stylesheets_paths, outputStyle: 'expanded'}))
               .pipe(autoprefixer(browsers, { cascade: true }))
               .pipe(cssnano())
               .pipe(rename({suffix: '.min'}))
	             .pipe(gulp.dest('app/css'))
               .pipe(browserSync.stream())
});

gulp.task('js', function() {
    return gulp.src(scripts_paths)
               .pipe(concat('scripts.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest('app/js'))
               .pipe(browserSync.stream())
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') 
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('production', ['clean', 'img', 'sass', 'js'], function() {

    var html = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

    var css = gulp.src('app/css/styles.min.css')
    .pipe(gulp.dest('dist/css'))

    var js = gulp.src('app/js/scripts.min.js')
    .pipe(gulp.dest('dist/js'))

    var fonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

});

gulp.task('start', ['sass', 'js'], function() {
    browserSync.init({server: {baseDir: "app/"}, 
                      notify: false // disable notifications
    });

    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/js/**/*.js', ['js']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('clear', function () {
    return cache.clearAll();
})


// ---------- final tasks ---------- //


gulp.task('default', ['start']);

gulp.task('build', ['production']);

gulp.task('clearCache', ['clear']);