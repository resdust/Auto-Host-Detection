'use strict';

var electron = require('electron'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    ipcRenderer = electron.ipcRenderer,
    ipcMain = electron.ipcMain;
var mysql = require('mysql');
const crypto = require('crypto');
const hash = crypto.createHash('md5');
const querystring = require("querystring");
const remote = require('electron').remote;
const Window = remote.require('./main').mainWindow;


var sqldata = ({
    host     : '39.105.29.134',
    user     : 'chk',
    password : 'chk237313',
    database : 'cve_poc'
});

// var sqldata={
//   host     : '127.0.0.1',
//   user     : 'great',
//   password : 'greatwork',
//   database : 'cve'
// };

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  } ;
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});

function start(){
  var server = http.createServer();
  server.on('request', function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var host = request.headers['host'];
    console.log(request.method + ' ' + pathname);
    if (request.method == "GET"){
      if (pathname.match(/createUser/)){
        createUser(request, response);
      }else if(pathname.match(/report/)){
        var user = pathname.toString().split('/')[2];
        ipcRenderer.send('genReport',user);
      }else{
        visitCreate(request, response, host);
      }
    } else if (request.method == "POST"){
      var user = pathname.split('/')[2];
      console.log("user:" + user);
      revData(request, response, user);
    }
  });
  server.listen(9080, '0.0.0.0');
  console.log('Server is running at http://127.0.0.1:9080/');
}

exports.start = start;

function createUser(request,response) {
  var name = getName();
  var token = getToken(name);
  var clientIP = getClientIp(request);
  var host = request.headers['host'];
  console.log(clientIP + " => " + name + ":" + token);
  
  // insert into database
  let connection = mysql.createConnection(sqldata);
  connection.connect();
  connection.query('INSERT INTO detail (`user`) VALUES(\"'+name+'\");', 
  function (error, results, fields) {
    if (error) throw error;
    console.log("insert name "+name);
  });
  connection.end();

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write('<p>Your IP is: ' + clientIP + ',we have a name for you: <a>' + name + '</a></p>');
  response.write('<p>Post your data to ' + host+ '/detail/' + name +' </p>');
  response.write('<p>Then visit <a href=\"http://' + host + '/report/' + name + '\">here</a> for your report.</p>');
  response.end('');
}

function visitCreate(request, response, host){
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end('<p>Please visit <a href=\"http://' + host + '/createUser\">here</a> to create a user.')
}

function revData(req, res, user){
  var host = req.headers['host'];
  var str = "";//接收数据用
  //data有一段数据到达（重复很多次）
  req.on('data',function(data){
  str+=data;
  });
  //数据全部到达（一次）
  req.on('end',function(){
  var POST = querystring.parse(str);
  console.log(POST);
  var vuls = JSON.parse(POST['vul']);
  var OS = POST['OS'];
  var IP = POST['IP'];
  var detect = POST['detect'];
  var validate = POST['validate'];
  var vul = new Array();
  for (let i = 0; i<vuls.length; i++){
    let t = querystring.stringify(vuls[i]);
    vul.push(t);
  }

  let connection = mysql.createConnection(sqldata);
  connection.connect();
  var sqlUser = 'select * from detail where user = \"' + user + '\";';
  connection.query(sqlUser,function (error, results) {
      if (error) throw error;
      if (results[0] == null) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<p>wrong username!</p>');
        res.end('<p>Please visit <a href=' + host + '/createUser >here</a> to create user.');
        return;
      }
    });
  var insert = 'UPDATE detail SET OS=\"'+OS+
  '\", ip=\"'+IP+'\", detect=\"'+String(detect)+
  '\", validate=\"'+String(validate)+ '\", vuls=\"'+vul+'\" WHERE USER= \"'+ user + '\";';
  connection.query(insert,(error, results)=>{
    if(error) throw error;
  });
  connection.end();
  });
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<p>Visit <a href=\"http://' + host + '/report/' + user + '\">here</a> for your report.</p>');
  res.end('');

  // remote.app.report(user);
  window.localStorage.setItem('user', user);
  return;
}

var getName = () => {
  const startChar = 65;
  let allChars = [];
  for ( let i = 0; i < 26; i++) {
      allChars.push(String.fromCharCode(startChar+i));
  }
  allChars = allChars.join("");
  let dict = allChars + "0123456789";
  let name = "";
  for (let i = 0; i < 10; i++){
      let randNum = Math.ceil(Math.random()*(dict.length-1));
      name += dict[randNum];
  }
  return name;
}

var getToken = (name) => {
  let token = name + "great";
  hash.update(token);
  token = hash.digest('hex');
  return token;
}

function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;
};
