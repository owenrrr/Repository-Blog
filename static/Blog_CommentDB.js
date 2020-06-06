let mysql = require('mysql');

let connection;

let userConfig = import('./databaseInfoConfig');

function openConnection() {

    connection = mysql.createConnection(userConfig.user);

}

function closeConnection() {

    connection.end();

}

module.exports = {

    add: function (userId, paperId, content, createTime) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, paperId, content, createTime];

            let sql = 'insert into `blog_comment` (user_id, paper_id, blog_comment_content, blog_comment_create_time) values (?, ?, ?, ?);';

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

    remove: function (userId, paperId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, paperId];

            let sql = 'delete from `blog_comment` where user_id = ? and paper_id = ?;';

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

                console.log(res);

                resolve(res);

            });

            closeConnection();

        }).then(value => {

            if (value.length !== 0) {

                let total = value.length;

                let commentList = [];

                for (let i = 0; i < total; i++) {

                    let comment = {

                        blogCommentId: value[i].blog_comment_id,

                        userId: value[i].user_id,

                        paperId: value[i].paper_id,

                        blogCommentContent: value[i].blog_comment_content,

                        blogCommentCreateTime: value[i].blog_comment_create_time,
                    }

                    commentList.push(comment);

                }

                return JSON.stringify({

                    total,

                    commentList

                });

            }

            else {

                console.log('UserCommentList is empty');

                return JSON.stringify({

                    total: 0,

                    commentList: []

                });

            }

        }).catch(err => {

            console.log(err);

        });

    }
}