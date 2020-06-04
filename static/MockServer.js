const express = require('express');
const app = express();
const userDB = require('./UserDB');
const FavoriteDB = require('./FavoriteDB');
const paperDB = require('./PaperDB');

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

// Table `user` operation

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
        await res.json({
            user
        })
    }
});

app.get('/user/getuserlist', jsonParser, async (req, res) => {
    let userlist = await userDB.getAll();
    let users = JSON.parse(userlist);
    console.log(users);
    await res.json({
        users
    })
});

app.post('/user/adduser', jsonParser, async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sex = req.body.sex;
    let age = req.body.age;
    let description = req.body.description;

    let userInfo = await userDB.get(username);
    userInfo = JSON.parse(userInfo);
    console.log(userInfo);
    console.log(typeof  userInfo);
    if (JSON.stringify(userInfo) === '{}') {
        console.log('添加成功 无重复用户名');
        let userid = JSON.parse(await userDB.add(username, password, description, sex, age));
        await res.json({
            statue: 1,
            userinfo: {
                userid,
                username,
                password,
                description,
                sex,
                age
            }
        })
    }
    else {
        console.log('添加失败 已有重复用户名');
        await res.json({
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
    let description = req.body.description;

    console.log('更新成功');
    await userDB.update(userid, username, password, description, sex, age);
    await res.json({
        statue: 1,
        userinfo: {
            userid,
            username,
            password,
            description,
            sex,
            age
        }
    });

    /*let userInfo = await userDB.get(username);
    userInfo = JSON.parse(userInfo);
    console.log(userInfo);*/

    /*if (JSON.stringify(userInfo) === '{}') {
        console.log('更新成功 无重复用户名');
        await userDB.update(userid, username, password, sex, age);
        await res.json({
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
        await res.json({
            statue: 0,
            userinfo: {}
        })
    }*/
});

// Table `favorite` operation

app.post('/favorite/addfavorite', jsonParser, async (req, res) => {
    let userId = req.body.userId;
    let paperId = req.body.paperId;
    let createTime = req.body.createTime;

    let favoriteId = await FavoriteDB.add(userId, paperId, createTime);
    console.log('收藏成功');

    await res.json({
        statue: 1,
        favorite: {
            favoriteId,
            userId,
            paperId
        }
    })

});

app.post('/favorite/removefavorite', jsonParser, async (req, res) => {
    let userId = req.body.userId;
    let paperId = req.body.paperId;

    await FavoriteDB.remove(userId, paperId);
    console.log('删除成功');

    await res.json({
        statue: 1,
    })
});

app.get('/favorite/getuserlist', jsonParser, async (req, res) => {
    let paperId = req.query.paperId;
    let userList = await FavoriteDB.getUserList(paperId);
    let users = JSON.parse(userList);
    console.log(users);
    await  res.json({
        users
    })
});

app.get('/favorite/getpaperlist', jsonParser, async (req, res) => {
    let userId = req.query.userId;
    let paperList = await FavoriteDB.getPaperList(userId);
    let papers = JSON.parse(paperList);
    console.log(papers);
    await res.json({
        papers
    })
});

// Table `paper` operation

app.get('/paper/getpaper', jsonParser, async (req, res) => {
    let paperid = req.query.paperid;
    let paper;
    console.log(paperid);
    if (paperid === undefined) {
        res.send('undefined');
    }
    else {
        let paperInfo = await paperDB.get(paperid);
        paper = JSON.parse(paperInfo);
        console.log(paper);
        await res.json({
            paper
        })
    }
});

app.get('/paper/getpaperlist', jsonParser, async (req, res) => {
    let paperlist = await paperDB.getAll();
    let papers = JSON.parse(paperlist);
    console.log(papers);
    await res.json({
        papers
    })
});

app.post('/paper/addpaper', jsonParser, async (req, res) => {

    let userid = req.body.userid;
    let title = req.body.title;
    let createtime = req.body.createtime;
    let content = req.body.content;

    // add operation always be correct

    console.log('添加文章成功');
    let paperid = JSON.parse(await paperDB.add(userid, title, createtime, content));
    await res.json({
        statue: 1,
        paperinfo: {
            paperid,
            userid,
            title,
            createtime,
            content,
        }
    })
});


app.listen(port, () => console.log(`Listening port ${port}`));
