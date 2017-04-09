import mongoose from 'mongoose'
import { listFixtures, loadFixture, readFixturesForModel } from './fixtures-core'
import { sequencePromises } from './utils'
import Mongoose from './setup'

/**
 * Reads all .json files from /fixtures
 * Each file must comply with the convention:
 *   * the name must be the name of the model, ex: User.json (only one file per model)
 *   * the content should be an array of json objects.
 */
export async function run(options) {
  const checkParam = name => { if (!options[name]) throw new Error(`No "${name}" parameter provided !`) }

  checkParam('mongoUrl')
  // TODO: const folder = isStaging() ? '/production' : '/dev'
  checkParam('folder')
  checkParam('modelsFile')

  await Mongoose.setup(options.mongoUrl)
  require('modelsFile')

  if (options.dropDB) {
    console.log('Dropping database !')
    mongoose.connection.dropDatabase();
  }

  if (options.model) {
    console.log(`Dropping collection ${options.model}!`)
    mongoose.model(options.model).remove({})
  }

  const files = await (options.model ? readFixturesForModel(options.model) : listFixtures())

  console.log('USING FIXTURES', files.join(','))

  console.log(`Loading [${files.length}] Fixtures ...`)

  await sequencePromises(files.map(file => () => loadFixture(file) ))

  console.log('All fixtures loaded !')

  await mongooseFeature.teardown()
}