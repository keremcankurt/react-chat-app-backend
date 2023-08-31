const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: 'https://avatars.mds.yandex.net/i?id=6e900065f9cf09d44732f3e269f99de2722be96f-9285955-images-thumbs&n=13',
    }
},{timestamps: true})


userModel.pre("save", function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const saltRounds = 10;
    const myPlaintextPassword = this.password;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(myPlaintextPassword, salt, (err, hash) => {
        if (err) next(err);
        this.password = hash;
        next();
      });
    });
  });

const User = mongoose.model('User',userModel)
module.exports = User

