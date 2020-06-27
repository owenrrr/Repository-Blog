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

    add: function (username, password, email, color) {

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [username, password, email, color];

            let sql = 'insert into user (user_name, password, email, color) values (?, ?, ?, ?);';

            connection.query(sql, params, function (err, result) {

                if (err) {

                    console.log('[INSERT-ERROR]' + err.message);

                    return;

                }



                console.log('--------------------------INSERT----------------------------');

                console.log('[INSERT-SUCCESS] the generate user_id is ' + result.insertId);

                console.log('INSERT ID:',result);

                console.log('-----------------------------------------------------------------\n\n');

                resolve(JSON.stringify(result.insertId));

            });

            closeConnection()

        })

    },

    update: function (userid, username, password, description, sex, age) {

        return new Promise((resolve, reject) => {

            openConnection();

            let sql = `update user

            set 

            user_name='${username}', 

            password='${password}',

            description='${description}',

            sex='${sex}',

            age='${age}'

            where user_id='${userid}';`;

            connection.query(sql, function (err, res) {

                if (err) {

                    console.log('[UPDATE-USER-ERROR]' + err.message);

                    return;

                }

                console.log('[UPDATE-USER-SUCCESS] ' + res.affectedRows);

                resolve();

            });

            closeConnection();

        })

    },

    get: function (email) {

        console.log(email);

        return new Promise((resolve, reject) => {

            openConnection();

            let params = [email];

            let sql = 'select * from user where email = ?;';

            connection.query(sql, params, function (err, res) {

                if (err) {

                    console.log('[GET-USER-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-USER-SUCCESS] ')

                if (res.length !== 0) {

                    let user = {

                        userId: res[0].user_id,

                        userName: res[0].user_name,

                        password: res[0].password,

                        description: res[0].description,

                        age: res[0].age,

                        sex: res[0].sex,

                        color: res[0].color,

                        email: res[0].email

                    };

                    resolve(JSON.stringify(user));

                }

                else {

                    console.log('User not find');

                    resolve(JSON.stringify({}));

                }

            });

            closeConnection();

        })

    },

    getById: function(userId) {

        return new Promise((resolve, reject) => {

            console.log('get_by_id')

            console.log(userId)

            openConnection();

            let param = [userId];

            let sql = 'select * from user where user_id = ?;';

            connection.query(sql, param, function (err, res) {

                if (err) {

                    console.log('[GET-USER_BY-ID-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-USER-BY-ID-SUCCESS] ')

                console.log(res);

                let user = {

                    userId: res[0].user_id,

                    userName: res[0].user_name,

                    password: res[0].password,

                    description: res[0].description,

                    age: res[0].age,

                    sex: res[0].sex,

                    color: res[0].color,

                    email: res[0].email

                };

                resolve(JSON.stringify(user))

            })

            closeConnection();

        })

    },

    getAll: function(){

        return new Promise(((resolve, reject) => {

            openConnection();

            let sql = 'select * from user;';

            connection.query(sql, function (err, res) {

                if (err) {

                    console.log('[GET-ALL-USER-FAILED] ' + err.message);

                    return;

                }

                if (res) {

                    console.log('[GET-ALL-USER-SUCCESS]');

                    if (res.length !== 0) {

                        let users = [];

                        let total = res.length;

                        for (let i = 0; i < total; i++) {

                            let user = {

                                userId: res[i].user_id,

                                userName: res[i].user_name,

                                password: res[i].password,

                                description: res[i].description,

                                sex: res[i].sex,

                                age: res[i].age,

                                color: res[i].color,

                                email: res[i].email

                            };

                            users.push(user);


                        }
                        resolve(JSON.stringify(users))


                    }

                    else {

                        console.log('Users not find');

                        resolve(
                            JSON.stringify([])
                        )

                    }

                }

            });

            closeConnection();

        }))

    }

};
