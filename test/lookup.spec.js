import fs from 'fs'

import {expect} from 'chai'
import sinon from 'sinon'

import manifestHelpers from '../src'
import {lookup} from '../src'

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
      expect(lookup('missing-file.js')).to.equal('')
      expect(lookup(123)).to.equal('')
      expect(lookup()).to.equal('')
      expect(lookup(undefined)).to.equal('')
      expect(lookup(null)).to.equal('')
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

    it('properly resolves urls', function(){
      let source = 'app.js'
      let prependPath = '//some/path/'
      manifestHelpers({ manifestPath, prependPath })

      let result = lookup(source)

      expect(result).to.equal('//some/path/' + manifest[source])
    })
  })
})
