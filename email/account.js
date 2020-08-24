const sgMail = require('@sendgrid/mail');

const sendgridAPI_KEY = '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';

sgMail.setApiKey(sendgridAPI_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ibrarmunir56@outlook.com',
        subject: 'Thanks for joining us!',
        html: `<p>Welcome to the application, <strong>${name}</strong>. Let me know how can i help you.</p>`
    });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ibrarmunir56@outlook.com',
        subject: 'Sorry to see you go!',
        text: `Good Bye, ${name}. I hope to see you again.`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
};