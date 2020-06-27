let mysql = require('mysql');
let connection;
let userConfig = require('./databaseInfoConfig');

function openConnection() {

    connection = mysql.createConnection(userConfig.user);

}
// test

function closeConnection() {

    connection.end();

}

module.exports = {

    delete: function(paperId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [paperId];

            let sql = 'delete from paper where paper_id = ?;';

            connection.query(sql, params, function(err, res) {

                if (err) {

                    console.log('[DELETE-ERROR]' + err.message);

                    return;

                }

                console.log('[DELETE-PAPER-SUCCESS] ');

                console.log(res);

                resolve(JSON.stringify(res));

            })

            closeConnection()

        })

    },

    add: function (userId, title, createTime, content) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, title, createTime, content];

            let sql = 'insert into paper (user_id, title, create_time, content) values (?, ?, ?, ?);';

            connection.query(sql, params, function (err, result) {

                if (err) {

                    console.log('[INSERT-ERROR]' + err.message);

                    return;

                }



                console.log('--------------------------INSERT----------------------------');

                console.log('[INSERT-SUCCESS] the generate paper_id is ' + result.insertId);

                console.log('INSERT ID:',result);

                console.log('-----------------------------------------------------------------\n\n');

                resolve(JSON.stringify(result.insertId));

            });

            closeConnection()

        })

    },

    get: function (paperId) {

        console.log(paperId);

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [paperId];

            let sql = 'select * from paper where paper_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-PAPER-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-PAPER-SUCCESS] ')

                console.log(res);

                if (res.length !== 0) {

                    let paper = {

                        paperId: res[0].paper_id,

                        userId: res[0].user_id,

                        starNum: res[0].star_num,

                        likeNum: res[0].like_num,

                        commentNum: res[0].comment_num,

                        title: res[0].title,

                        createTime: res[0].create_time,

                        content: res[0].content,

                    };

                    resolve(JSON.stringify(paper));

                }

                else {

                    console.log('Paper not find');

                    resolve(JSON.stringify({}));

                }

            });

            closeConnection();

        })

    },

    getAll: function(){

        return new Promise(((resolve, reject) => {

            openConnection();

            let sql = 'select * from paper;';

            connection.query(sql, function (err, res) {

                if (err) {

                    console.log('[GET-ALL-PAPER-FAILED] ' + err.message);

                    return;

                }

                if (res) {

                    console.log('[GET-ALL-PAPER-SUCCESS]');

                    console.log(res);

                    if (res.length !== 0) {

                        let papers = [];

                        let total = res.length;

                        for (let i = 0; i < total; i++) {

                            let paper = {

                                paperId: res[i].paper_id,

                                userId: res[i].user_id,

                                starNum: res[i].star_num,

                                likeNum: res[i].like_num,

                                commentNum: res[i].comment_num,

                                title: res[i].title,

                                createTime: res[i].create_time,

                                content: res[i].content,

                            };

                            papers.push(paper);

                        }

                        resolve(

                            JSON.stringify(papers)

                        )

                    }

                    else {

                        console.log('Papers not find');

                        resolve(


                            JSON.stringify([])

                        )

                    }

                }

            });

            closeConnection();

        }))

    },

    //paper upadte

    updateLikeAndStar: function (paperId, starNum, likeNum) {

        return new Promise((resolve, reject) => {

            openConnection();

            let sql = `update paper

            set 

            star_num='${starNum}',

            like_num='${likeNum}'

            where paper_id='${paperId}';`;

            connection.query(sql, function (err, res) {

                if (err) {

                    console.log('[UPDATE-ERROR]' + err.message);

                    return;

                }

                console.log('[UPDATE-SUCCESS] ' + res.affectedRows);

                resolve();

            });

            closeConnection();

        })

    },

    updateComment: function (paperId, commentNum) {

        return new Promise((resolve, reject) => {

            openConnection();

            let sql = `update paper

            set 

            comment_num='${commentNum}'

            where paper_id='${paperId}';`;

            connection.query(sql, function (err, res) {

                if (err) {

                    console.log('[UPDATE-ERROR]' + err.message);

                    return;

                }

                console.log('[UPDATE-SUCCESS] ' + res.affectedRows);

                resolve();

            });

            closeConnection();

        })

    },

    getauthorid: function(paperId) {

        return new Promise((resolve, reject) => {

            openConnection()

            let params = [paperId]

            let sql = 'select * from paper where paper_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-PAPERAUTHOR-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-PAPERAUTHOR-SUCCESS] ')

                console.log(res);

                let authorid = res[0].user_id

                resolve(JSON.stringify(authorid));

            })

        })

    },

    getmypapers: function(userId) {

        return new Promise((resolve,reject) => {

            openConnection()

            let params = [userId]

            let sql = 'select * from paper where user_id = ? '

            connection.query(sql, params , function (err, res) {

                if (err) {

                    console.log('[GET-MYPAPER-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-MYPAPER-SUCCESS] ')

                console.log(res);

                if (res.length !== 0) {

                    let papers = []

                    for(let i=0; i<res.length; i++){

                        let paper = {

                            paperId: res[i].paper_id,

                            userId: res[i].user_id,

                            starNum: res[i].star_num,

                            likeNum: res[i].like_num,

                            commentNum: res[i].comment_num,

                            title: res[i].title,

                            createTime: res[i].create_time,

                            content: res[i].content,

                        };

                        papers.push(paper)

                    }

                    resolve(JSON.stringify(papers));

                }

                else {

                    console.log('Paper not find');

                    resolve(JSON.stringify({}));

                }

            }),

            closeConnection()
        })
    },

}