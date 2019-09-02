'use strict';

const {app, BrowserWindow} = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
const querystring = require("querystring");
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '39.105.29.134',
    user     : 'chk',
    password : 'chk237313',
    database : 'cve_poc'
});

// var connection = mysql.createConnection({
//     host     : '127.0.0.1',
//     user     : 'great',
//     password : 'greatwork',
//     database : 'cve'
//   });

// window.addEventListener('report', (msg) => {
//     var user = window.getElementById("user");
//     user.innerHTML=msg;
//     return msg;
// });

//get user name
var msg=window.localStorage.getItem('user');
window.addEventListener('DOMContentLoaded', () => {
    var user = document.getElementById("user");
    user.innerHTML=msg;
});

//query user details
//var name = document.getElementById("user").innerHTML;
var name = msg;
var promise = new Promise(function (resolve, reject) {
    connection.connect();
    connection.query('SELECT * FROM detail where user=\"'+name+'\";', function (error, results) {
        if (error) {reject(error);}
        if(results[0].solution == 0){
            return "no such user";
        }
        let OS = results[0]['OS'], 
        IP = results[0]['IP'],
        detect = results[0]['detect'],
        validate = results[0]['validate'],
        vuls = results[0]['vuls'];
        vuls = vuls.split(',');
        resolve(vuls);

        //write overall information
        document.getElementById("os").appendChild(document.createTextNode(OS));
        document.getElementById("targetIP").appendChild(document.createTextNode(IP));
        document.getElementById("susNum")
        .appendChild(document.createTextNode(String(Number(detect) + Number(validate))));
        document.getElementById("sucNum")
        .appendChild(document.createTextNode(String(Number(validate))));

        window.localStorage.setItem('susNum',Number(detect) + Number(validate));
        window.localStorage.setItem('sucNum',Number(validate));
    });
    return ;
});

var then = promise.then(function (vuls) {
    //write detail information
    var detailDOM = document.getElementById("vulDetail");
    for (let i=0; i<vuls.length; i++){
        let inode = document.createElement("div");
        inode.id="node"+i;

        let vul = querystring.parse(vuls[i]);
        let id = vul['id'];
        let status = vul['status'];
        let staNode = crNode("Status: "+ status);
        inode.className=status;

        let sql = 'SELECT * FROM information WHERE id = '+id;
        connection.query(sql, function(error, results){
            if(error) throw error;
            let res = results[0];
            let CVE = crNode(res['CVE']);
            let Component = crNode(res['Component']);
            let Description = crNode(Buffer(res['Description'],'base64').toString('utf-8'));
            let Score = crNode("Base Score: "+res['Base_Score']);
            let Solution = crNode(Buffer(res['Solutions'],'base64').toString('utf-8'));

            inode.appendChild(staNode);
            inode.appendChild(CVE);
            inode.appendChild(Component);
            inode.appendChild(Description);
            inode.appendChild(Score);
            inode.appendChild(Solution);

            var hr = document.createElement("hr");
            // hr.style="height:1px;border:none;border-top:1px solid #555555;";
            hr.style = "width:80%;margin:0 auto;border: 0;height: 1px;"
            +"background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(233, 186, 140, 0.9), rgba(0, 0, 0, 0));";

            inode.appendChild(hr);
            detailDOM.appendChild(inode);
            console.log(inode);
        })
    }
    return vuls;
}, function (error) {
    console.log("failed");
    throw error;
    return error;
});

function crNode(str)
 {
  var newP=document.createElement("p");
  var newTxt=document.createTextNode(str);
  newP.appendChild(newTxt);
  return newP;
 }
