const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({  
  email: {
    type: String,
    required: [true, 'Email is required'],    
    trim: true,
    validate: [
      { validator: isEmail, message: 'Invalid email' },
      {
        validator: async function (value) {
          if (this.isModified('email')) {
            const count = await this.model('User').countDocuments({ email: value });
            return count === 0;
          }
          return true;
        },
        message: props => `Email ${props.value} already exists`
      }
    ]    
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: function(v) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  isVerified: {
    type: Boolean,    
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash Password
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
