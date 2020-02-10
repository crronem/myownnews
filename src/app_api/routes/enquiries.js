const logger = require('debug-level')('myownnews')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const Users = require('../models/Model').Users
const Enquiries = require('../models/Model').Enquiries

const { sentenceCase, formatInfo, titleCase } = require('../routes/utility')

const enquiryMicroApp = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/forms/formEnquiryMicroApp.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----enquiryMicroApp() Error------")
            console.log(error)
        }
    }
}

const enquirySubscription = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/forms/formEnquirySubscription.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----enquirySubscription() Error------")
            console.log(error)
        }
    }
}

const enquiryAdvertisement = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/forms/formEnquiryAdvertisement.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----enquiryAdvertisement() Error------")
            console.log(error)
        }
    }
}

const enquiryPrintQuote = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/forms/formEnquiryPrintQuote.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----enquiryPrintQuote() Error------")
            console.log(error)
        }
    }
}

const enquiryContactUs = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Users.findOne({ ONEmUserId: req.user }).lean()
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/forms/formEnquiryContactUs.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----enquiryContactUs() Error------")
            console.log(error)
        }
    }
}

const enquirySave = function () {
    return async function (req, res) {
        let data = {}
        let query = {ONEmUserId:req.user}
        let update = { name: req.body.name, email: req.body.email, mobile: req.body.mobile }
        let options = { new: true, upsert: false }
        try {
            data = await Users.findOneAndUpdate(query,update,options).lean()
            logger.info(JSON.stringify(data, {}, 4))
            await findOneAndUpdate(query, update, options)
            let enquiry = new Enquiries(
                {
                    _user: ObjectId(data._id),
                    interest: req.body.interest,
                    message: req.body.message

                }
            )
            await enquiry.save()
            let rootTag = loadTemplate("./src/app_api/menus/landing.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----enquiryContactUs() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    enquirySave,
    enquiryMicroApp,
    enquirySubscription,
    enquiryAdvertisement,
    enquiryPrintQuote,
    enquiryContactUs
}