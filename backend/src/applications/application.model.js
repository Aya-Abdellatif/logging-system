import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Application name is required'],
      unique: true,
      trim: true,
      validate: [
        {
          validator: (v) => !/\s/.test(v),
          message: 'Application name must not contain whitespace',
        },
        {
          validator: (v) => /^[a-zA-Z0-9_-]+$/.test(v),
          message: 'Name can only contain letters, numbers, hyphens, and underscores',
        },
      ],
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Developer',
      required: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;