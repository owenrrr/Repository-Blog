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

                resolve(JSON.stringify(res.insertId));

            });

            closeConnection();

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

                resolve(JSON.stringify(res));

            });

            closeConnection();

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

                if (res.length !== 0) {

                    let total = res.length;

                    let paperList = [];

                    for (let i = 0; i < total; i++) {

                        paperList.push(res[i].paper_id);

                    }

                    resolve( JSON.stringify(

                        paperList

                    ))

                }

                else {

                    console.log('PaperList is empty');

                    resolve( JSON.stringify(

                        []

                    ));

                }

            });

            closeConnection();

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

                if (res.length !== 0) {

                    let total = res.length;

                    let userList = [];

                    for (let i = 0; i < total; i++) {

                        let userId = res[i].user_id;


                        userList.push(userId);

                    }

                    resolve( JSON.stringify(

                        userList

                    ));

                }

                else {

                    console.log('UserList is empty');

                    resolve( JSON.stringify(

                        []

                    ));

                }

            })

            closeConnection();

        })

    }
}