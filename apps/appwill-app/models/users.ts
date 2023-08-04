import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Please provide a user name for this user.'],
    maxlength: [60, 'userName cannot be more than 60 characters'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password name for this user.'],
    maxlength: [60, 'password cannot be more than 60 characters'],
  },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
