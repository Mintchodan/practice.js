const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10; // salt가 몇글자 인지
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// 저장하기 전에 메소드 실행
userSchema.pre("save", function (next) {
  var user = this;

  // 비밀번호가 변경될때만 암호화
  if (user.isModified("password")) {
    // salt를 만들어 비밀번호 암호화
    bcrypt.genSalt(saltRound, function (err, salt) {
      if (err) return next(err); // salt 만들때 에러시 return
      bcrypt.hash(user.password, salt, function (err, hash) {
        // 암호화된 비밀번호는 hash
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainpassword, cb) {
  // plainpassword 12345    암호화된 비밀번호 $2b$10$VWcUNKd6T449uLXY.N7/NuHO2oxQjAttraV0L9yP7B3L5DHIpgDca
  bcrypt.compare(plainpassword, this.password, function (err, isMatch) {
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function (err, user) {
    cb(null, user);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
