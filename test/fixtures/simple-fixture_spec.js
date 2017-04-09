import { expect } from 'chai'

import { run } from '../../src/fixtures-run'

describe.only('Fixtures', () => {

  describe('required parameters', () => {

    async function expectRequiredParameter(options, errorMessage) {
      try { await run({}) }
      catch (err) { expect(err.message).to.be.equal(errorMessage) }
    }

    it('should check mongoUrl', async () => {
      await expectRequiredParameter({}, 'No "mongoUrl" parameter provided !')
    })

  })

})