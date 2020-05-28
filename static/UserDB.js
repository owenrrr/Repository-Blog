let mysql = require('mysql');

let connection;

function openConnection() {

    connection = mysql.createConnection({

        host: 'localhost',
        user: 'root',
        password: 'owen890628',
        database: 'Blog'

    });

}



function closeConnection() {

    connection.end();

}



module.exports = {

    add: function (username, password, sex, age) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [username, password, sex, age];

            let sql = 'insert into user (user_name, password, sex, age) values (?, ?, ?, ?);';

            connection.query(sql, params, function (err, result) {

                if (err) {

                    console.log('[INSERT-ERROR]' + err.message);

                    return;

                }



                console.log('--------------------------INSERT----------------------------');

                console.log('[INSERT-SUCCESS] the generate user_id is ' + result.insertId);

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

    update: function (userid, username, password, sex, age) {

        return new Promise((resolve, reject) => {

            openConnection();

            let sql = `update user

            set 

            user_name='${username}', 

            password='${password}',

            sex='${sex}',

            age='${age}'

            where user_id='${userid}';`;

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

    get: function (username) {

        console.log(username);

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [username];

            let sql = 'select * from user where user_name = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-FAILED] ' + err.message);

                    return;

                }

                resolve(res);

            });

            closeConnection();

        }).then(value => {

            console.log(value);

            if (value.length !== 0) {

                let user = {

                    userid: value[0].user_id,

                    username: value[0].user_name,

                    password: value[0].password,

                    age: value[0].age,

                    sex: value[0].sex,

                };

                return JSON.stringify(user);

            }

            else {

                console.log('User not find');

                return JSON.stringify({});

            }

        }).catch(err => {

            console.log(err);

        });

    },

    getAll: function(){

        return new Promise(((resolve, reject) => {

            openConnection();

            let sql = 'select * from user;';

            connection.query(sql, function (err, res) {

                if (err) {

                    console.log('[GETALL-FAILED] ' + err.message);

                    return;

                }

                if (res) {

                    resolve(res);



                    console.log('[GETALL-SUCCESS]');

                    console.log(res);

                }

            });

            closeConnection();

        })).then(value => {

            if (value.length !== 0) {

                let users = [];

                let total = value.length;

                for (let i = 0; i < total; i++) {

                    let user = {

                        userid: value[i].user_id,

                        username: value[i].user_name,

                        password: value[i].password,

                        sex: value[i].sex,

                        age: value[i].age

                    };

                    users.push(user);

                }

                return JSON.stringify({

                    total: total,

                    users: users

                });

            }

            else {

                console.log('Users not find');

                return JSON.stringify({

                    total: 0,

                    users: []

                })

            }

        }).catch(err => {

            console.log(err);

        });

    }

};
