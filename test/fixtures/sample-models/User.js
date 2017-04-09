import mongoose from 'mongoose'

const Schema = mongoose.Schema

const schema = Schema({
  created_at: { type: Date, default: Date.now },
  name: { type: String, unique: true, required: true },
  password: { type: String, required: true }
})

const User = mongoose.model('User', schema)
export default User