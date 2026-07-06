import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const developerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    apiKeyPrefix: {
      type: String,
      unique: true,
    },
    apiKeyHash: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

developerSchema.pre('save', async function () {
  if (!this.isModified('password')) 
    return;

  this.password = await bcrypt.hash(this.password, 12);
});

developerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Developer = mongoose.model('Developer', developerSchema);

export default Developer;