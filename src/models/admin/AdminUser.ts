import mongoose from "mongoose";
import { v4 } from "uuid";
import bcrypt from "bcrypt";


const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  publicId: {
    type: String,
    default: v4(),
  },
}).pre('save', async function (next) {
  // Check if the password has been modified
  if (!this.isModified('password')) {
    return next();
  }

  // Hash and salt the password
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password!, salt);

  // Call the next middleware function
  next();
});
AdminUserSchema.methods.comparePassword = async function (adminPassword: String) {
  return await bcrypt.compare(adminPassword.valueOf(), this.password);
};

export default mongoose.model("AdminUser", AdminUserSchema)