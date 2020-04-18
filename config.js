const dotenv = require('dotenv')
const fs = require('fs')

let envConfig = {}
try {
  envConfig = dotenv.parse(fs.readFileSync('.env'))
} catch (e) {
  //.env file does not exist
}

const src = 'app'
const dest = 'dist'
const assets = src + '/assets'
const languages = [
  'en', 'de'
]

const config = {
  src: src,
  dest: dest,
  assets: assets,

  environment: {
    baseUrl: envConfig.BASE_URL || "",
    env: envConfig.ENV || "prod",
    languages: envConfig.hasOwnProperty("LANGUAGES") ? envConfig.LANGUAGES.split(",") : []
  },

  js: {
    src: assets + '/js/**/*',
    dest: dest + '/js'
  },

  scss: {
    srcBuild: assets + '/scss/*.+(scss|sass)',
    srcWatch: assets + '/scss/**/*.+(scss|sass)',
    dest: dest + '/css'
  },

  njk: {
    allSrc: src + '/**/*.+(nj|njk|nunjucks)',
    pageSrc: src + '/pages/**/*.+(nj|njk|nunjucks)',
    templatesSrc: src + '/templates',
    dest: dest
  },

  app: {
    globalData: [],
    languages: languages,
    defaultLanguage: 'en',
    markdownOptions: {
      smartypants: true,
      gfm: true
    },
    templatesPath: src + '/templates',
    pageSrc: src + '/pages/**/*.njk',
    pageDest: dest,
    watch: [
      src + '/templates/**/*',
      './data/**/*.json'
    ],
    destWatch: dest + '/**/*'
  },

  browserSync: {
    host: 'localhost',
    port: envConfig.BROWSER_PORT || 3000
  },

  gettext: {
    languages: languages,
    mainSourceFolder: './',
    sources: ['./app/templates', './app/pages'],
    dataSources: ['./data']
  },

  data: {
    src: "data",
    dataList: [
      './data/global.json',
      './data/metas.json',
      './data/languages-map.json',
      './data/pages-data/index.json'
    ]
  }
}

module.exports = config
