import fs from 'fs'

import {expect} from 'chai'
import sinon from 'sinon'

import manifestHelpers from '../src'
import { stylesheetTag } from '../src'

describe('#stylesheetTag', function(){
  const manifestPath = 'some/path/manifest.json'
  const manifest = { 'style.css': 'style.5678.css' }

  beforeEach(function(){
    sinon.stub(fs, 'readFileSync')
      .returns(JSON.stringify(manifest))
    manifestHelpers({ manifestPath })
  })

  afterEach(function(){
    fs.readFileSync.restore()
  })

  it('exists', function(){
    expect(stylesheetTag).to.exist
  })

  it('returns an link tag to the proper file', function(){
    let source = 'style.css'
    let result = stylesheetTag(source)
    let expected = `<link rel="stylesheet" href="${manifest[source]}" />`

    expect(result).to.equal(expected)
  })

  it('accepts html attributes as second arg', function(){
    let source = 'style.css'
    let result = stylesheetTag(source, { 'data-one': '1', 'data-two': '2' })
    let expected = `<link rel="stylesheet" href="${manifest[source]}" data-one="1" data-two="2" />`

    expect(result).to.equal(expected)
  })

  it('handles malformed input', function(){
    let expected = '<link rel="stylesheet" href="" />'

    expect(stylesheetTag('missing-file.js')).to.equal(expected)
    expect(stylesheetTag(123)).to.equal(expected)
    expect(stylesheetTag()).to.equal(expected)
    expect(stylesheetTag(undefined)).to.equal(expected)
    expect(stylesheetTag(null)).to.equal(expected)
  })
})
