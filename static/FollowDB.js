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

    add: function (userId, followId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, followId];

            let sql = 'insert into follow (user_id, follow_user_id) values (?, ?);';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[INSERT-FOLLOW-FAILED] ' + err.message);

                    return;

                }

                console.log('[INSERT-SUCCESS] the generate FollowId is ' + res.insertId);

                resolve(JSON.stringify(res.insertId));

            });

            closeConnection();

        });

    },

    remove: function (userId, followId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId, followId];

            let sql = 'delete from follow where user_id = ? and follow_user_id = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[DELETE-FOLLOW-FAILED] ' + err.message);

                    return;

                }

                console.log('[DELETE-FOLLOW-SUCCESS] ');

                console.log(res);

                resolve(JSON.stringify(res));

            });

            closeConnection();

        });

    },


    getFollows: function (userId) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [userId];

            let sql = 'select * from follow where user_id = ?;';

            connection.query(sql, params, function(err, res) {

                if (err) {

                    console.log('[GET-FAVORITE-FOLLOW-LIST-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-FOLLOW-USER-LIST-SUCCESS]');

                console.log(res);

                if (res.length !== 0) {

                    let userList = []

                    for(let i = 0; i<res.length; i++){

                        let followId = res[i].follow_user_id;

                        userList.push(followId);

                    }

                    resolve( JSON.stringify(

                        userList

                    ));

                }

                else{

                    console.log('FollowList is empty');

                    resolve( JSON.stringify(

                        []

                    ));

                }

            });

        });

    }

}