import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessiontoken: { type: String, select: false }
  }
})

export const UserModel = mongoose.model('User', UserSchema)

export const getUsers = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({ email })
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
  'authentication.sessiontoken': sessionToken
})
export const getUserById = (id: string) => UserModel.findById(id)
export const createUser = async (values: Record<string, any>) => await new UserModel(values)
  .save().then((user) => user.toObject())
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id })
export const editUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)
export const deleteAllUsers = async () => {
  try {
    const result = await UserModel.deleteMany({})
    console.log(`Deleted ${result.deletedCount} user(s)`)
    return result
  } catch (error) {
    console.error('Error deleting users:', error)
    throw error
  }
}
