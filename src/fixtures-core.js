import mongoose from 'mongoose'
import fs from 'mz/fs'
import NestedError from 'nested-error-stacks'
import { isStaging } from './environment'
import { startsWith } from './utils'

const FIXTURES_FOLDER = '/../fixtures'

export const listFixtures = async (baseFolder) => {
  const files = await fs.readdir(baseFolder)
  return files.filter(isJsonFile)
}

const isFixtureFileForModel = (fileName, model) => (startsWith(fileName, `${model}-`) || startsWith(fileName, `${model}.json`))

const isJsonFile = fileName => fileName.slice(-5) === '.json';

export const loadFixtureForModel = (fixture, modelName) => {
  console.log(`\t>> Saving [${fixture.length}] ${modelName}`)
  const model = mongoose.model(modelName)

  if (modelName === 'User') {
    return Promise.all(fixture.map(f => model.create(f)))
  }
  return model.insertMany(fixture)
}

/**
 * support Model.json or Model-01.json, Model-blah.json, etc.
 * Anything following "-" will be ignored
 * @param file
 * @returns {*}
 */
const modelNameFromFile = (file) => {
  const fileName = file.slice(0, -5)
  if (fileName.indexOf('-') > 0) {
    return fileName.slice(0, fileName.indexOf('-'))
  }
  return fileName
}

export const readFixturesForModel = async (folder, model) => {
  const files = await listFixtures(folder)
  return files.filter(fileName =>
    isFixtureFileForModel(fileName, model)
    && isJsonFile(fileName)
  )
}

export const readFixture = (folder, file) => require(`${folder}/${file}`)

export const loadFixture = (folder, file) => loadFixtureForModel(readFixture(folder, file), modelNameFromFile(file))

export const saveFixture = (file, fixtures) => {
  const modelName = file.slice(0, -5)  // .json
  console.log(`\t>> Saving ${file} with [${fixtures.length}] ${modelName}`)

  return fs.writeFile(`${fixturesFolder()}/${modelName}.json`, JSON.stringify(fixtures, null, 2))
}

export const saveFile = (file, fixtures) => {
  console.log(`\t>> Saving ${file} with [${fixtures.length}]`)
  // I had to use writeFileSync when generating DeviceDatapoints because it was filling fast my Heap Memory
  return fs.writeFile(`${fixturesFolder()}/${file}`, JSON.stringify(fixtures, null, 2))
}