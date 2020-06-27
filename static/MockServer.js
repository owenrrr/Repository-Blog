const express = require('express');
const app = express();
const userDB = require('./UserDB');
const FavoriteDB = require('./FavoriteDB');
const paperDB = require('./PaperDB');
const LikeDB = require('./LikeDB');
const Blog_CommentDB = require('./Blog_CommentDB');
const FollowDB = require('./FollowDB')

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

// Table `Follow` operation

app.get('/follow/getFollows', jsonParser, async (req, res) => {
    let userId = req.query.userId;
    let current = req.query.current
    let userList = await FollowDB.getFollows(userId);
    userList = JSON.parse(userList)
    let users = []
    for(let user of userList){
        let temp = await userDB.getById(user)
        temp = JSON.parse(temp)
        users.push(temp)
    }
    let pageSize = 5
    let pageData = []
    for (let i = (current - 1) * pageSize; i < current * pageSize; i++) {
        if (i < users.length) {
            pageData.push(users[i])
        }
    }
    await res.json({
        total: users.length,
        pageData
    })
})

app.get('/follow/check', jsonParser, async (req, res) => {
    let userId = Number(req.query.userId);
    let followId = Number(req.query.followId);
    let userList = await FollowDB.getFollows(userId)
    userList = JSON.parse(userList)
    let sign = false
    for (let user of userList) {
        if (user === followId) {
            sign = true
            break
        }
    }
    await res.json(sign)

})

app.post('/follow/addFollow', jsonParser, async (req, res) => {
    let userId = req.body.userId
    let followId = req.body.followId
    let result = await FollowDB.add(userId, followId);
    console.log('关注成功');
    await res.json({
        statue: 1,
        follow: {
            followId,
            userId,
            result
        }
    })

})

app.post('/follow/removeFollow', jsonParser, async (req, res) => {
    let userId = req.body.userId
    let followId = req.body.followId
    await FollowDB.remove(userId, followId);
    console.log('删除关注成功');
    await res.json({
        statue: 1,
    })
})

// Table `user` operation

app.get('/user/searchUser', jsonParser, async (req, res) => {
    let text = req.query.searchInfo
    let current = req.query.current
    let userId = req.query.userId

    let users = await userDB.getAll();
    users = JSON.parse(users);

    let tempList = []
    for(let user of users){
        if(user.userName.search(text) !== -1 || user.email.search(text) !== -1){
            tempList.push(user)
        }
    }

    let follows = await FollowDB.getFollows(userId)
    follows = JSON.parse(follows)

    let userList = []
    for(let i=0; i<tempList.length; i++){
        let flag = true
        for(let follow of follows){
            if(tempList[i].userId==follow){
                flag = false
                break
            }
        }
        if(tempList[i].userId==userId){
            flag = false
        }
        if(flag){
            userList.push(tempList[i])
        }
    }

    let pageSize = 5
    let pageData = []

    for (let i = (current - 1) * pageSize; i < current * pageSize; i++) {
        if (i < userList.length) {
            pageData.push(userList[i])
        }
    }

    await res.json({
        total: userList.length,
        pageData
    })
})

app.get('/user/getUserById', jsonParser, async (req, res) => {
    let userId = req.query.userId;
    let user;
    let userInfo = await userDB.getById(userId);
    user = JSON.parse(userInfo);
    await res.json(
        user
    )

});

app.get('/user/getUserByEmail', jsonParser, async (req, res) => {
    let email = req.query.email;
    let userInfo = await userDB.get(email);
    userInfo = JSON.parse(userInfo);
    await  res.json(userInfo)
})

app.post('/user/login', jsonParser, async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    let userInfo = await  userDB.get(email)
    userInfo = JSON.parse(userInfo);
    if (JSON.stringify(userInfo) === '{}' || userInfo.password !== password) {
        console.log('用户名或密码错误')
        await res.json(false)
    }
    else {
        console.log('登录成功')
        await res.json(true)
    }
})

app.get('/user/getuserlist', jsonParser, async (req, res) => {
    console.log('/user/getuserlist')
    let userList = await userDB.getAll();
    userList = JSON.parse(userList)
    await res.json({
        userList
    })
});

app.get('/user/checkEmail', jsonParser, async (req, res) => {
    let email = req.query.email;
    let userInfo = await  userDB.get(email);
    userInfo = JSON.parse(userInfo);
    if (JSON.stringify(userInfo) === '{}') {
        console.log('无重复用户邮箱');
        await res.json(true)
    }
    else {
        console.log('用户邮箱已存在');
        await res.json(false)
    }
})

app.post('/user/adduser', jsonParser, async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let color = req.body.color;

    console.log('添加成功');
    let userid = JSON.parse(await userDB.add(username, password, email, color));
    await res.json({
        statue: 1,
        userinfo: {
            userid,
            username,
            password,
            email
        }
    })
});

app.post('/user/updateuser', jsonParser, async (req, res) => {
    let userId = req.body.userId;
    let userName = req.body.userName;
    let password = req.body.password;
    let sex = req.body.sex;
    let age = req.body.age;
    let description = req.body.description;

    await userDB.update(userId, userName, password, description, sex, age);


    await res.json({
        statue: 1,
        userInfo: {
            userId,
            userName,
            password,
            description,
            sex,
            age
        }
    });

});

// Table `favorite` operation

app.post('/favorite/addfavorite', jsonParser, async (req, res) => {
    let userId = req.body.userId;
    let paperId = req.body.paperId;
    let createTime = req.body.createTime;

    console.log(userId + " " + paperId + " " + createTime)

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

app.get('/favorite/checkFavorite', jsonParser, async (req,res) => {
    let userId = Number(req.query.userId);
    let paperId = Number(req.query.paperId);
    let userList = await FavoriteDB.getUserList(paperId)
    userList = JSON.parse(userList)
    let sign = false
    for (let user of userList) {
        if (user === userId) {
            sign = true
            break
        }
    }
    await res.json(sign)
})

app.get('/favorite/getpaperlist', jsonParser, async (req, res) => {
    let userId = req.query.userId;
    let current = req.query.current;
    let papers = await FavoriteDB.getPaperList(userId);
    papers = JSON.parse(papers);

    let tempList = [];
    for (let paperId of papers) {
        let paper = await paperDB.get(paperId);
        paper = JSON.parse(paper);
        tempList.push(paper);
    }

    let pageSize = 10;
    let paperList = [];
    for (let i = (current - 1) * pageSize; i < current * pageSize; i++) {
        if (i < tempList.length) {
            paperList.push(tempList[i])
        }
    }

    await res.json({
        total: tempList.length,
        paperList
    })
});

// Table `like` operation

app.post('/like/addlike', jsonParser, async (req, res) => {
    let userId = req.body.userId;
    let paperId = req.body.paperId;
    let createTime = req.body.createTime;

    console.log(userId + " " + paperId + " " + createTime);

    let likeId = JSON.parse(await LikeDB.add(userId, paperId, createTime));

    console.log('点赞成功');

    await res.json({
        statue: 1,
        like: {
            likeId,
            userId,
            paperId
        }
    });
});

app.post('/like/removelike', jsonParser, async (req, res)  => {
    let userId = req.body.userId;
    let paperId = req.body.paperId;

    await LikeDB.remove(userId, paperId);
    console.log('删除成功');

    await res.json({
        statue: 1,
    });
});

app.get('/like/getuserlist', jsonParser, async (req, res) => {
    let paperId = req.query.paperId;
    let userList = await LikeDB.getUserList(paperId);
    let users = JSON.parse(userList);
    console.log(users);
    await  res.json({
        users
    });
});

app.get('/like/checkLike', jsonParser, async (req, res) => {
    let userId = Number(req.query.userId)
    let paperId = Number(req.query.paperId)
    let userList = await LikeDB.getUserList(paperId)
    userList = JSON.parse(userList)
    console.log(userId)
    console.log(userList)

    let sign = false
    for (let user of userList) {
        console.log(user)
        console.log(typeof user)
        console.log(typeof userId)
        if (user === userId) {
            sign = true
            break
        }
    }
    await res.json(sign)
})

app.get('/like/getpaperlist', jsonParser, async (req, res) => {
    console.log('/like/getpaperlist')
    let userId = req.query.userId;
    let paperList = await LikeDB.getPaperList(userId);
    let papers = JSON.parse(paperList);
    console.log(papers);
    await res.json({
        papers
    });
});

// Table `paper` operation
app.post('/paper/deletepaper', jsonParser, async(req, res) => {
    let paperId = req.body.paperId
    await paperDB.delete(paperId)
    await res.json({
        statue: 1,
    });
})
app.get('/paper/getauthorId', jsonParser, async (req, res) => {
    let paperId = req.query.paperId
    let authorId = await paperDB.getauthorid(paperId)
    authorId = JSON.parse(authorId)
    console.log(authorId);
    await res.json(authorId)
})
app.get('/paper/getsearch', jsonParser, async (req, res) => {
    let text = req.query.content;
    let current = req.query.current;
    let pageSize = 10;
    console.log(text);
    let papers = await paperDB.getAll();
    papers = JSON.parse(papers);
    let total = papers.length;
    let list = [];
    if(text===''){
        for (let i = (current - 1) * pageSize; i < current * pageSize; i++) {
            if (i < total) {
                list.push(papers[i])
            }
        }
        await res.json({
            total,
            list
        })
    }
    else{
        let paperList = [];
        for(let i=0; i<total; i++){
            if(papers[i].title.search(text) !== -1 || papers[i].content.search(text) !== -1){
                paperList.push(papers[i])
            }
        }
        total = paperList.length;
        for (let i = (current - 1) * pageSize; i < current * pageSize; i++) {
            if (i < total) {
                list.push(paperList[i])
            }
        }
        await res.json({
            total,
            list
        })
    }
});

app.get('/paper/getpaper', jsonParser, async (req, res) => {
    console.log('/paper/getpaper')
    let paperId = req.query.paperId;
    let paper;

    let paperInfo = await paperDB.get(paperId);
    paper = JSON.parse(paperInfo);
    console.log(paper);
    await res.json(
        paper
    )
});

app.get('/paper/getmypapers', jsonParser, async(req,res) =>{
    console.log("/paper/getmypapers")
    let userId = req.query.userId;
    let current = req.query.current;
    let papers = await paperDB.getmypapers(userId)
    papers = JSON.parse(papers)
    let pageSize = 10;
    let paperList = [];
    for (let i = (current - 1) * pageSize; i < current * pageSize; i++) {
        if (i < papers.length) {
            paperList.push(papers[i])
        }
    }

    await res.json({
        total: paperList.length,
        paperList
    })
})

app.get('/paper/getpaperlist', jsonParser, async (req, res) => {
    let current = req.query.current
    console.log('/paper/getpaperlist')

    let pageSize = 10
    let papers = await paperDB.getAll();
    papers = JSON.parse(papers);
    console.log(papers)
    let total = papers.length
    console.log(total)
    let paperList = []

    for (let i = (current - 1) * pageSize; i < current * pageSize; i++) {
        if (i < total) {
            paperList.push(papers[i])
        }
    }

    await res.json({
        total,
        paperList
    })
});

app.post('/paper/addpaper', jsonParser, async (req, res) => {

    let userId = req.body.userId;
    let title = req.body.title;
    let createTime = req.body.createTime;
    let content = req.body.content;

    // add operation always be correct

    console.log('添加文章成功');
    let paperId = JSON.parse(await paperDB.add(userId, title, createTime, content));
    await res.json({
        statue: 1,
        paperInfo: {
            paperId,
            userId,
            title,
            createTime,
            content,
        }
    })
});

app.post('/paper/updatePaperLikeAndStar', jsonParser, async (req, res) => {
    let paperId = req.body.paperId;
    let starNum = req.body.starNum;
    let likeNum = req.body.likeNum;

    console.log('更新成功');
    await paperDB.updateLikeAndStar(paperId, starNum, likeNum);
    await res.json({
        statue: 1,
        paperInfo: {
            paperId,
            starNum,
            likeNum,
        }
    });

});

app.post('/paper/updatePaperComment', jsonParser, async (req, res) => {
    let paperId = req.body.paperId;
    let commentNum = req.body.commentNum;

    console.log('更新成功');
    await paperDB.updateComment(paperId, commentNum);
    await res.json({
        statue: 1,
        paperInfo: {
            paperId,
            commentNum
        }
    });

});

// Table `blog_comment` operation

app.post('/blog_comment/add_blog_comment', jsonParser, async function (req, res) {
    let userId = req.body.userId;
    console.log(userId)
    let paperId = req.body.paperId;
    let content = req.body.content;
    let createTime = req.body.createTime;
    let type = req.body.commentType;
    let replyId = req.body.replyCommentId;
    console.log(replyId)

    let blogCommentId = await Blog_CommentDB.add(userId, paperId, content, createTime, type, replyId);
    console.log('添加成功');
    await res.json({
        statue: 1,
        commentInfo: {
            blogCommentId,
            userId,
            paperId,
            content,
            createTime
        }
    });
});

app.post('/blog_comment/remove_blog_comment', jsonParser, async function (req, res) {
    let userId = req.body.userId;
    let paperId = req.body.paperId;

    await Blog_CommentDB.remove(userId, paperId);
    console.log('删除成功');
    await res.json({
        statue: 1
    });
});

app.get('/blog_comment/get_user_comments', jsonParser, async function (req, res) {
    console.log('/blog_comment/get_user_comments')
    let paperId = req.query.paperId;
    console.log(paperId);
    let commentList = await Blog_CommentDB.getUserComments(paperId);

    console.log(commentList)

    for (let i = 0; i < commentList.length; i++) {
        let userId = commentList[i].userId
        let user = await userDB.getById(userId)
        user = JSON.parse(user)
        commentList[i].userName = user.userName
        if (commentList[i].commentType === 0) {
            commentList[i].replyCommentName = null
        }
        else {
            let replyId = commentList[i].replyCommentId
            console.log(replyId)
            let comment = await Blog_CommentDB.getCommentById(replyId)
            comment = JSON.parse(comment)
            console.log(comment)
            let userId = comment.userId
            console.log(userId)
            let user = await userDB.getById(userId)
            user = JSON.parse(user)
            console.log(user)
            commentList[i].replyCommentName = user.userName
        }
    }
    console.log(commentList)
    await res.json({
        commentList
    });
});

app.listen(port, () => console.log(`Listening port ${port}`));