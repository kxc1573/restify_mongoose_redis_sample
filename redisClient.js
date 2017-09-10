/**
 * 
 * @authors kxc1573/Alwyn
 * @date    2017-09-10
 * @desc    使用redis访问Redis
 */

var redis = require('redis');

// 可配置项
var host = '127.0.0.1';
var port = 6379;

var client = redis.createClient(port, host, {});

client.on('ready', (res) => {
    console.log('redis ready: ' + res);
});

client.on('error', (err) => {
    console.log('connect redis error: ' + err);
    process.exit(2);
});

// 假设cookie为哈希，token为string
class Session {
    constructor(client) {
        this.client = client;
    }

    // 设置/更新Cookie以及设置/重设有效期，默认10分钟。
    updateCookie(uuid, cookie, t) {
        t = t ? t: 600;    // 默认10分钟
        return new Promise((resolve, reject) => {
            let key = uuid + ':cookie';
            this.client.hmset(key, cookie, (err, res1) => {
                if (err) {
                    console.log('redis hmset error: ' + err);
                    reject(err);
                } else {
                    // 设置有效期
                    this.client.expire(key, t, (err, res2) => {
                        if (err) {
                            console.log('erdis hmset expire error: ' + err);
                            reject(err);
                        } else {
                            resolve(res2 === 1);
                        }
                    });
                }
            });
        });
    }

    // 查询Cookie
    getCookie(uuid) {
        return new Promise((resolve, reject) => {
            let key = uuid + ':cookie';
            this.client.hgetall(key, (err, record) => {
                if (err) {
                    console.log('redis hgetall error: ' + err);
                } else {
                    resolve(record);
                }
            });
        });
    }

    // 设置or更新token，同样设置有效期，默认10分钟
    updateToken(uuid, token, t) {
        t = t ? t : 600;
        return new Promise((resolve, reject) => {
            let key = uuid + ':token';
            this.client.set(key, token, (err, res1) => {
                if (err) {
                    console.log('redis set error: ' + err);
                    reject(err);
                } else {
                    this.client.expire(key, t, (err, res2) => {
                        if (err) {
                            console.log('redis set expire error: ' + err);
                            reject(err);
                        } else {
                            resolve(res2 === 1);
                        }
                    });
                }
            });
        });
    }

    getToken(uuid) {
        return new Promise((resolve, reject) => {
            let key = uuid + ':token';
            this.client.get(key, (err, record) => {
                if (err) {
                    cosole.log('redis get error: ' + err);
                    reject(err);
                } else {
                    resolve(record);
                }
            });
        });
    }

    delUuid(uuid) {
        this.client.del(uuid + ':cookie');
        this.client.del(uuid + ':token');
    }
}

var session = new Session(client);

module.exports =  {
    session: session
};
    