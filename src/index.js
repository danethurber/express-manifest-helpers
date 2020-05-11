import fs from 'fs'

var manifest
var options = {}

function loadManifest() {
  if(manifest && options.cache)
    return manifest

  try {
    return JSON.parse(fs.readFileSync(options.manifestPath, 'utf8'))
  } catch(err) {
    throw new Error('Asset Manifest could not be loaded.')
  }
}

function mapAttrs(attrs) {
  return Object.keys(attrs).map(key => `${key}="${attrs[key]}"` ).join(' ')
}

export function lookup(source) {
  manifest = loadManifest()

  if(manifest[source])
    return options.prependPath + manifest[source]
  else
    return ''
}

export function trimTag(str){
  return str
    // replace double spaces not inside quotes
    .replace(/ {2,}(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/, ' ')
    // replace extra space in opening tags
    .replace(/ >/, '>')
    // replace extra space in self closing tags
    .replace(/  \/>/, ' />')
}

export function getManifest() {
  return manifest || loadManifest()
}

export function getSources() {
  manifest = manifest || loadManifest();
  return Object.keys(manifest);
}

export function getStylesheetSources() {
  return getSources().filter((file) => file.match(/\.css$/));
}

export function getStylesheets() {
  return getStylesheetSources().map((source) => lookup(source));
}

export function getJavascriptSources() {
  return getSources().filter((file) => file.match(/\.js$/));
}

export function getJavascripts() {
  return getJavascriptSources().map((source) => lookup(source));
}

export function getImageSources() {
  return getSources().filter((file) => file.match(/\.(png|jpe?g|gif|webp|bmp)$/));
}

export function getImages() {
  return getImageSources().map((source) => lookup(source));
}

export function assetPath(source) {
  return lookup(source)
}

export function imageTag(source, attrs={}) {
  return trimTag(`<img src="${lookup(source)}" ${mapAttrs(attrs)} />`)
}

export function javascriptTag(source, attrs={}) {
  return trimTag(`<script src="${lookup(source)}" ${mapAttrs(attrs)}></script>`)
}

export function stylesheetTag(source, attrs={}) {
  return trimTag(`<link rel="stylesheet" href="${lookup(source)}" ${mapAttrs(attrs)} />`)
}

export default function(opts) {
  let defaults = {
    cache: true,
    prependPath: ''
  }

  manifest = null
  Object.assign(options, defaults, opts)

  return function(req, res, next) {
    res.locals.getSources = getSources
    res.locals.getStylesheetSources = getStylesheetSources
    res.locals.getStylesheets = getStylesheets
    res.locals.getJavascriptSources = getJavascriptSources
    res.locals.getJavascripts = getJavascripts
    res.locals.getImageSources = getImageSources
    res.locals.getImages = getImages
    res.locals.getManifest = getManifest
    res.locals.assetPath = assetPath
    res.locals.imageTag = imageTag
    res.locals.javascriptTag = javascriptTag
    res.locals.stylesheetTag = stylesheetTag
    next()
  }
}
