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
      try { await run(options) }
      catch (err) { expect(err.message).to.be.equal(errorMessage) }
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

})