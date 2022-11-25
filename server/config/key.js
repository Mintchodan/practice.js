// 개발버전, 배포버전에 따라 다른 js파일 

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}