// const mailjet = require('node-mailjet').connect('7ccc8372033c8afb393625f16e358053', 'da1984411dc0ab9aab72d72a88f0f4cc')

var postmark = require("postmark");
const logger = require('debug-level')('myownnews')

// Send an email:
var client = new postmark.Client("c1190b96-cdbc-48fc-8606-606514b93115");


const sendEmail = async function (email) {
    try {
        const result = await client.sendEmail({
            "From": "ONEm Communications <contact@onem.com>",
            "To": email.toName+" <"+email.toEmail+">",
            "Bcc": "Contact Form Notification <contact@onem.com>",
            "Subject": email.subject,
            "TextBody": email.message
            })
            logger.info("-----sendEmail() request------")
            logger.info(result)
    } catch (error) {
        logger.info("-----sendEmail() error request------")
        logger.info(result)
    }
}

// const sendEmail = async function (email) {
//     const request = mailjet
//         .post("send", { 'version': 'v3.1' })
//         .request({
//             "Messages": [
//                 {
//                     "From": {
//                         "Email": email.fromEmail,
//                         "Name": email.fromName
//                     },
//                     "To":[
//                         {
//                             "Email": email.toEmail,
//                             "Name": email.toName
//                         }
//                     ],
//                     "Bcc":[
//                         {
//                             "Email": "me@crr56.com",
//                             "Name": "Chris Richardson"
//                         }
//                     ],
//                     "Subject": email.subject,
//                     "TextPart": email.message,
//                     "HTMLPart": "", // "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
//                     "CustomID": email.id //"AppGettingStartedTest"
//                 }
//             ]
//         })
//     request
//         .then((result) => {
//             console.log(result.body)
//         })
//         .catch((err) => {
//             console.log(err.statusCode)
//         })
// }

module.exports = {
    sendEmail,
}