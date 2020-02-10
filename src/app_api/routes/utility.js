const moment = require("moment")
const logger = require('debug-level')('myownnews')

function makeAorAn(x) {
    if (["a","e","i","o","u"].includes(x[0].toLowerCase())) {
        return "an "+x
    } else {
        return "a "+x
    }
}

function makeEmailMessage(bodyObj) {
    let message = ""
    if (bodyObj.user.name) {
        message = "Dear " + bodyObj.user.name + ",\n\n"
    } else if (bodyObj.type !== "guest") {
        message = "Dear ONEm micro-app " + bodyObj.type + " visitor,\n\n"
    } else {
        message = "Dear ONEm micro-app visitor,\n\n"
    }
    //message += bodyObj.quote + "\n\n"

    if (bodyObj.form.objective == "companycontactus") {
        message += "Thank you for your " + bodyObj.type + " enquiry.\n"
        if (bodyObj.form.enquiry)
            message += "\nYou contacted us about the subject " + bodyObj.form.enquiry.toLowerCase() + ".\n\n"
        if (bodyObj.form.contactMethod && bodyObj.form.contactId) {
            message += "\nYou suggested to contact you by " + bodyObj.form.contactMethod + " using "+bodyObj.form.contactId + ".\n\n"
        } else if (bodyObj.form.contactMethod) {
            message += "\nYou suggested to contact you by" + bodyObj.form.contactMethod + ".\n\n"
        }
        //message += "\nYour message:\n" + bodyObj.form.message
    } else if (bodyObj.form.objective == "companypartner") {
        message += "\nThank you for your " + bodyObj.type + " enquiry.\n"
        if (bodyObj.type == "business") {
            message += "\nYou indicated that you would be interested in a business partnership " + bodyObj.form.enquiry.toLowerCase() + ".\n"
        } else if (bodyObj.type == "investor") {
            message += "\nYou indicated that you would be interested in an investor partnership " + bodyObj.form.enquiry.toLowerCase() + ".\n"
        } else if (bodyObj.type == "developer") {
            message += "\nYou indicated that you would be interested in a developer partnership " + bodyObj.form.enquiry.toLowerCase() + ".\n"
        }
        if (bodyObj.user.name && (bodyObj.user.email || bodyObj.user.mobile)) {
            message += "\nWe will attempt to contact you regarding this matter based on your contact information you provided.\n"
        } else {
            message += "\nYou will need to update your contact information after which we will attempt to contact you.\n"
        }
    } else if (bodyObj.form.objective == "developerwant") {
        message += "\nThank you for your " + bodyObj.type + " enquiry.\n"
        if (bodyObj.type == "business") {
            message += "\nYou indicated that as a business you would be interested in a developer "
            message += "to develop a micro-app in the " + bodyObj.form.category.toLowerCase() + " industry.\n"
            message += "\nThe developer should provide " + makeList(bodyObj.form.tasks) + " functionality in your micro-app.\n"
        } else if (bodyObj.type == "investor") {
            message += "\nYou indicated that as a investor you would be interested in a developer "
            message += "to develop a micro-app in the " + bodyObj.form.category.toLowerCase() + " industry.\n"
            message += "\nThe developer should provide " + makeList(bodyObj.form.tasks) + " functionality in your micro-app.\n"
        } else if (bodyObj.type == "developer") {
            message += "\nYou indicated that as a developer you would be interested in another developer "
            message += "to develop for you a micro-app in the " + bodyObj.form.category.toLowerCase() + " industry.\n"
            message += "\nThis developer should provide " + makeList(bodyObj.form.tasks) + " functionality in your micro-app.\n"
        }
        if (bodyObj.user.name && (bodyObj.user.email || bodyObj.user.mobile)) {
            message += "\nWe will attempt to contact you regarding this matter based on the contact information you provided.\n"
        } else {
            message += "\nYou will need to update your contact information after which we will attempt to contact you.\n"
        }
    } else if (bodyObj.form.objective == "existingshareholder") {
        message += "Thank you for contacting us to register as a shareholder.\n"
        if (bodyObj.form.name && bodyObj.form.email && bodyObj.form.mobile && bodyObj.form.address) {
            message += "\nWe will go review your information and will give you priviledged access upon authenticating the information you provided.\n\n"
            message += "\nThis is your shareholder contact information you provided:\n\n"
            message += "Full name: " + bodyObj.form.name + "\n"
            message += "Email: " + bodyObj.form.email + "\n"
            message += "Mobile: " + bodyObj.form.mobile + "\n"
            message += "Address: " + bodyObj.form.address + "\n"
        } else {
            message += "Required information is missing required for authenticating you as a shareholder.\n"
            message += "This is the referral information you provided:\n"
            if (bodyObj.form.name) {
                message += "Full name: " + bodyObj.form.name + "\n"
            } else {
                message += "Full name: (missing and is required!)\n"
            }
            if (bodyObj.form.email) {
                message += "Email: " + bodyObj.form.form.email + "\n"
            } else {
                message += "Email: (missing and is required!)\n"
            }
            if (bodyObj.form.mobile) {
                message += "Mobile: " + bodyObj.form.mobile + "\n"
            } else {
                message += "Mobile: (missing and is required!)\n"
            }
            if (bodyObj.form.address) {
                message += "Mobile: " + bodyObj.form.address + "\n"
            } else {
                message += "Mobile: (missing and is required!)\n"
            }
        }
    } else if (bodyObj.form.objective == "microappdevelop") {
        message += "Thank you for your " + bodyObj.type + " enquiry.\n"
        message += "\nWe appreciate your interest in developing a micro-app solution.\n"
        message += "\nYou have indicated that you would like to develop for the " + makeList(bodyObj.form.category) + " industry.\n"
        message += "\nThe micro-app you would like to develop should have " + makeList(bodyObj.form.tasks) + " capabilities.\n"
        message += "\nYou can signup and develop micro-apps for free.\n"
        message += "\nJust follow this link and create your own developer account.\n\n"
        message += "https://developer-portal.onem.zone" + "\n\n"
        message += "\nWe are looking forward to reviewing your " + makeList(bodyObj.form.category) + " focused micro-app with " + makeList(bodyObj.form.tasks) + " capabilities.\n"
        if (bodyObj.user.name && (bodyObj.user.email || bodyObj.user.mobile)) {
            message += "\nWe will attempt to contact you regarding this matter based on the contact information you provided.\n"
        } else {
            message += "\nYou will need to update your contact information after which we will attempt to contact you.\n"
        }
    } else if (bodyObj.form.objective == "microappwant") {
        message += "\nWe appreciate your interest in our micro-app solutions.\n"
        message += "\nYou have indicated that you would like " + makeAorAn(bodyObj.form.category.toLowerCase()) + " industry micro-app with " + makeList(bodyObj.form.tasks) + " capabilities.\n"
        if (bodyObj.user.name && (bodyObj.user.email || bodyObj.user.mobile)) {
            message += "\nWe will attempt to contact you regarding this matter based on the contact information you provided.\n"
        } else {
            message += "\nYou will need to update your contact information after which we will attempt to contact you.\n"
        }
    }
    if (bodyObj.form.message) {
        message += "\nYour message to us:\n\n" + bodyObj.form.message
    }
    message += "\n\nSincerely,\n"
    message += "\nThe ONEm Micro-app team\n"
    message += "http://www.onem.com"
    return message
}

function makeEmailSubject(bodyObj) {
    let subject = ""
    logger.info("-----makeEmailSubject() bodyObj------")
    logger.info(JSON.stringify(bodyObj, {}, 4))
    if (bodyObj.form.objective == "companycontactus") {
        if (bodyObj.form.enquiry)
            subject += "Contacting us as " + bodyObj.type + " topic " + bodyObj.form.enquiry.toLowerCase()
        else 
            subject += "Contacting us as " + bodyObj.type
    } else if (bodyObj.form.objective == "companypartner") {
        subject += "Company partnership as " + bodyObj.type
    } else if (bodyObj.form.objective == "developerwant") {
        subject += "Developer request " + bodyObj.form.category.toLowerCase() + " for " + makeList(bodyObj.form.tasks)
    } else if (bodyObj.form.objective == "existingshareholder") {
        subject += "Shareholder registration submission"
    } else if (bodyObj.form.objective == "microappdevelop") {
        subject += "Micro-app developer for " + makeList(bodyObj.form.category) + " " + makeList(bodyObj.form.tasks)
    } else if (bodyObj.form.objective == "microappwant") {
        subject += "Micro-app wanted for " + bodyObj.form.category.toLowerCase() + " " + makeList(bodyObj.form.tasks)
    } else {
        subject += "Your equiry"
    }
    return subject
}

function makeList(obj) {
    let x = []
    if (typeof obj === 'object'){
        for (i = 0; i < obj.length; i++) {
            //x.push(obj[i].value)
            x.push(obj[i])
        }
        return x.join(", ").split("").reverse().join("").replace(" ,", " & ").split("").reverse().join("").toLowerCase()
    } else {
        return obj
    }
}

function formatInfo(object) {

    let info = JSON.stringify(object, {}, 4).slice(1,-1).replace(/"/g,"").replace(/_/g," ")
    let line = []

    logger.info("-----formatInfo------")
    logger.info(JSON.stringify(object, {}, 4))

    info = info.slice(1,-1).split(',\n')
    for (var i=0;i < info.length; i++) {
        line = info[i].split(": ")
        line[0] = line[0].replace(/-/g,",").replace(/ And /g," & ")
        line[0] = line[0].trimLeft()
        
        logger.info("-----formatInfo------")    
        logger.info(JSON.stringify(line[1], {}, 4))
        if (line[0].includes("Inspect") || line[0].includes("Pickup") || line[0].includes("Delivery") ) {

            line[1] = moment(line[1]).format('MMM DD YYYY HH:mm')
            logger.info("-----formatInfo------")
            logger.info(JSON.stringify(line[1], {}, 4))
        }
        info[i] = line[0] + ": "+line[1]
    }
    info.sort()
    for (var i=0;i < info.length; i++) {
        info[i] = info[i].slice(2)
    }    
    return info
}

function titleCase(text) {
    let newText = ""
    if (text.length > 0) {
        let words = text.split(" ")
        for (var i = 0; i < words.length; i++) {
            newText += words[i].slice(0, 1).toUpperCase() + text.slice(1).toLowerCase()
        }
        return newText
    } else {
        return text
    }
}

function stripSpaces(text) {
    return text.replace(/\s\s+/g,' ')
}

function cut(text, len) {
    if (text.length > len - 2) {
        return text.slice(0, len - 2) + ".."
    } else {
        return text
    }
}

function titleSentence(text) {
    if (text.length > 0) {
        let words = text.split(" ")
        for (i = 0; i < words.length; i++) {
            if (words[i].length > 1) {
                words[i] = words[i].slice(0, 1).toUpperCase() + words[i].slice(1).toLowerCase()
            }
        }
        return words.join(" ")
    } else {
        return text
    }
}

function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/gi, ",");
}

function codeGen(length,type) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    if (length > 10) {
        characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    } else if (type == "numeric") {
        characters = "0123456789"
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    titleCase,
    stripSpaces,
    cut,
    titleSentence,
    commas,
    codeGen,
    formatInfo,
    makeList,
    makeAorAn,
    makeEmailSubject,
    makeEmailMessage
}