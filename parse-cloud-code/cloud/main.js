var sendgrid = require("sendgrid");

sendgrid.initialize("cardbird", "X6g9-lDQhw=er");

Parse.Cloud.afterSave("Feedback", function (request) {

    var object = JSON.parse(JSON.stringify(request.object)),
        context = JSON.stringify(object.context, null, '\t'),
        rawFeedback;

    delete object.context;
    rawFeedback = JSON.stringify(object, null, '\t')

    sendgrid.sendEmail({
        to: ["contact@720dreams.com"],
        from: "contact@cardbird.io",
        subject: object.appName + ": New feedback",
        text: 'Hi,\n\nFeedback (' + object.createdAt + ') :\n' + object.feedback + '\n\nRaw:\n' + rawFeedback + '\n\nContext:\n' + context,
        replyto: "contact@cardbird.io"
    }).then(function (httpResponse) {
    }, function (httpResponse) {
        console.log('Error: ', httpResponse);
    });

});


