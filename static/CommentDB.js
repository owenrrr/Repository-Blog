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

}