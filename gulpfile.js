var gulp = require('gulp');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var base64 = require('gulp-base64');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

gulp.task('css',['images'],function() {
  gulp.src(['src/css/*.less', '!src/css/_*.less'])
     .pipe(less())
  	 .pipe(base64({
  		extensions: ['png', /\.jpg#datauri$/i],
  		exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
  		maxImageSize: 800*1024,
  		debug: true
  	}))
    .pipe(concat('style.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({	
      stream: true
    }));
});


gulp.task('images',function(){
	gulp.src('./src/images/*')
	 .pipe(gulp.dest('dist/images'))
});

gulp.task('js', function() {
  gulp.src('src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('html', function() {
  gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('md5',function(){
    gulp.src('dist/css/*.css')
      .pipe(rev())
      .pipe(gulp.dest('dist/css/'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('dist/config'))
})

gulp.task('top',function(){
    gulp.src(['./dist/config/*.json', './dist/*.html'])
      .pipe(revCollector())
      .pipe(gulp.dest('./dist/'))
})



gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: ['dist']										
    },
  }, function(err, bs) {
    console.log(bs.options.getIn(["urls", "local"]));	
  });

  gulp.watch('src/*.html',['html']);
  gulp.watch('src/css/*.less',['css']);
  gulp.watch('src/js/*.js',['js']);

});