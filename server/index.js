const express = require("express");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const cookieParser = require("cookie-parser");

const config = require("./config/key");
const { auth } = require("./middleware/auth");

const app = express();
const port = 5000;

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/api/hello", (req, res) => {
  res.send("hello response");
});

app.post("/api/users/register", (req, res) => {
  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err }); // 에러 시 err 메세지 전송
    return res.status(200).json({ success: true }); // 성공 시 데이터 전송
  });
});

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      // 비밀번호가 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err); // 400이면 에러가 있다는 뜻

        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
        res
          .cookie("x_auth", user.token)
          .status(200) // 성공시 200
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// auth가 endpoint의 리퀘스트를 받은다음 콜백폼션 하기 전 중간 기능
app.get("/api/users/auth", auth, (req, res) => {
  // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true 라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // 어드민 유저인지 확인 , role 0 -> 일반유저 , role이 0이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// 로그아웃 기능
app.get("/api/users/logout", auth, (req, res) => {
  // auth 미들웨어에서 아이디를 가져와 찾은 다음 해당 토큰 ""로 업데이트
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => console.log("Example app listening on port : " + port));
