import fs from 'fs'

import {expect} from 'chai'
import sinon from 'sinon'

import manifestHelpers from '../src'
import { assetPath } from '../src'

describe('#assetPath', function(){
  const manifestPath = 'some/path/manifest.json'
  const manifest = { 'file.js': 'file.5678.min.js' }

  beforeEach(function(){
    sinon.stub(fs, 'readFileSync')
      .returns(JSON.stringify(manifest))
    manifestHelpers({ manifestPath })
  })

  afterEach(function(){
    fs.readFileSync.restore()
  })

  it('exists', function(){
    expect(assetPath).to.exist
  })

  it('returns the right path to source file', function(){
    let source = 'file.js'
    let result = assetPath(source)

    expect(result).to.equal(manifest[source])
  })

  it('handles malformed input', function(){
    expect(assetPath('missing-file.js')).to.equal('')
    expect(assetPath(123)).to.equal('')
    expect(assetPath()).to.equal('')
    expect(assetPath(undefined)).to.equal('')
    expect(assetPath(null)).to.equal('')
  })
})
