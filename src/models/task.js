const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: [true, 'Please provide a task name'],
    trim: true,
    minlength: [3, 'Task name must have at least 3 characters'],
    maxlength: [50, 'Task name cannot be more than 50 characters'],
  },
  taskDate: {
    type: Date,
    required: [true, 'Please provide a task date'],
    validate: {
      validator: function(v) {
        if (this.isModified('taskDate')) {
          return v >= new Date().setHours(0, 0, 0, 0);
        }
        return true;
      },
      message: 'Task date must be in future',
    },
  },
  taskStatus: {
    type: String,
    enum: {
      values: ['Completed', 'Incomplete'],
      message: '{VALUE} is not a valid task status',
    },
    default: 'Incomplete',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  sequence: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
