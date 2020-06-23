const express = require('express');
const app = express();
const userDB = require('./UserDB');
const FavoriteDB = require('./FavoriteDB');
const paperDB = require('./PaperDB');
const LikeDB = require('./LikeDB');
const Blog_CommentDB = require('./Blog_CommentDB');
const Comment_CommentDB = require('./Comment_CommentDB');

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
    console.log('/user/getuserlist')
    let userList = await userDB.getAll();
    await res.json({
        userList
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

app.get('/favorite/getpaperlist', jsonParser, async (req, res) => {
    let userId = req.query.userId;
    let paperList = await FavoriteDB.getPaperList(userId);
    let papers = JSON.parse(paperList);
    await res.json({
        papers
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
app.get('/paper/getsearch', jsonParser, async (req, res) => {
    let text = req.query.content;
    console.log(text);
    let papers = JSON.parse(await paperDB.getAll());
    let List = [];
    if(text==''){
        List = papers.papers
        await res.json({
            List
        })
    }
    else{
        for(let i=0; i<papers.papers.length; i++){
            if((papers.papers)[i].title.search(text) != -1 || (papers.papers)[i].content.search(text) != -1){
                List.push(papers.papers[i])
            }
        }
        await res.json({
            List
        })
    }
});

app.get('/paper/getpaper', jsonParser, async (req, res) => {
    console.log('/paper/getpaper')
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
    console.log('/paper/getpaperlist')
    let papers = await paperDB.getAll();
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

app.post('/paper/updatepaper', jsonParser, async (req, res) => {
    let paperid = req.body.paperid;
    let userid = req.body.userid;
    let starnum = req.body.starnum;
    let likenum = req.body.likenum;
    let commentnum = req.body.commentnum;
    let title = req.body.title;
    let createtime = req.body.createtime;
    let content = req.body.content;

    console.log('更新成功');
    await paperDB.update(paperid, userid, starnum, likenum, commentnum, title, createtime, content);
    await res.json({
        statue: 1,
        paperinfo: {
            paperid,
            userid,
            starnum,
            likenum,
            commentnum,
            title,
            createtime,
            content
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
    let replyId = req.body.blogCommentId;
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

    await res.json({
        commentList
    });
});


// Table `comment_comment` operation

app.post('/comment_comment/add_comment_comment', jsonParser, async function (req, res) {
    let blogCommentId = req.body.blogCommentId;
    let userId = req.body.userId;
    let commentCommentContent = req.body.commentCommentContent;
    let commentCommentCreateTime = req.body.commentCommentCreateTime;
    let replyId = req.body.replyId;

    let commentCommentId = JSON.parse(await Comment_CommentDB.add(blogCommentId, userId, commentCommentContent, commentCommentCreateTime, replyId));
    console.log('添加成功');
    await res.json({
        statue: 1,
        commentInfo: {
            commentCommentId,
            blogCommentId,
            userId,
            commentCommentContent,
            commentCommentCreateTime,
            replyId
        }
    });
});

app.post('/comment_comment/remove_comment_comment', jsonParser, async function (req, res) {
    let blogCommentId = req.body.blogCommentId;
    let userId = req.body.userId;
    let replyId = req.body.replyId;

    await Comment_CommentDB.remove(blogCommentId, userId, replyId);
    console.log('删除成功');
    await res.json({
        statue: 1
    });
});

app.get('/comment_comment/get_user_comments', jsonParser, async function (req, res) {
    let blogCommentId = req.body.blogCommentId;

    let commentList = await Comment_CommentDB.getUserComments(blogCommentId);

    await res.json({
        commentList
    });
});

app.listen(port, () => console.log(`Listening port ${port}`));