const express = require("express")
const bodyParser = require("body-parser")
const { User } = require("./models/User");

const app = express()
const port = 5000

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());



const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://admin:qwer@cluster0.pvii6vx.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {   
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err}) // 에러 시 err 메세지 전송
        return res.status(200).json({success: true}) // 성공 시 데이터 전송
    })
})

app.listen(port, () => console.log('Example app listening on port ${port}!'))