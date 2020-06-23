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

            let sql = 'insert into favorite (user_id, paper_id, create_time) values (?, ?, ?);';

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

        })

    },

    remove: function (userId, paperId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, paperId];

            let sql = 'delete from favorite where user_id = ? and paper_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[DELETE-FAVORITE-FAILED] ' + err.message);

                    return;

                }

                console.log('[DELETE-FAVORITE-SUCCESS] ');

                console.log(res);

                resolve(res);

            });

            closeConnection();

        }).then(value => {

            console.log(value);

            return JSON.stringify(value);

        }).catch(err => {

            console.log(err);

        })

    },

    getPaperList: function (userId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId];

            let sql = 'select * from `favorite` where user_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-FAVORITE-PAPER-LIST-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-FAVORITE-PAPER-LIST-SUCCESS] ');

                console.log(res);

                resolve(res);

            });

            closeConnection();

        }).then(value => {

            if (value.length !== 0) {

                let total = value.length;

                let paperList = [];

                for (let i = 0; i < total; i++) {

                    paperList.push(value[i].paper_id);

                }

                return JSON.stringify({

                    paperList

                })

            }

            else {

                console.log('PaperList is empty');

                return JSON.stringify({

                    total: 0,

                    paperList: [],

                });

            }

        }).catch(err => {

            console.log(err);

        });

    },

    getUserList: function (paperId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [paperId];

            let sql = 'select * from favorite where paper_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-FAVORITE-USER-LIST-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-FAVORITE-USER-LIST-SUCCESS]');

                console.log(res);

                resolve(res);

            })

            closeConnection();

        }).then(value => {

            if (value.length !== 0) {

                let total = value.length;

                let userList = [];

                for (let i = 0; i < total; i++) {

                    let user = {

                        userId: value[i].user_id,

                    }

                    userList.push(user);

                }

                return JSON.stringify({

                    total,

                    userList

                });

            }

            else {

                console.log('UserList is empty');

                return JSON.stringify({

                    total: 0,

                    userList: []

                });

            }

        }).catch(err => {

            console.log(err);

        })

    }
}