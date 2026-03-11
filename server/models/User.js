const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = mongoose.Schema({
    name: { type:String, maxlength:50 },
    email: { type:String, trim:true, unique: 1 },
    password: { type: String, minglength: 5 },
    lastname: { type:String, maxlength: 50 },
    role : { type:Number, default: 0 },
    image: String,
    token : { type: String },
    tokenExp :{ type: Number },
    cart: { type: Array, default: [] },
    history: { type: Array, default: [] }
})

// Hash password before saving
userSchema.pre('save', async function(next) {
    var user = this;
    if(user.isModified('password')){   
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

// Compare passwords during login
userSchema.methods.comparePassword = async function(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
}

// Generate JWT token
userSchema.methods.generateToken = async function() {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secret');
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    
    // Modern save without callback
    await user.save(); 
    return user;
}

// Find user by token
userSchema.statics.findByToken = async function (token) {
    var user = this;
    try {
        const decode = jwt.verify(token, 'secret');
        // Modern findOne without callback
        return await user.findOne({ "_id": decode, "token": token });
    } catch (err) {
        throw err;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = { User }
