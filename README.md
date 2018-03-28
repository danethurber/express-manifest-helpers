# Express Manifest Helpers

[![Circle CI](https://circleci.com/gh/danethurber/express-manifest-helpers.svg?style=shield)](https://circleci.com/gh/danethurber/express-manifest-helpers)

Use as express middleware to provide view helpers methods

## Install

```sh
$ npm install express-manifest-helpers
```

## Example Usage

```js
import express from 'express'
import manifestHelpers from 'express-manifest-helpers'

var app = express()

app.use(manifestHelpers({
  manifestPath: '/path/to/manifest.json'
}))

```

```jade
doctype html
html(lang="en")
  head
    title Page Title
    != stylesheetTag('style.css')

  body
    != imageTag('logo.png')

    != javascriptTag('app.js')

```

Helpers can also output html attrs

```jade
!= imageTag('logo.png', { width: 120, height: 120 })
// <img src="logo.png" width="120" height="120" />
```

Disable the cache for development

```js
app.use(manifestHelpers({
  manifestPath: '/path/to/manifest.json',
  cache: process.env.NODE_ENV === 'production'
}))

```

Prepend a path to the asset urls

```js
app.use(manifestHelpers({
  manifestPath: '/path/to/manifest.json',
  prependPath: '//cdn.example/assets'
}))

```

## Helpers

`assetPath(source)` - returns the path to the provided source

`imageTag(source, attrs)` - return a img tag for the source provided

`javascriptTag(source, attrs)` - return a script tag for the source provided

`stylesheetTag(source, attrs)` - return a link tag for the source provided

`getManifest()` - returns the original manifest file for convenience

`getSources()` - returns a list of sources from the manifest

`getStylesheetSources()` - returns a list of all sources ending with `.css`

`getStylesheets()` - returns a list of all stylesheets and their resolved paths

`getJavascriptSources()` - returns a list of all sources ending with `.js`

`getJavascripts()` - returns a list of all javascripts and their resolved paths

`getImageSources()` - returns a list of all sources ending with `.jpg`, `.jpeg`, `.gif`, `.png`, `.bmp` or `.webp`, 

`getImages()` - returns a list of all images and their resolved paths
