import mongoose from 'mongoose';

const LOG_LEVELS = ['INFO', 'WARN', 'ERROR'];

const logSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Log message is required'],
      trim: true,
    },
    level: {
      type: String,
      required: [true, 'Log level is required'],
      enum: {
        values: LOG_LEVELS,
        message: 'Level must be one of: INFO, WARN, ERROR',
      },
    },
    count: {
      type: Number,
      default: 1,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
  },
  { timestamps: true }
);

logSchema.index({ application: 1, message: 1, level: 1 }, { unique: true });

const Log = mongoose.model('Log', logSchema);

export { LOG_LEVELS };
export default Log;