const { User } = require("../models/User");

// 인증 처리를 하는곳
let auth = (req, res, next) => {
  // 클라이언트 쿠키에서 토큰을 가져온다. (쿠키 파서 이용)
  let token = req.cookies.x_auth;

  // 토큰을 복호화 한 후 유저를 찾는다
  User.findbyToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true }); // 유저가 없으면 클라이언트에게 isAuth로 false , error로 true 전달

    // 에러가 없으면...
    req.token = token; // index에서 사용할 수 있게 리퀘스트 전달
    req.user = user;
    next(); // 없으면 미들웨어에 갇혀버림
  });

  // 유저가 있으면 인증 OK , 유저가 없으면 인증 NO
};

module.exports = { auth };
