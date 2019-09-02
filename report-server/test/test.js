const querystring = require("querystring");
const qs = require('qs');
var data = "id=234&status=sucess,id=310&status=fail,id=210&status=success"
data = data.split(',');
for(let i=0;i<data.length;i++){
    console.log(querystring.parse(data[i]))
}
