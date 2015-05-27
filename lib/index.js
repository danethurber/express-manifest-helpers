import fs from 'fs'
import path from 'path'
import assign from 'lodash/object/assign'

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

export function trimTag(str){
  return str
    // replace double spaces not inside quotes
    .replace(/ {2,}(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/, ' ')
    // replace extra space in opening tags
    .replace(/ >/, '>')
    // replace extra space in self closing tags
    .replace(/  \/>/, ' />')
}

export function lookup(source) {
  manifest = loadManifest()

  if(manifest[source])
    return path.join(options.prependPath, manifest[source])
  else
    return ''
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
  return trimTag(`<link rel="${lookup(source)}" ${mapAttrs(attrs)} />`)
}

export default function(opts) {
  let defaults = {
    cache: true,
    prependPath: ''
  }

  manifest = null
  assign(options, defaults, opts)

  return function(req, res, next) {
    res.locals.assetPath = assetPath
    res.locals.imageTag = imageTag
    res.locals.javascriptTag = javascriptTag
    res.locals.stylesheetTag = stylesheetTag
    next()
  }
}
