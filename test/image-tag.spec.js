import fs from 'fs'

import {expect} from 'chai'
import sinon from 'sinon'

import manifestHelpers from '../lib'
import { imageTag } from '../lib'

describe('#imageTag', function(){
  const manifestPath = 'some/path/manifest.json'
  const manifest = { 'image.png': 'image.5678.png' }

  beforeEach(function(){
    sinon.stub(fs, 'readFileSync')
      .returns(JSON.stringify(manifest))
    manifestHelpers({ manifestPath })
  })

  afterEach(function(){
    fs.readFileSync.restore()
  })

  it('exists', function(){
    expect(imageTag).to.exist
  })

  it('returns an image tag to the proper file', function(){
    let source = 'image.png'
    let result = imageTag(source)
    let expected = `<img src="${manifest[source]}" />`

    expect(result).to.equal(expected)
  })

  it('handles malformed input', function(){
    let expected = '<img src="" />'
    expect(imageTag('missing-file.js')).to.equal(expected)
    expect(imageTag(123)).to.equal(expected)
    expect(imageTag()).to.equal(expected)
    expect(imageTag(undefined)).to.equal(expected)
    expect(imageTag(null)).to.equal(expected)
  })
})
