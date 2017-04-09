// mongoose
import mongoose from 'mongoose'

mongoose.Promise = global.Promise

// this is to trigger model loading
// export * from '../models/all'

class MongooseFeature {
  setup(url) {
    // mongoose.set('debug', true)
    return mongoose.connect(url, {
      server: {
        socketOptions: {
          socketTimeoutMS: 30000,
          connectTimeoutMS: 30000
        }
      }
    })
  }
  teardown() {
    return mongoose.connection._closeCalled ? Promise.resolve() : mongoose.connection.close()
  }
}

export default new MongooseFeature()
