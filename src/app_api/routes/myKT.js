const logger = require('debug-level')('myownnews')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const passwordValidator = require('password-validator')

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const Users = require('../models/Model').Users

const { sentenceCase, formatInfo, titleCase } = require('../routes/utility')

const pwSchema = new passwordValidator()
pwSchema
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces();

const unSchema = new passwordValidator()
unSchema
    .is().min(4)
    .is().max(20)
    .has().not().spaces();


const myKT = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            if (data.validated) {
                rootTag = loadTemplate("./src/app_api/forms/myKT.pug", data)
            } else if (data.username) {
                rootTag = loadTemplate("./src/app_api/forms/myKTEnterLogin.pug", data)
            } else {
                rootTag = loadTemplate("./src/app_api/menus/myKTEnterSignup.pug", data)
            }
            logger.info('myKT')
            logger.info(JSON.stringify(data, {}, 4))
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myKT() Error------")
            console.log(error)
        }
    }
}

const myKTSignupLogin = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            if (!data.username){
                rootTag = loadTemplate("./src/app_api/forms/formMyKTEnterSignup.pug", data)
            } else {
                rootTag = loadTemplate("./src/app_api/forms/formMyKTEnterLogin.pug", data)
            }
            logger.info('myKTSignupLogin')
            logger.info(JSON.stringify(data, {}, 4))
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myKTSignupLogin() Error------")
            console.log(error)
        }
    }
}

const myKTEnterSignup = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            logger.info('myKTEnterSignup')
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/forms/formMyKTEnterSignup.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myKTEnterSignup() Error------")
            console.log(error)
        }
    }
}

const myKTEnterLogin = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            logger.info('myKTLogin')
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/menus/myKTLogin.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myKTLogin() Error------")
            console.log(error)
        }
    }
}

const myKTChangePassword = function () {
    return async function (req, res) {
        let data = {}
        try {
            let rootTag = loadTemplate("./src/app_api/forms/formMyKTChangePassword.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myKTChangePassword() Error------")
            console.log(error)
        }
    }
}

const myKTValidateLogin = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            bcrypt.compare(generatedPassword, data.password).then(async function (err, check) {
                if (err) {
                    data.preBody = "User name or password is incorrect!"
                    data.valid = false
                    rootTag = loadTemplate("./src/app_api/forms/myKT.pug", data)
                }
                if (check) {
                    data.preBody = "User name or password is incorrect!"
                    data.valid = false
                    rootTag = loadTemplate("./src/app_api/forms/myKT.pug", data)
                } else {
                    data.valid = true
                    rootTag = loadTemplate("./src/app_api/menu/myKT.pug", data)
                }
            })
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myKTChangePassword() Error------")
            console.log(error)
        }
    }
}

const myKTValidateSignup = function () {
    return async function (req, res) {
        let data = {}
        let username = null
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            if (unSchema.validate(req.body.username)) {
                username = req.body.username.toLowerCase()
                if (pwSchema.validate(req.body.password)) {
                    bcrypt.hash(generatedPassword, SALT_WORK_FACTOR).then(async function (hash) {
                        update = { password: hash, username: username }
                        data = await Users.findOneAndUpdate(query, update, options).lean()
                    })
                    logger.info('myKTValidateSignup')
                    logger.info(JSON.stringify(data, {}, 4))
                    data.preBody = "You are now registered.\nRemember your username and password!"
                    
                } else {
                    data.preBody = "The password is not valid"
                    rootTag = loadTemplate("./src/app_api/forms/formMyKTChangePassword.pug", data)
                }
            } else {
                data.preBody = "There was a problem with your username or password!"
            }
            let rootTag = loadTemplate("./src/app_api/menus/myKT.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myKTChangePassword() Error------")
            console.log(error)
        }
    }
}

const myKTSavePassword = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        let query = { ONEmUserId: req.user }
        let update = {}
        let options = { new: true, upsert: false }
        try {
            if (pwSchema.validate(req.body.password)) {
                bcrypt.hash(generatedPassword, SALT_WORK_FACTOR).then(async function (hash) {
                    update = { password: hash }
                    data = await Users.findOneAndUpdate(query, update, options).lean()
                })
                logger.info('myKTChangePassword')
                logger.info(JSON.stringify(data, {}, 4))
                data.preBody = "Password successfully changed!"
                rootTag = loadTemplate("./src/app_api/menus/myKT.pug", data)
            } else {
                data.preBody = "The password is not valid"
                rootTag = loadTemplate("./src/app_api/forms/formMyKTChangePassword.pug", data)
            }
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myKTChangePassword() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    myKT,
    myKTSignupLogin,
    myKTEnterLogin,
    myKTChangePassword,
    myKTValidateLogin,
    myKTValidateSignup,
    myKTSavePassword,
    myKTEnterSignup
}