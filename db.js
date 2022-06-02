"use strict";
exports.__esModule = true;
exports.pool = void 0;
var pg_1 = require("pg");
var Pool = pg_1["default"].Pool;
exports.pool = new Pool({
    user: 'gustavo',
    database: 'blueocean',
    password: 'program25056',
    port: 5432,
    host: 'localhost'
});
