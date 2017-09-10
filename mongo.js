/**
 * 
 * @authors kxc1573/Alwyn
 * @date    2017-09-10
 * @desc    使用mongoose访问MongoDB
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 使用node的Promise替换mongoose的Promise,否则会报错
mongoose.Promise = global.Promise;

// 可配置项
var host = '127.0.0.1';
var port = 27017;
var dbName = 'test';

var dbUri = `${host}:${port}/${dbName}`;
var dbConnection = mongoose.createConnection(dbUri);
dbConnection.on('error', (err) => {
    console.log('connect mongodb failed: ' + err);
    process.exit(1);
});

var dbSchemas = {
    // 定义user的Schema
    // 包括身份证号码、姓名、性别、手机等
    userSchema: {
        idno: {type: String, require: true, unique: true},
        name: {type: String, require: true},
        gender: {type: Number, require: true},
        phone: {type: String},
        created: {type: Date, default: Date.now}
    }
};

// 定义UserModel
class UserModel {
    constructor(connection, schema) {
        this.name = 'user';
        this.schema = new Schema(schema);
        this.model = connection.model(`userModel`, this.schema, this.name);
    }

    // 封装查询
    findByIdno(idno) {
        return new Promise((resolve, reject) => {
            this.model.findOne({'idno': {$eq: idno}}, (err, record) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(record);
                }
            });
        });
    }

    // 封装插入or更新
    insertOrUpdateByIdno(data) {
        return new Promise((resolve, reject) => {
            this.model.findOne({'idno': {$eq: data.idno}}, (err, record) => {
                if (err) {
                    reject(err);
                } else {
                    if (record == undefined) {
                        // 插入
                        var instance = new this.model(data);
                        instance.save((err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resovle(data);
                            }
                        });
                    } else {
                        // 更新
                        this.model.findOneAndUpdate({'idno': {$eq: data.idno}}, data, {new: true, upsert: true}, (err, res) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(res);
                            }
                        });
                    }
                }
            });
        });
    }
}

var user = new UserModel(dbConnection, dbSchemas.userSchema);

exports.user = user;