import {expect} from 'chai'
import sinon from 'sinon'

import manifestHelpers from '../src'

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
      expect(res.locals.imageTag).to.exist
      expect(res.locals.javascriptTag).to.exist
      expect(res.locals.stylesheetTag).to.exist
    })
  })
})
