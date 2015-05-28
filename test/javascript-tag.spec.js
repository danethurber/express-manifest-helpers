import fs from 'fs'

import {expect} from 'chai'
import sinon from 'sinon'

import manifestHelpers from '../src'
import { javascriptTag } from '../src'

describe('#javascriptTag', function(){
  const manifestPath = 'some/path/manifest.json'
  const manifest = { 'script.js': 'script.5678.js' }

  beforeEach(function(){
    sinon.stub(fs, 'readFileSync')
      .returns(JSON.stringify(manifest))
    manifestHelpers({ manifestPath })
  })

  afterEach(function(){
    fs.readFileSync.restore()
  })

  it('exists', function(){
    expect(javascriptTag).to.exist
  })

  it('returns an script tag to the proper file', function(){
    let source = 'script.js'
    let result = javascriptTag(source)
    let expected = `<script src="${manifest[source]}"></script>`

    expect(result).to.equal(expected)
  })

  it('accepts html attributes as second arg', function(){
    let source = 'script.js'
    let result = javascriptTag(source, { 'data-one': '1', 'data-two': '2' })
    let expected = `<script src="${manifest[source]}" data-one="1" data-two="2"></script>`

    expect(result).to.equal(expected)
  })

  it('handles malformed input', function(){
    let expected = '<script src=""></script>'

    expect(javascriptTag('missing-file.js')).to.equal(expected)
    expect(javascriptTag(123)).to.equal(expected)
    expect(javascriptTag()).to.equal(expected)
    expect(javascriptTag(undefined)).to.equal(expected)
    expect(javascriptTag(null)).to.equal(expected)
  })
})
