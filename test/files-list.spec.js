import fs from 'fs'

import {expect} from 'chai'
import sinon from 'sinon'

import manifestHelpers from '../src'
import {
  getSources,
  getStylesheetSources,
  getStylesheets,
  getJavascriptSources,
  getJavascripts,
  getImageSources,
  getImages
} from '../src'

describe('#getListOfFiles', function(){
  const manifestPath = 'some/path/manifest.json'
  const javascripts = {
    'file.js': 'file.5678.min.js',
    'file2.js': 'file.1234.min.js',
  };
  const stylesheets = {
    'file3.css': 'file.2345.min.css'
  }
  const images = {
    'test.jpg': 'test.1234.jpg',
    'test.jpeg': 'test.1234.jpeg',
    'test.gif': 'test.1234.gif',
    'test.png': 'test.1234.png',
    'test.bmp': 'test.1234.bmp',
    'test.webp': 'test.1234.webp',
  }
  const manifest = Object.assign({}, javascripts, stylesheets, images);

  beforeEach(function(){
    sinon.stub(fs, 'readFileSync')
      .returns(JSON.stringify(manifest))
    manifestHelpers({ manifestPath })
  })

  afterEach(function(){
    fs.readFileSync.restore()
  })

  it('exists', function(){
    expect(getStylesheets).to.exist
    expect(getJavascripts).to.exist
    expect(getImages).to.exist
    expect(getSources).to.exist
  })

  it('returns a list of all source files', function(){
    let sources = getSources()
    expect(sources).to.deep.equal(Object.keys(manifest));
  })

  it('returns a list of all javascript files', function(){
    let jsFiles = getJavascripts();
    let jsSources = getJavascriptSources()
    expect(jsFiles).to.deep.equal(Object.values(javascripts));
    expect(jsSources).to.deep.equal(Object.keys(javascripts));
  })

  it('returns a list of all css files', function(){
    let cssFiles = getStylesheets();
    let cssSources = getStylesheetSources()
    expect(cssFiles).to.deep.equal(Object.values(stylesheets));
    expect(cssSources).to.deep.equal(Object.keys(stylesheets));
  })

  it('returns a list of all image files', function(){
    let imgFiles = getImages();
    let imgSources = getImageSources()
    expect(imgFiles).to.deep.equal(Object.values(images));
    expect(imgSources).to.deep.equal(Object.keys(images));
  })
})
