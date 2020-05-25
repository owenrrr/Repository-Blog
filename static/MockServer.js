const express = require('express');
const app = express();
const userDB = require('./UserDB');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

const port = 3000;

app.get('/', (req, res) => res.send('Hello World'));

app.get('/user/getuser', jsonParser, async (req, res) => {
    let username = req.query.username;
    let user;
    console.log(username);
    if (username === undefined) {
        res.send('undefined');
    }
    else {
        let userInfo = await userDB.get(username);
        user = JSON.parse(userInfo);
        console.log(user);
        res.json({
            user
        })
    }
});

app.get('/user/getuserlist', jsonParser, async (req, res) => {
    let userlist = await userDB.getAll();
    let users = JSON.parse(userlist);
    console.log(users);
    res.json({
        users
    })
});

app.post('/user/adduser', jsonParser, async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sex = req.body.sex;
    let age = req.body.age;

    let userInfo = await userDB.get(username);
    userInfo = JSON.parse(userInfo);
    console.log(userInfo);
    console.log(typeof  userInfo);
    if (JSON.stringify(userInfo) === '{}') {
        console.log('添加成功 无重复用户名');
        let userid = JSON.parse(await userDB.add(username, password, sex, age));
        res.json({
            statue: 1,
            userinfo: {
                userid,
                username,
                password,
                sex,
                age
            }
        })
    }
    else {
        console.log('添加失败 已有重复用户名');
        res.json({
            statue: 0,
            userinfo: {}
        })
    }
});

app.post('/user/updateuser', jsonParser, async (req, res) => {
    let userid = req.body.userid;
    let username = req.body.username;
    let password = req.body.password;
    let sex = req.body.sex;
    let age = req.body.age;

    let userInfo = await userDB.get(username);
    userInfo = JSON.parse(userInfo);
    console.log(userInfo);

    if (JSON.stringify(userInfo) === '{}') {
        console.log('更新成功 无重复用户名');
        userDB.update(userid, username, password, sex, age);
        res.json({
            statue: 1,
            userinfo: {
                userid,
                username,
                password,
                sex,
                age
            }
        })
    }
    else {
        console.log('更新失败 已有重复用户名');
        res.json({
            statue: 0,
            userinfo: {}
        })
    }
});

app.listen(port, () => console.log(`Listening port ${port}`));
