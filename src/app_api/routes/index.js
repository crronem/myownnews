
const express = require('express')
const api = express.Router()
const Landing = require('./landing')
const Enquiries = require('./enquiries')
const myKT = require('./myKT')

// function capitalize(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
// }

/*
 * Routes
 */

// Landing
api.get('/', Landing.menu())
api.get('/landing', Landing.menu())

// myMT
api.get('/myKT', myKT.myKT())
api.get('/myKTSignupLogin', myKT.myKTSignupLogin())
api.get('/myKTEnterLogin', myKT.myKTEnterLogin())
api.post('/myKTValidateLogin', myKT.myKTValidateLogin())
api.post('/myKTValidateSignup', myKT.myKTValidateSignup())
api.get('/myKTEnterSignup', myKT.myKTEnterSignup())
api.get('/myKTChangePassword', myKT.myKTChangePassword())
api.post('/myKTSavePassword', myKT.myKTSavePassword())

// Enquiry
api.get('/enquiryMicroApp', Enquiries.enquiryMicroApp())
api.get('/enquirySubscription', Enquiries.enquirySubscription())
api.get('/enquiryAdvertisement', Enquiries.enquiryAdvertisement())
api.get('/enquiryPrintQuote', Enquiries.enquiryPrintQuote())
api.get('/enquiryContactUs', Enquiries.enquiryContactUs())
api.post('/enquirySave', Enquiries.enquirySave())

module.exports = api