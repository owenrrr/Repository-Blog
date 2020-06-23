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

    update: function (userid, username, password, description, sex, age, imgURL) {

        return new Promise((resolve, reject) => {

            openConnection();

            let sql = `update user

            set 

            user_name='${username}', 

            password='${password}',

            description='${description}',

            sex='${sex}',

            age='${age}',
            
            imgURL='${imgURL}'

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

                    console.log('[GET-USER-FAILED] ' + err.message);

                    return;

                }

                console.log('[GET-USER-SUCCESS] ')

                resolve(res);

            });

            closeConnection();

        }).then(value => {


            if (value.length !== 0) {

                let user = {

                    userid: value[0].user_id,

                    username: value[0].user_name,

                    password: value[0].password,

                    description: value[0].description,

                    age: value[0].age,

                    sex: value[0].sex,

                    imgURL: value[0].imgURL

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

                    userId: res.user_id,

                    username: res.user_name,

                    password: res.password,

                    description: res.description,

                    age: res.age,

                    sex: res.sex,

                    imgURL: res.imgURL

                };

                resolve(user)

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

                                userid: res[i].user_id,

                                username: res[i].user_name,

                                password: res[i].password,

                                description: res[i].description,

                                sex: res[i].sex,

                                age: res[i].age,

                                imgURL: res[i].imgURL

                            };

                            users.push(user);

                            resolve(users)

                        }

                    }

                    else {

                        console.log('Users not find');

                        resolve(
                            []
                        )

                    }



                }

            });

            closeConnection();

        }))

    }

};
