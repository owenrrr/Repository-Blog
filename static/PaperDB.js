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

    add: function (userid, title, createTime, content) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userid, title, createTime, content];

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

                resolve(result.insertId);

            });

            closeConnection()

        }).then(value => {

            console.log(value);

            return JSON.stringify(value);

        }).catch(err => {

            console.log(err);

        })

    },

    get: function (paperid) {

        console.log(paperid);

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [paperid];

            let sql = 'select * from paper where paper_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-PAPER-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-PAPER-SUCCESS] ')

                console.log(res);

                resolve(res);

            });

            closeConnection();

        }).then(value => {

            console.log(value);

            if (value.length !== 0) {

                let paper = {

                    paperid: value[0].paper_id,

                    userid: value[0].user_id,

                    starnum: value[0].star_num,

                    likenum: value[0].like_num,

                    commentnum: value[0].comment_num,

                    title: value[0].title,

                    createtime: value[0].create_time,

                    content: value[0].content,

                };

                return JSON.stringify(paper);

            }

            else {

                console.log('Paper not find');

                return JSON.stringify({});

            }

        }).catch(err => {

            console.log(err);

        });

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

                                paperid: res[i].paper_id,

                                userid: res[i].user_id,

                                starnum: res[i].star_num,

                                likenum: res[i].like_num,

                                commentnum: res[i].comment_num,

                                title: res[i].title,

                                createtime: res[i].create_time,

                                content: res[i].content,

                            };

                            papers.push(paper);

                            resolve({

                                total: total,

                                papers: papers,

                            })

                        }

                    }

                    else {

                        console.log('Papers not find');

                        resolve({

                            total: 0,

                            papers: []

                        })

                    }

                }

            });

            closeConnection();

        }))

    },

    //paper upadte

    update: function (paperid, userid, starnum, likenum, commentnum, title, createtime, content) {

        return new Promise((resolve, reject) => {

            openConnection();

            let sql = `update paper

            set 

            user_id='${userid}',

            star_num='${starnum}',

            like_num='${likenum}',

            comment_num='${commentnum}',
            
            title='${title}',

            create_time = '${createtime}',

            content='${content}'

            where paper_id='${paperid}';`;

            connection.query(sql, function (err, res) {

                if (err) {

                    console.log('[UPDATE-ERROR]' + err.message);

                    return;

                }

                console.log('[UPDATE-SUCCESS] ' + res.affectedRows);

                resolve();

            });

            closeConnection();

        }).then(() => {

            console.log('success update');

        }).catch((err) => {

            console.log(err);

        });

    },

}