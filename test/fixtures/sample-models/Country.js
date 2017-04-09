import mongoose from 'mongoose'

const Schema = mongoose.Schema

const schema = Schema({
  name: { type: String, unique: true, required: true },
})

const User = mongoose.model('Country', schema)
export default User