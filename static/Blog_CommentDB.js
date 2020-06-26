let mysql = require('mysql');

let connection;

let userConfig = require('./databaseInfoConfig');

function openConnection() {

    connection = mysql.createConnection(userConfig.user);

}

function closeConnection() {

    connection.end();

}

module.exports = {

    add: function (userId, paperId, content, createTime, commentType, replyId) {

        console.log(userId + ' ' + paperId + ' ' + content + ' ' + createTime + ' ' + commentType + ' ' + replyId)

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, paperId, content, createTime, commentType, replyId];

            let sql = 'insert into `blog_comment` (user_id, paper_id, blog_comment_content, blog_comment_create_time, comment_type, reply_comment_id)  values (?, ?, ?, ?, ?, ?);';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[INSERT-FAILED] ' + err.message);

                    return;

                }

                console.log('--------------------------INSERT----------------------------');

                console.log('[INSERT-SUCCESS] the generate user_id is ' + res.insertId);

                console.log('INSERT ID:',res);

                console.log('-----------------------------------------------------------------\n\n');

                resolve(res.insertId);

            });

            closeConnection();

        })

    },

    remove: function (userId, paperId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, paperId];

            let sql = 'delete from `blog_comment` where user_id = ? and paper_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[DELETE-COMMENT-FAILED] ' + err.message);

                    return;

                }

                console.log('[DELETE-COMMENT-SUCCESS] ');

                console.log(res);

                resolve(res);

            });

            closeConnection();

        })

    },

    getCommentById: function (commentId) {

        return new Promise((resolve, reject) => {

            console.log('getCommentById')

            console.log(commentId)

            openConnection();

            let param = [commentId];

            let sql = 'select * from blog_comment where blog_comment_id = ?;';

            connection.query(sql, param, function (err, res) {

                if (err) {

                    console.log('[GET-COMMENT-BY-ID-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-COMMENT-BY-ID-SUCCESS]')

                console.log(res)

                let comment = {

                    blogCommentId: res[0].blog_comment_id,

                    userId: res[0].user_id,

                    paperId: res[0].paper_id,

                    blogCommentContent: res[0].blog_comment_content,

                    blogCommentCreateTime: res[0].blog_comment_create_time,

                    commentType: res[0].comment_type,

                    replyCommentId: res[0].reply_comment_id

                }

                console.log(comment)

                resolve(JSON.stringify(comment));

            })

            closeConnection();

        })

    },

    getUserComments: function (paperId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [paperId];

            let sql = 'select * from blog_comment where paper_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-USER-COMMENT-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-USER-COMMENT-SUCCESS] ');

                let commentList = [];

                if (res.length !== 0) {

                    for (let i = 0; i < res.length; i++) {


                        let comment = {

                            blogCommentId: res[i].blog_comment_id,

                            userId: res[i].user_id,

                            paperId: res[i].paper_id,

                            blogCommentContent: res[i].blog_comment_content,

                            blogCommentCreateTime: res[i].blog_comment_create_time,

                            commentType: res[i].comment_type,

                            replyCommentId: res[i].reply_comment_id
                        }

                        commentList.push(comment);

                    }

                    resolve(commentList);

                }

                else {

                    console.log('UserCommentList is empty');

                    resolve(commentList);

                }



            });

            closeConnection();

        })

    }
}