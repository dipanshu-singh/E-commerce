const Mailjet = require("node-mailjet");
const mailjet = Mailjet.apiConnect(
  "ed9f4c2009842bb7944c0138a7e8af05",
  "4e0874383fe8f079bc05ae398515a75d"
);

function template(email, name, subject, text, content) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "117dcs@gmail.com",
          Name: "MazaMart",
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        Subject: subject,
        TextPart: text,
        HTMLPart: content,
      },
    ],
  });
  return request;
}
const durl = "https://e-commerce-3p34g82fr74l7hl9hcj.codequotient.in";
function accountVerificationMail(email, name, token) {
  const url = `${durl}/auth/verify?token=${token}`;
  const subject = "Account activation link";
  const text = `Dear ${name} , Welcome to MazaMart! Click on below link to activate your account`;
  const content = `Dear ${name} , Welcome to MazaMart! Click on below link to activate your account <br /> <h4> <a href=${url} >Click Here </a>`;
  return template(email, name, subject, text, content);
}

function sendWelcome(email, name) {
  const url = `${durl}`;
  const subject = "Welcome to MazaMart";
  const text = `Dear ${name} , Welcome to MazaMart! Click on below link to activate your account`;
  const content = `Dear ${name} , Welcome to MazaMart! Click on below link to check new products <br /> <h4> <a href=${url} >Click Here </a> <br /> ${url} `;
  return template(email, name, subject, text, content);
}

function changePasswordEmail(email, name) {
  const url = `${durl}/auth/login`;
  const subject = "Password reset successfully";
  const text = `Dear ${name} , Your account password is changed successfully`;
  const content = `Dear ${name} , Your account password is changed successfully. Login again. <br /> <h4> <a href=${url} >Click Here </a> <br /> ${url} `;
  return template(email, name, subject, text, content);
}

function forgotPasswordEmail(email, name, token) {
  const url = `${durl}/auth/forgot/verify?token=${token}`;
  const subject = "Forgot Password link";
  const text = `Dear ${name} , Your Forgot password request link`;
  const content = `Dear ${name} , Your Forgot passord request link. click on below link. <br /> <h4> <a href=${url} >Click Here </a> <br /> ${url} `;
  return template(email, name, subject, text, content);
}

function passwordResetEmail(email, name) {
  const url = `${drul}/auth/login`;
  const subject = "Password reset successfully";
  const text = `Dear ${name} , Your account password is reset successfully`;
  const content = `Dear ${name} , Your account password is reset successfully. to Login again click on link given below <br /> <h4> <a href=${url} >Click Here </a> <br /> ${url} `;
  return template(email, name, subject, text, content);
}

module.exports = {
  accountVerificationMail,
  sendWelcome,
  changePasswordEmail,
  forgotPasswordEmail,
  passwordResetEmail,
};
