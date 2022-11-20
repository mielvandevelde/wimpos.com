const { dest, series, src, watch } = require("gulp");

const autoprefixer = require("autoprefixer");
const babel = require("gulp-babel");
const combineMediaquery = require("postcss-combine-media-query");
const cssnano = require("cssnano");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const inline = require("gulp-inline");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass");
const sitemap = require("gulp-sitemap");
const uglify = require("gulp-uglify");
const uncss = require("postcss-uncss");

sass.compiler = require("node-sass");

const path = {
  css: "www/css/",
  html: "www/",
  img: "www/img/",
  js: "www/js/",
  scss: "_sass/*.scss",
};

function scss() {
  return src(path.scss).pipe(sass().on("error", sass.logError)).pipe(dest("css"));
}

function html() {
  return src(`${path.html}**/*.html`)
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      })
    )
    .pipe(dest(path.html));
}

function css() {
  return src(`${path.css}*.css`)
    .pipe(
      postcss([
        autoprefixer(),
        combineMediaquery(),
        uncss({
          html: [`${path.html}**/*.html`],
          htmlroot: path.html,
        }),
        cssnano(),
      ])
    )
    .pipe(dest(path.css));
}

function js() {
  return src(`${path.js}*.js`).pipe(babel()).pipe(uglify()).pipe(dest(path.js));
}

function img() {
  return src(`${path.img}*.*`).pipe(imagemin()).pipe(dest(path.img));
}

function inlineSources() {
  return src(`${path.html}**/*.html`)
    .pipe(
      inline({
        base: path.html,
        disabledTypes: ["img"],
        ignore: [
          "https://fonts.googleapis.com/css?family=Cardo:400,400i,700|Oswald:700&display=swap",
          "https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js",
        ],
      })
    )
    .pipe(dest(path.html));
}

function deleteSources() {
  return del([path.css, path.js], { force: true });
}

function sitemapXml() {
  return src(`${path.html}**/*.html`, {
    read: false,
  })
    .pipe(
      sitemap({
        siteUrl: "http://wimpos.com/",
        lastmod: false,
      })
    )
    .pipe(dest(path.html));
}

watch(path.scss, scss);

exports.default = scss;
exports.build = series(css, js, img, inlineSources, deleteSources, html, sitemapXml);
