import { expect } from 'chai'
import mongoose from 'mongoose'
import mockgoose from 'mockgoose'

import { run } from '../../src/fixtures-run'

describe.only('Fixtures', () => {

  beforeEach(async() => {
    await mockgoose(mongoose)
  })

  afterEach(async() => {
    if (mongoose.connection && mongoose.connection.db) mockgoose.reset()
  })

  describe('required parameters', () => {
    async function expectRequiredParameter(options, errorMessage) {
      try { await run(options) ; throw new Error('parameters check should have failed !') }
      catch (err) { /* console.log(err.stack); */ expect(err.message).to.be.equal(errorMessage) }
    }

    it('should check required mongoUrl', async () => {
      await expectRequiredParameter({}, 'No "mongoUrl" parameter provided !')
    })

    it('should check required folder', async () => {
      await expectRequiredParameter({ mongoUrl: 'mongodb://localhost/mongoose-json-fixtures-test' }, 'No "folder" parameter provided !')
    })

    it('should check required modelsFile', async () => {
      await expectRequiredParameter({ 
        mongoUrl: 'mongodb://localhost/mongoose-json-fixtures-test',
        folder: `${__dirname}/sample-fixtures`
      }, 'No "modelsFile" parameter provided !')
    })

  })

  it('should do nothing if there are no fixtures', async () => {
    await run({ 
      mongoUrl: 'mongodb://localhost/mongoose-json-fixtures-test',
      folder: `${__dirname}/empty-fixtures`,
      modelsFile: `${__dirname}/sample-models.js`
    })
  })

  it('should run a simple User fixture', async () => {
    await run({ 
      mongoUrl: 'mongodb://localhost/mongoose-json-fixtures-test',
      folder: `${__dirname}/sample-fixtures`,
      modelsFile: `${__dirname}/sample-models.js`
    }, false)

    const User = mongoose.model('User')
    const nrOfUsers = await User.count({})
    expect(nrOfUsers).to.be.equal(2)
  })

  it('should support running only a model specific fixtures')
  it('should support multiple files for a model')

})