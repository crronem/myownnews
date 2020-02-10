const logger = require('debug-level')('myownnews')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const passwordValidator = require('password-validator')

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const Users = require('../models/Model').Users

const { sentenceCase, formatInfo, titleCase } = require('./utility')

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


const myProfile = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            if (data.validated) {
                rootTag = loadTemplate("./src/app_api/forms/myProfile.pug", data)
            } else if (data.username) {
                rootTag = loadTemplate("./src/app_api/forms/myProfileEnterLogin.pug", data)
            } else {
                rootTag = loadTemplate("./src/app_api/menus/myProfileEnterSignup.pug", data)
            }
            logger.info('myProfile')
            logger.info(JSON.stringify(data, {}, 4))
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myProfile() Error------")
            console.log(error)
        }
    }
}

const myProfileSignupLogin = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            if (!data.username){
                rootTag = loadTemplate("./src/app_api/forms/formmyProfileEnterSignup.pug", data)
            } else {
                rootTag = loadTemplate("./src/app_api/forms/formmyProfileEnterLogin.pug", data)
            }
            logger.info('myProfileSignupLogin')
            logger.info(JSON.stringify(data, {}, 4))
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myProfileSignupLogin() Error------")
            console.log(error)
        }
    }
}

const myProfileEnterSignup = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            logger.info('myProfileEnterSignup')
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/forms/formmyProfileEnterSignup.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myProfileEnterSignup() Error------")
            console.log(error)
        }
    }
}

const myProfileEnterLogin = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            logger.info('myProfileLogin')
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/menus/myProfileLogin.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myProfileLogin() Error------")
            console.log(error)
        }
    }
}

const myProfileChangePassword = function () {
    return async function (req, res) {
        let data = {}
        try {
            let rootTag = loadTemplate("./src/app_api/forms/formmyProfileChangePassword.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myProfileChangePassword() Error------")
            console.log(error)
        }
    }
}

const myProfileValidateLogin = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            bcrypt.compare(generatedPassword, data.password).then(async function (err, check) {
                if (err) {
                    data.preBody = "User name or password is incorrect!"
                    data.valid = false
                    rootTag = loadTemplate("./src/app_api/forms/myProfile.pug", data)
                }
                if (check) {
                    data.preBody = "User name or password is incorrect!"
                    data.valid = false
                    rootTag = loadTemplate("./src/app_api/forms/myProfile.pug", data)
                } else {
                    data.valid = true
                    rootTag = loadTemplate("./src/app_api/menu/myProfile.pug", data)
                }
            })
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myProfileChangePassword() Error------")
            console.log(error)
        }
    }
}

const myProfileValidateSignup = function () {
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
                    logger.info('myProfileValidateSignup')
                    logger.info(JSON.stringify(data, {}, 4))
                    data.preBody = "You are now registered.\nRemember your username and password!"
                    
                } else {
                    data.preBody = "The password is not valid"
                    rootTag = loadTemplate("./src/app_api/forms/formmyProfileChangePassword.pug", data)
                }
            } else {
                data.preBody = "There was a problem with your username or password!"
            }
            let rootTag = loadTemplate("./src/app_api/menus/myProfile.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myProfileChangePassword() Error------")
            console.log(error)
        }
    }
}

const myProfileSavePassword = function () {
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
                logger.info('myProfileChangePassword')
                logger.info(JSON.stringify(data, {}, 4))
                data.preBody = "Password successfully changed!"
                rootTag = loadTemplate("./src/app_api/menus/myProfile.pug", data)
            } else {
                data.preBody = "The password is not valid"
                rootTag = loadTemplate("./src/app_api/forms/formmyProfileChangePassword.pug", data)
            }
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----myProfileChangePassword() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    myProfile,
    myProfileSignupLogin,
    myProfileEnterLogin,
    myProfileChangePassword,
    myProfileValidateLogin,
    myProfileValidateSignup,
    myProfileSavePassword,
    myProfileEnterSignup
}