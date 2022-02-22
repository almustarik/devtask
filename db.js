const { Client } = require("pg");

const client = new Client({
   host: "localhost",
   user: "postgres",
   port: 5432,
   password: "nahid",
   database: "devtask",
});

module.exports = client;
