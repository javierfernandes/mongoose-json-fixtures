import fs from 'mz/fs'
import { readFixturesForModel, readFixture, saveFixture, saveFile } from './fixtures-core'
import { flatten, splitInChunks, sequencePromises } from './utils'

const MIGRATIONS_FOLDER = '/migrations'
export const migrationsFolders = () => fs.readdir(__dirname + MIGRATIONS_FOLDER)

async function listMigrations(folderName) {
  return fs.readdir(`${__dirname + MIGRATIONS_FOLDER}/${folderName}`)
}

async function importMigrationsFunctions(folderName, migrationFile) {
  const migrations = (await listMigrations(folderName))
      .filter(file => !migrationFile || file === migrationFile)
  console.log('Running migrations', migrations)
  return migrations.map(file => require(`${__dirname + MIGRATIONS_FOLDER}/${folderName}/${file}`))
}

export async function processMigrationFolder(folderName, migrationFile) {
  const migrationsFn = await importMigrationsFunctions(folderName, migrationFile)

  if (migrationsFn.length > 0) {
    const fixtures = await readFixturesForModel(folderName)
    console.log(`Read ${fixtures.length} fixtures`, fixtures.join(','));
    await sequencePromises(fixtures.map(file => () => migrateFixture(file, migrationsFn, folderName)))
    // await Promise.all(fixtures.map(file => migrateFixture(file, migrationsFn, folderName)))
  }
}
async function migrateFixture(fixtureFile, migrationsFn, folderName) {
  const fixture = await readFixture(fixtureFile)
  console.log(`\t>> Running [${migrationsFn.length}] migrations on [${fixture.length}] objects for ${fixtureFile}`)

  const migrated = await migrate(fixture, migrationsFn)

  // const splitted = splitInChunks(migrated, 20)
  // return Promise.all(saveChunk(splitted, fixtureFile, folderName))
  return saveFile(fixtureFile, migrated)
}

function saveChunk(chunks, fixtureFile, folderName) {
  let i = 0;
  return chunks.map(async objects => {
    const migrated = await applyGlobalMigrations(folderName, objects)
    const targetFileName = i == 0 ? fixtureFile : `${fixtureFile.slice(0, -5)}-${i}.json`
    console.log('Saving part', i, 'on file', targetFileName)
    i++
    return saveFile(targetFileName, migrated)
  })
}

async function importGlobalMigrationFunctions(folderName) {
  // const migrations = (await listMigrations(folderName))
  //     .filter(file => file.indexOf('-global-') > -1)
  // return migrations.map(file => require(`${__dirname + MIGRATIONS_FOLDER}/${folderName}/${file}`).default)

  // disabling this now, we add support to only run globals if you specified it as the name of the -- param
  return []
}

async function applyGlobalMigrations(folderName, migrated) {
  const globalMigrations = await importGlobalMigrationFunctions(folderName)
  return globalMigrations.reduce((acc, fn) => fn(acc), migrated)
}

export async function migrate(fixture, migrationsFn) {
  return flatten(await Promise.all(fixture.map(applyMigrations(migrationsFn))))
}

export const applyMigrations = (migrationsFn) => (model) => {
  return migrationsFn.reduce((acc, migration) => {
    return acc.then(newModel => applyMigration(newModel, migration))
  }, Promise.resolve(model))
}

async function applyMigration(model, migration) {
  const fn = typeof migration === 'function' ? migration : migration.default
  try {
    return await fn(model)
  } catch(err) {
    console.error('Error while applying migration', err)
    throw err
  }
}
