const { Client } = require("pg");

const host = process.env.HOST;
const user = process.env.USER;
const port = process.env.PORT;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;
const client = new Client({
   host: host,
   user: user,
   port: port,
   password: password,
   database: database,
});

module.exports = client;
