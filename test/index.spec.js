import fs from 'fs'

import {expect} from 'chai'
import sinon from 'sinon'

import manifestHelpers from '../lib'
import { lookup, assetPath } from '../lib'

describe('manifestHelpers', function() {
  it('exists', function() {
    expect(manifestHelpers).to.exist
  })

  it('returns a function', function(){
    expect(manifestHelpers()).to.be.a('function')
  })

  describe('as middleware', function(){
    let res, next, middleware

    beforeEach(function(){
      res = { locals: {} }
      next = sinon.spy()
      manifestHelpers()({}, res, next)
    })

    it('calls next function', function(){
      expect(next.called).to.be.true
    })

    it('adds view helpers to locals', function(){
      expect(res.locals.assetPath).to.exist
    })
  })
})

describe('#lookup', function(){
  const manifestPath = 'some/path/manifest.json'
  const manifest = { 'app.js': 'app.1234.min.js' }

  beforeEach(function(){
    sinon.stub(fs, 'readFileSync')
      .returns(JSON.stringify(manifest))
  })

  afterEach(function(){
    fs.readFileSync.restore()
  })

  describe('loading the manifest file', function(){
    beforeEach(function(){
      manifestHelpers({ manifestPath })
    })

    it('correctly loads the manifest file', function(){
      lookup()

      expect(fs.readFileSync.called).to.be.true
      expect(fs.readFileSync.calledWith(manifestPath, 'utf8')).to.be.true
    })

    it('throws error if manifest could not be read', function(){
      fs.readFileSync.throws('error')
      expect(function(){
        lookup()
      }).to.throw('Asset Manifest could not be loaded.')
    })
  })

  describe('path lookup', function(){
    beforeEach(function(){
      manifestHelpers({ manifestPath })
    })

    it('returns the right path to source file', function(){
      let source = 'app.js'
      let result = lookup(source)

      expect(result).to.equal(manifest[source])
    })

    it('handles malformed input', function(){
      expect(lookup('missing-file.js')).to.be.a('null')
      expect(lookup(123)).to.be.a('null')
      expect(lookup()).to.be.a('null')
      expect(lookup(undefined)).to.be.a('null')
      expect(lookup(null)).to.be.a('null')
    })
  })

  describe('caching', function(){
    it('reads the manifest from cache', function(){
      manifestHelpers({manifestPath})

      lookup()
      lookup()
      lookup()

      expect(fs.readFileSync.calledOnce).to.be.true
    })

    it('allows the cache to be disabled', function(){
      manifestHelpers({
        manifestPath,
        cache: false
      })

      lookup()
      lookup()
      lookup()

      expect(fs.readFileSync.calledThrice).to.be.true
    })
  })

  describe('prependPath', function(){
    it('optionally will prepend a path to the returned string', function(){
      let source = 'app.js'
      let prependPath = 'some/path/'
      manifestHelpers({ manifestPath, prependPath })

      let result = lookup(source)

      expect(result).to.equal(prependPath + manifest[source])
    })
  })
})

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
    expect(assetPath('missing-file.js')).to.be.a('null')
    expect(assetPath(123)).to.be.a('null')
    expect(assetPath()).to.be.a('null')
    expect(assetPath(undefined)).to.be.a('null')
    expect(assetPath(null)).to.be.a('null')
  })

})
