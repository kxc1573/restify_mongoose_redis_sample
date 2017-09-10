/**
 * 
 * @authors kxc1573/Alwyn
 * @date    2017-09-10
 * @desc    route for app and db
 */

var user = require('./mongo').user;
var session = require('./redisClient').session; 

// 创建/更新user
// post的数据通过req.body传递
// 此处约定使用json格式，bodyParser可解析
exports.updateUser = function(req, res) {
    // 此处省略数据合法性的检查
    let data = {
        idno: req.body.idno,
        name: req.body.name,
        gender: req.body.gender,
        phone: req.body.phone
    };

    // 设置response为utf-8编码
    res.charSet('utf-8');   
    // 设置返回数据格式为json
    res.setHeader('Content-Type', 'application/json');
    user.insertOrUpdateByIdno(data)
        .then(function(record) {
            res.send({code: 0, msg: '创建/更新user成功', result: record});
        }, function(err) {
            console.log(err);
            res.send({code: 1, msg: '创建/更新user失败', result: {}});
        });
};

// 查询user
// get的参数直接在url中，queryParser可解析
exports.getUser = function(req, res) {
    let idno = req.query.idno;
    // 设置response为utf-8编码
    res.charSet('utf-8');   
    // 设置返回数据格式为json
    res.setHeader('Content-Type', 'application/json');
    user.findByIdno(idno)
        .then(function(record) {
            res.send({code: 0, msg: 'user查询成功', result: record});
        }, function(err) {
            console.log(err);
            res.send({code: 1, msg: 'user查询失败', result: {}});
        });
};

// 设置/更新Cookie
// post提交的数据，有uuid为更新，没uuid为新建
exports.updateCookie = function(req, res) {
    let uuid = req.body.uuid ? req.body.uuid : genUuid();
    let cookie = req.body;
    delete cookie.uuid;
    res.charSet('utf-8');
    res.setHeader('Content-Type', 'application/json');
    session.updateCookie(uuid, cookie)
        .then(function(r) {
            res.send({code: 0, msg: '更新/新建Cookie成功', 
                result: {uuid: uuid, data: cookie}});
        }, function(e) {
            console.log(e);
            res.send({code: 1, msg: '更新/新建Cookie成功', result: {}});
        });
};

exports.getCookie = function(req, res) {
    let uuid = req.query.uuid;
    res.charSet('utf-8');
    res.setHeader('Content-Type', 'application/json');
    session.getCookie(uuid)
        .then(function(record) {
            res.send({code: 0, msg: '获取Cookie成功', result: record});
        }, function(err) {
            console.log(err);
            res.send({code: 1, msg: '获取Cookie失败', result: {}});
        });
};

function genUuid() {
    return Math.random().toString() + Math.random().toString();
}