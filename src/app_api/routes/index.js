
const express = require('express')
const api = express.Router()
const Landing = require('./landing')
const Enquiries = require('./enquiries')
const myProfile = require('./myProfile')

// function capitalize(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
// }

/*
 * Routes
 */

// Landing
api.get('/', Landing.menu())
api.get('/landing', Landing.menu())

// myProfile
api.get('/myProfile', myProfile.myProfile())
api.get('/myProfileSignupLogin', myProfile.myProfileSignupLogin())
api.get('/myProfileEnterLogin', myProfile.myProfileEnterLogin())
api.post('/myProfileValidateLogin', myProfile.myProfileValidateLogin())
api.post('/myProfileValidateSignup', myProfile.myProfileValidateSignup())
api.get('/myProfileEnterSignup', myProfile.myProfileEnterSignup())
api.get('/myProfileChangePassword', myProfile.myProfileChangePassword())
api.post('/myProfileSavePassword', myProfile.myProfileSavePassword())

// Enquiry
api.get('/enquiryMicroApp', Enquiries.enquiryMicroApp())
api.get('/enquirySubscription', Enquiries.enquirySubscription())
api.get('/enquiryAdvertisement', Enquiries.enquiryAdvertisement())
api.get('/enquiryPrintQuote', Enquiries.enquiryPrintQuote())
api.get('/enquiryContactUs', Enquiries.enquiryContactUs())
api.post('/enquirySave', Enquiries.enquirySave())

module.exports = api