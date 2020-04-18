const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const cssmin = require('gulp-cssmin')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const reload = browserSync.reload
const plugins = require('gulp-load-plugins')
const fs = require('fs')
const gettextParser = require('gettext-parser')
const htmlmin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const clean = require('gulp-clean')

const plumber = require('./gulp-modules/plumber')
const gettextHelper = new (require('./gulp-modules/gettext-helper'))()
const nunjuckTemplate = require('./gulp-modules/nunjucks-template')
const config = require('./config')

const $ = plugins()

const scss = () => {
  return gulp.src(config.scss.srcBuild)
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({}))
    .pipe(cssmin())
    .pipe(gulp.dest(config.scss.dest))
    .pipe(reload({stream: true}))
}

const copy_non_js = () => {
  return gulp.src(['!' + config.js.src + '.js', config.js.src])
    .pipe(gulp.dest(config.js.dest))
}

const js = gulp.series(copy_non_js, () => {
  return gulp.src(config.js.src + '.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .on('error', () => {
      console.error("Error with babel")
      this.emit('end')
    })
    .pipe(uglify())
    // .pipe(minify({
    //   ext: {min: '.js'},
    //   noSource: true
    // }))
    .pipe(gulp.dest(config.js.dest))
    .pipe(reload({stream: true}))
})

const copyAssets = () => {
  return gulp.src([config.assets + '/**/*', '!' + config.scss.srcWatch, '!' + config.js.src, '!' + config.assets + '/vendor'])
    .pipe(gulp.dest(config.dest))
    .pipe(reload({stream: true}))
}

const copyVendor = () => {
  return gulp.src('node_modules/@bower_components/**/*')
    .pipe(gulp.dest(config.dest + '/vendor'))
}

const clean_dist = () => {
  return gulp.src(config.dest, {read: false, allowEmpty: true})
    .pipe(clean())
}

const prepareGettextFiles = () => {
  let templateFile = fs.readFileSync('./locales/.language.po.template', 'utf8')

  // Add a blank .po file for a language if it doesn't exist already.
  for (let i in config.gettext.languages) {
    let language = config.gettext.languages[i]

    if (!fs.existsSync('./locales/' + language + '.po')) {
      fs.writeFileSync('./locales/' + language + '.po', templateFile)
    }
  }
}

// Extract gettext strings from Nunjucks template files and .json data files.
const extractGettext = () => {
  // Extract all gettext strings for every supported language.
  config.gettext.languages.forEach(function (language) {
    // Load existing translations from .po file.
    let languageFile = fs.readFileSync('./locales/' + language + '.po')
    let oldTranslations = gettextParser.po.parse(languageFile)
    oldTranslations.charset = 'utf-8'

    // First extract string from templates then from data files.
    gettextHelper.extract(config.gettext.sources, 'templateExtraction', function (newTemplateTranslations) {

      // Run extraction for data files.
      gettextHelper.extract(config.gettext.dataSources, 'dataExtraction', function (newDataTranslations) {
        // Merge template and data strings.
        let mergedTranslations = gettextHelper.merge(newDataTranslations, newTemplateTranslations)
        // Merge new strings with strings loaded from the .po file.
        let updatedTranslations = gettextHelper.merge(mergedTranslations, oldTranslations, 'cleanup')

        // Write updated .po file.
        fs.writeFileSync('./locales/' + language + '.po', gettextParser.po.compile(updatedTranslations))
      })
    })
  })
}

const renderPages = (done) => {
  function renderTemplates(language) {
    return () => gulp.src(config.app.pageSrc)
      .pipe(plumber())
      .pipe($.frontMatter({
        property: 'frontmatter',
        remove: true
      }))
      .pipe(nunjuckTemplate({data: config.data.dataList}, language))
      .pipe($.prettyUrl())
      // .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(config.dest + (language !== config.app.defaultLanguage ? ('/' + language) : '')))
      .pipe(reload({stream: true}))
  }

  let languagesToRender = [config.app.defaultLanguage]

  if (config.environment.env === 'prod' || config.environment.env === 'stag')
    languagesToRender = config.app.languages
  else if (config.environment.languages.length > 0)
    languagesToRender = config.environment.languages

  const tasks = languagesToRender.map(l => {
    const task = renderTemplates(l)
    task.displayName = `renderPage_${l}`
    return task
  })

  return gulp.series(...tasks, (seriesDone) => {
    seriesDone()
    done()
  })()
}

const generatePoFiles = gulp.series((done) => {
  if (config.environment.env === 'dev') {
    prepareGettextFiles()
    extractGettext()
  }
  done()
})

const generateSite = gulp.series(generatePoFiles, renderPages)
const buildParallel = gulp.parallel(js, scss, copyAssets, copyVendor, generateSite)
const build = gulp.series(clean_dist, buildParallel)

const watch = gulp.series(build, (done) => {
  browserSync.init({
    server: config.dest,
    host: config.browserSync.host,
    port: config.browserSync.port,
    open: false
  })
  gulp.watch(config.scss.srcWatch, scss)
  gulp.watch(config.js.src, js)
  gulp.watch(config.njk.allSrc, renderPages)
  gulp.watch(config.data.src + '**/*', renderPages)
  gulp.watch([
    config.assets + "/**/*",
    "!" + config.assets + "/{js,scss}/**/*"
  ], copyAssets)
  done()
})

exports.build = build
exports.watch = watch
