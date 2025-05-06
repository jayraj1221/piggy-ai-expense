const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['parent', 'child'],
      default: 'child',
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.role === 'child';  // Only required if the user is a child
      },
    },
    creditScore: { 
      type: Number, 
      default: 100 
    }, // starting score
    tag: { 
      type: String, 
      default: "New User" 
    },
    pocketMoney: { 
      type: Number, 
      default: 0 
    }, 
  },
  { timestamps: true } 
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 

  try {
    const salt = await bcrypt.genSalt(10);  
    this.password = await bcrypt.hash(this.password, salt);  // Hash password
    next();
  } catch (error) {
    next(error);  
  }
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
