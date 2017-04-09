import { expect } from 'chai'

import { applyMigrations, migrate } from '../../src/migrations-core'

describe('Migrations', () => {

  describe('applyMigrations()', () => {

    it('should apply a single migration as a function', async () => {
      const migrations = [
        (obj) => ({ ...obj, another: 'blah' })
      ]

      const migrated = await applyMigrations(migrations)({ id: '1234567890' })

      expect(migrated).to.deep.equal({
        id: '1234567890',
        another: 'blah'
      })
    })

    it('should apply a single migration as an imported module', async () => {
      const migrations = [
        require(`${__dirname}/sampleMigration.js`)
      ]

      const migrated = await applyMigrations(migrations)({ name: 'john' })

      expect(migrated).to.deep.equal({
        name: 'john',
        lastName: 'invented'
      })
    })

    it('should apply 3 migrations', async () => {
      const migrations = [
        (obj) => ({ ...obj, one: 'blah' }),
        (obj) => ({ ...obj, two: 'bleh' }),
        (obj) => ({ ...obj, three: 'blih' })
      ]

      const migrated = await applyMigrations(migrations)({ id: '1234567890' })

      expect(migrated).to.deep.equal({
        id: '1234567890',
        one: 'blah',
        two: 'bleh',
        three: 'blih'
      })
    })

    it('should apply 3 migrations IN SEQUENCE', async () => {
      const migrations = [
        (obj) => ({ ...obj, one: 'blah' }),
        (obj) => ({ ...obj, one: 'bleh' }),
        (obj) => ({ ...obj, one: 'blih' })
      ]

      const migrated = await applyMigrations(migrations)({ id: '1234567890' })

      expect(migrated).to.deep.equal({
        id: '1234567890',
        one: 'blih'
      })
    })

  })

  describe('migrate()', () => {

    it('should apply 2 migrations to 2 models', async () => {
      const migrations = [
        (obj) => ({ ...obj, one: 'blah' }),
        (obj) => ({ ...obj, two: 'bleh' })
      ]

      const models = [
        { id: '1' },
        { id: '2' }
      ]

      const migrated = await migrate(models, migrations)

      expect(migrated).to.deep.equal([
        { id: '1', one: 'blah', two: 'bleh' },
        { id: '2', one: 'blah', two: 'bleh' }
      ])
    })

    it('should support flattening to generate more than one object from the input', async () => {
      const migrations = [
        (n) => [n, n + 1 ]
      ]

      const models = [1, 10, 20]

      const migrated = await migrate(models, migrations)

      expect(migrated).to.deep.equal([
        1, 2, 10, 11, 20, 21
      ])
    })

  })

})

