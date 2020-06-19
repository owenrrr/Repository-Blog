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

    add: function (userId, paperId, createTime) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, paperId, createTime];

            let sql = 'insert into `like`  (user_id, paper_id, create_time) values (?, ?, ?);';

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

            let sql = 'delete from `like` where user_id = ? and paper_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[DELETE-FAILED] ' +  err.message);

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

    getUserList: function (paperId) {

        return new Promise((resolve, reject) =>  {

            openConnection();

            let params = [paperId];

            let sql = 'select * from `like` where paper_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-USER-LIST-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-USER-LIST-SUCCESS] ');

                console.log(res);

                resolve(res);

            });

            closeConnection();

        }).then(value => {

            if (value.length !== 0) {

                let total = value.length;

                let userList = [];

                for (let i = 0; i < total; i++) {

                    let user = {

                        userId: value[i].user_id,

                    };

                    userList.push(user);

                }

                return JSON.stringify({

                    total,

                    userList,

                });

            }

            else {

                console.log('UserList is empty!');

                return JSON.stringify({

                    total: 0,

                    userList: [],

                });

            }

        }).catch(err => {

            console.log(err);

        })

    },

    getPaperList: function (userId) {

        return new Promise((resolve, reject) => {

           openConnection();

           let params = [userId];

           let sql = 'select * from `like` where user_id = ?;';

           connection.query(sql, params, function (err, res) {

               if (err) {

                   console.log('[GET-PAPER-LIST-FAILED] ' + err.message);

                   return;

               }

               console.log('[GET-PAPER-LIST-SUCCESS] ');

               console.log(res);

               resolve(res);

           });

           closeConnection();

        }).then(value => {

            console.log("thenthenthen")

            if (value.length !== 0) {

                let total = value.length;

                let paperList = [];

                for (let i = 0; i < total; i++) {

                    paperList.push(value[i].paper_id);

                }

                return new Promise((resolve,reject) => {

                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

                    openConnection();

                    let sql = 'select * from `paper` where paper_id = ?;';

                    let temp = []

                    for(let k=0; k<paperList.length; k++){

                        connection.query(sql,[paperList[k]],function(err,res){

                            if(err){

                                console.log('[GET-PAPER-LIST-Favourite-FAILED] ' + err.message)

                                return;

                            }

                            console.log('[GET-PAPER-LIST-Favourite-SUCCESS] ')

                            temp.push(res)

                        })

                    }

                    resolve(temp)

                    closeConnection()

                })

                /*return JSON.stringify({

                    total,

                    paperList,

                });*/

            }

            else {

                console.log('PaperList is empty');

                return JSON.stringify({

                    total: 0,

                    paperList: [],

                });

            }

        }).then(result => {

            let PaperList = [];

            for(let j=0; j<result.length; j++){
                let tmp = {

                    paperid: result[j].paper_id,

                    userid: result[j].user_id,

                    starnum: result[j].star_num,

                    likenum: result[j].like_num,

                    commentnum: result[j].comment_num,

                    title: result[j].title,

                    createtime: result[j].create_time,

                    content: result[j].content
                }

                PaperList.push(tmp)

            }

            return JSON.stringify({

                PaperList

            })
        }).catch(err => {

            console.log(err);

        });

    }

}
