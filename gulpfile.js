const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const newer = require("gulp-newer");
const cleanCss = require("gulp-clean-css");
const fontmin = require("gulp-fontmin");
const gcmq = require("gulp-group-css-media-queries");
const beautify = require("gulp-beautify");
const htmlbeautify = require("gulp-html-beautify");
const iconfont = require('gulp-iconfont');

const runTimestamp = Math.round(Date.now()/1000);

const paths = {
  scss: "src/scss/main.scss",
  html: "src/views/*.html",
  js: "src/js/**/*.js",
  vendor: "src/vendor/**/*",
  images: "src/images/**/*",
  fonts: "src/fonts/**/*",
  fontToCss: "dist/fonts/*.css",
  iconsFonts: "src/svg-icons/*.svg",
};

/**
 * Обратобка SCSS
 */
function scss() {
  return gulp
    .src(paths["scss"])
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["> 0.1%"],
        cascade: false
      })
    )
    .pipe(gcmq())
    .pipe(
      cleanCss({
        level: 2
      })
    )
    .pipe(gulp.dest("dist/css"))
    .pipe(browsersync.stream());
}

/**
 * Обработка HTML
 */
function html() {
  return (
    gulp
      .src(paths["html"])
      .pipe(
        beautify.html({
          indent_size: 4
        })
      )
      .pipe(htmlbeautify())
      .pipe(gulp.dest("dist/"))
      .pipe(browsersync.stream())
  );
}

/**
 * Обработка JavaScript
 */
function js() {
  return (
    gulp
      .src(paths["js"])
      .pipe(gulp.dest("dist/js"))
      .pipe(browsersync.stream())
  );
}

/**
 * Обработка иконочных шрифтов
 */

function iconFonts() {
    return (
        gulp
            .src(paths["iconsFonts"])
            .pipe(iconfont({
                fontName: 'iconfont',
                prependUnicode: true,
                formats: ['ttf', 'eot', 'woff'],
                timestamp: runTimestamp,
            }))
            .pipe(gulp.dest("dist/fonts/"))
            .pipe(browsersync.stream())
    );
}


/**
 * Сторонние библиотеки
 */
function vendor() {
  return gulp
    .src(paths["vendor"])
    .pipe(gulp.dest("dist/vendor"))
    .pipe(browsersync.stream());
}

/**
 * Создание файлом со шрифтами
 */
function fontToCss() {
  return gulp
    .src(paths["fontToCss"])
    .pipe(gulp.dest("src/scss/modules/fonts"))
    .pipe(browsersync.stream());
}

/**
 * Обработка изображений
 */
function images() {
  return gulp
    .src(paths["images"])
    .pipe(newer("dist/img"))
    .pipe(gulp.dest("dist/img"))
    .pipe(browsersync.stream());
}

/**
 * Создание и обработка шрифтов
 */
function ttfFontmin() {
  return gulp
    .src("src/fonts/**/*.ttf")
    .pipe(newer("dist/fonts"))
    .pipe(
      fontmin({
        fontPath: "../fonts/"
      })
    )
    .pipe(gulp.dest("dist/fonts"));
}

/**
 * Отслеживание изменений файлов
 */
function watchFiles() {
  gulp.watch("src/scss/**/*", gulp.series(scss));
  gulp.watch("src/views/**/*.html", gulp.series(html));
  gulp.watch(paths["images"], gulp.series(images));
  gulp.watch(paths["js"], gulp.series(js));
  gulp.watch(paths["vendor"], gulp.series(vendor));
  gulp.watch(paths["fontToCss"], gulp.series(fontToCss));
  gulp.watch(paths["iconsFonts"], gulp.series(iconFonts));
  gulp.watch("src/fonts/**/*.ttf", gulp.series(ttfFontmin));
}

/**
 * Синхронизация с браузером
 */
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "dist/"
    },
    port: 3000
  });
  done();
}

const watch = gulp.parallel(watchFiles, browserSync);

exports.scss = scss;
exports.html = html;
exports.images = images;
exports.watch = watch;
exports.js = js;
exports.fontToCss = fontToCss;
exports.pngSprites = vendor;
exports.ttfFontmin = ttfFontmin;
exports.iconFonts = iconFonts;
exports.build = gulp.parallel(
  scss,
  html,
  images,
  js,
  ttfFontmin,
  fontToCss,
  iconFonts
);