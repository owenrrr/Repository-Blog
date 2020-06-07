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

    add: function (blogCommentId ,userId, commentCommentContent, commentCommentCreateTime, replyId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, commentCommentContent, commentCommentCreateTime, replyId];

            let sql = 'insert into `comment_comment` (blog_comment_id ,user_id, comment_comment_content, comment_comment_create_time, reply_id) values (?, ?, ?, ?, ?);';

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

        }).then(value => {

            console.log(value);

            return JSON.stringify(value);

        }).catch(err => {

            console.log(err);

        });

    },

    remove: function (blogCommentId ,userId, replyId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [blogCommentId ,userId, replyId];

            let sql = 'delete from comment_comment where blog_comment_id = ? and user_id = ? and reply_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[DELETE-FAILED] ' + err.message);

                    return;

                }

                console.log('[DELETE-SUCCESS] ');

                console.log(res);

                resolve(res);

            });

            closeConnection();

        }).then(value => {

            console.log(value);

            return JSON.stringify(value);

        }).catch(err => {

            console.log(err);

        });

    },

    getUserComments: function (blogCommentId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [blogCommentId];

            let sql = 'select * from comment_comment where blog_comment_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-USER-COMMENTS-FAILED]');

                    return;

                }

                console.log('[GET-USER-COMMENTS-SUCCESS] ');

                console.log(res);

                resolve(res);

            });

            closeConnection();

        }).then(value => {

            if (value.length !== 0) {

                let total = value.length;

                let comments = [];

                for (let i = 0; i < total; i++) {

                    let comment = {

                        commentCommentId: value[i].comment_comment_id,

                        blogCommentId: value[i].blog_comment_id,

                        userId: value[i].user_id,

                        commentCommentContent: value[i].comment_comment_content,

                        commentCommentCreateTime: value[i].comment_comment_create_time,

                        replyId: value[i].reply_id,

                    };

                    comments.push(comment);

                }

                return JSON.stringify({

                    total,

                    comments

                });

            }

            else {

                console.log('userComments is empty!');

                return JSON.stringify({

                    total: 0,

                    comments: [],

                });

            }

        }).catch(err => {

            console.log(err);

        });

    }

}