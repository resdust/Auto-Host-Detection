'use strict'
var mysql = require('mysql');
var
    http = require('http'),
    url = require('url');

var connection = mysql.createConnection({
    host     : '39.105.29.134',
    user     : 'chk',
    password : 'chk237313',
    database : 'cve_poc'
});

var pathname="/report/123";
var name="test";
var token="test";

function start(){
    var server = http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname;
        var host = request.headers['host'];
        if (request.method == "POST"){
            var user = pathname.split('/')[2];
            console.log("user:" + user);
            revData(request, response, user);
          }
        });
    server.listen(9080, '0.0.0.0');
    console.log('Server is running at http://127.0.0.1:9080/');
    }


//start();


connection.connect();
console.log("mysql has connnected");
connection.end();
console.log("mysql has colsed");
