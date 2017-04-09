import { readFixture, saveFixture, saveFile } from './fixtures-core'
import config from '../config'
import mongooseFeat from '../src/config/mongoose'

/// **
//  Script to take already generated Device fixtures and add to them a property based on the segment they belong to
//
//  NOTES:
//    - run with NODE_ENV=dev
//    - it may require to use fs.writeFileSync instead of fs.writeFile
/// **

// Configure db
mongooseFeat.setup({ config })

import mongoose from 'mongoose'

// Models
const Segment = mongoose.model('Segment')

try {
  // Read Device.json and Device-*.json
  const files = [
    'Device',
    'Device-1',
    'Device-2',
    'Device-3',
    'Device-4',
    'Device-5',
    'Device-6',
    'Device-7',
    'Device-8'
  ]

  Promise.all(files.map(async (fileName) => {
    const newFileArray = []
    await Promise.all(readFixture(fileName).map(async (device) => {
      // For each file, for each device (each file has 20 devices)
      // Search on mongo instance for a Segment containing that id
      const segment = await Segment.findOne({ 'devices.nesId': device.nesId })

      // accumulate an array with the modified Device (add segmentNesId to Device)
      const gatewayNesId = segment.gatewayNesId
      const toInsert = { ...device, gatewayNesId }
      console.log('toInsert', toInsert)
      newFileArray.push(toInsert)
    }))
    // when finishes reading a file, write the accum array to a new file.
    console.log('array size', newFileArray.length)
    saveFile(`__${fileName}`, newFileArray)
    
    // keep going with all files.
  }))

} finally {
  // close db please
  mongooseFeat.teardown()
}
