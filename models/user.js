const mongoose = require('mongoose');
const validator = require('validator');
const bcryptJS = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot container "password"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject;
};
// methods can be accessible on instance such as user instance.
userSchema.methods.generateAuthToken = async function() {
    const user = this; 
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRETE);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}
// statics methods accessible on the model called model methods
userSchema.statics.findByCredientials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcryptJS.compare(password, user.password);
    if(!isMatch){ 
        throw new Error('Unable to login');
    }

    return user;
};

// has the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')){
        // return true when a user is first created and when a user is updated and password was one of the thing changed.
        user.password = await bcryptJS.hash(user.password, 8);
    }
    next();
});
// Delete user tasks when user is deleted
userSchema.pre('remove', async function(next) {
    const user = this;
    
    await Task.deleteMany({ owner: user._id });

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;