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

export function imageTag(source) {
  return `<img src="${lookup(source)}" />`
}

export function javascriptTag(source) {
  return `<script src="${lookup(source)}"></script>`
}

export function stylesheetTag(source) {
  return `<link rel="${lookup(source)}" />`
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
