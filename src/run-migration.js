import mongooseFeature from '../src/config/mongoose'
import { migrationsFolders, processMigrationFolder } from './migrations-core'

import minimist from 'minimist'

/*
 * Run with args like this
 *
 * npm run fixtures-migrations -- --migration=03-normalize-segments
 */

const args = minimist(process.argv.slice(2))
console.log('Running with args', args)
const migration = args.migration

async function run() {
  const app = {
    config : require('../config.js').default
  }

  await mongooseFeature.setup(app)

  const migrations = await migrationsFolders()

  await Promise.all(migrations.map(folder => processMigrationFolder(folder, migration)))

  await mongooseFeature.teardown()
}

run().catch(err => {
  console.error(err.stack)
  console.error(err)
})


