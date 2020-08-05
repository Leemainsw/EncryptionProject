const express = require('express');
const bodyparser = require('body-parser');
const oracledb = require('oracledb');
const app = express();
const port = 3000;

app.set('views', './views')
app.set('view engine', 'pug')
app.locals.pretty = true;

app.use(bodyparser.urlencoded({
    exrended: false
}))

function Encryption(arr) {
    var _arr = arr.split("");
    var key = arr.charCodeAt(0)*"apple".charCodeAt(4);
    var result1 = new Array;
    var result2 = new Array;

    for(var i=0; i < arr.length; i++)
    {
        result1[i] = _arr[i].charCodeAt(0).toString(2);
        if( i%2 != 0 ) result1[i] = null;
        result2[i] = (String.fromCharCode(result1[i]));
    }
    console.log(result2);
    return result2;
}

app.get('/Encryption',(req, res)=>{
    res.render('Encryption');
});


app.post('/Encryption', (req, res)=>{
    // 암호화 할 평문
    const _string = req.body.string;
    const result = Encryption(_string);

    console.log(result);

    res.render('Result', {
        _result: result
    });
})

// 로그인 페이지 
app.get('/Login', (req, res)=>{
    res.render('LoginForm');
})

// 로그인 포스트
app.post('/Login', (req, res)=>{
    const id = req.body.ID;
    const password = req.body.PW;

    console.log('id = ' + id);
    console.log('password = ' + password);

    // 아이디와 비밀번호가 일치하면 암호화 페이지로 넘김
    oracledb.getConnection({
        user: 'SSNCTEST',
        password: 'SSNC1234',
        host: 'localhost', 
        database: 'xe'
    }, function (err, connection) {
        if(err){
            console.log('접속 실패', err);
            return;
        }
        console.log('접속 성공');
        conn = connection;

        conn.execute("select * from users", {}, {outFormat:oracledb.OBJECT}, function (err, result) {  
            // Json 형태로 넘어오도록 설정
            if(err) throw err;  

            var dataStr = JSON.stringify(result);
            var arrStr = JSON.stringify(result.rows);
            var arr = JSON.parse(arrStr);

            for(var i=0; i<arr.length; i++)
            {
                console.log('arr[i].USER_ID = ' + arr[i].USER_ID);
                console.log('arr[i].USER_PASSWORD = ' + arr[i].USER_PASSWORD);  

                if(arr[i].USER_ID == id)
                {
                    if(arr[i].USER_PASSWORD == password)
                    {

                        console.log('로그인 성공!');
                        res.send(`<script type="text/javascript">alert("로그인 성공!");location.href="/Encryption";</script>`);
                        return;
                    }
                    else
                    {
                        console.log('비밀번호가 틀렸습니다!');
                        res.send(`<script type="text/javascript">alert("비밀번호가 틀렸습니다");location.href="/Login";</script>`);
                        return;
                    }
                }
            }
            console.log('아이디가 존재하지 않습니다!');
            res.send(`<script type="text/javascript">alert("아이디가 존재하지 않습니다");location.href="/Login";</script>`);
        });
    });
    
})


app.listen(port, (req, res)=>{
    console.log("Connected Express Server");
})