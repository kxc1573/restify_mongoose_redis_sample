/**
 * 
 * @authors kxc1573/Alwyn
 * @date    2017-09-10
 * @desc    restify服务器启动入口
 */

var restify = require('restify');

var route = require('./route');

// 可配置项
var addr = '127.0.0.1';
var port = 8888;

var server = restify.createServer({
    name: 'test',
    version: '0.0.1'
});

// 使用插件
server.use(restify.pre.userAgentConnection());          // work around for curl  
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// api route
server.post('/user/update', route.updateUser);
server.get('/user/get', route.getUser);

server.post('/cookie/update', route.updateCookie);
server.get('/cookie/get', route.getCookie);

server.listen(port, addr, function() {
    console.log("server %s is listening on port <%s>", server.name, server.url);
});