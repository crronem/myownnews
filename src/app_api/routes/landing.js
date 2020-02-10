const logger = require('debug-level')('myownnews')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const Users = require('../models/Model').Users

const { sentenceCase, formatInfo, titleCase } = require('../routes/utility')

const menu = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        let query = { ONEmUserId: req.user }
        let update = { ONEmUserId: req.user, name: null, email: null, mobile: null, validated: false }
        let options = { new: true, upsert: true }
        logger.info('menu req')
        logger.info(req.method)
        try {
            data = await Users.findOne(query).lean()
            if (!data) {
                data = await Users.findOneAndUpdate(query,update,options).lean()
            }
            logger.info('menu')
            logger.info(JSON.stringify(data, {}, 4))
            if (data.validated) {
                rootTag = loadTemplate("./src/app_api/menus/myProfile.pug", data)
            } else if (data.username) {
                rootTag = loadTemplate("./src/app_api/forms/myProfileEnter.pug", data)
            } else {
                rootTag = loadTemplate("./src/app_api/menus/landing.pug", data)
            }
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----Landing() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    menu
}