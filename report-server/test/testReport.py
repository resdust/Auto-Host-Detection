# !/usr/bin/python
# encoding:utf-8

from bs4 import BeautifulSoup
import requests
import json
import re
import random

host = "127.0.0.1"
header = {'content-type': "application/json"}
vuls=[{
    # 漏洞数据库的id
        "id":"234",
        # 检测是否成功
        "status": "success"
    },{
        # 漏洞数据库的id
        "id":"710",
        # 检测是否成功
        "status": "fail"
    },{
        "id":"510",
        "status":"success"
    }]
vuls = []
list = []
for i in range(0,98):
    list.append(random.randint(300,1000))
for i in range(len(list)):
    vul = {"id":list[i], "status":"fail"}
    vuls.append(vul)

vuls[len(vuls)-1]["status"] = "success"
vuls[len(vuls)-1]["id"] = "1000123"
postdata={
    "OS": "Ubuntu18.04",
    "IP": "10.10.10.10",
    # 检测出的漏洞数量
    "detect":9,
    # 验证成功的漏洞数量
    "validate":3,
    "vul":json.dumps(vuls)
}
print(json.dumps(vuls))
def getUser(host):
    r=requests.get('http://'+host+':9080/createUser')
    print(r.text)
    return r.text

def getReport(host,name):
    r=requests.get('http://'+host+':9080/report/'+name)
    print(r.text)

def post(host, name):
    r=requests.post('http://'+host+':9080/detail/'+name ,data=postdata,headers=header)
    print(r.text)

print(postdata["vul"])
# user = getUser(host)
# # soup = BeautifulSoup(user, "html.parser")
# # user = soup.a.text

# print("get username : " + user)
# post(host,user)
# getReport(host,user)

usr = "KSJF83LFSJ"
