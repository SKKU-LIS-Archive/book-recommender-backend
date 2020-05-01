import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

const config = {
  mailer: {
    service: "gmail",
    host: "localhost",
    port: "465",
    user: "godwmaw.ml",
    password: "dan12:03",
  },
};

export const mailer = {
  sendMail: (from: any, to: any, subject: any, text: any) => {
    const transporter = nodemailer.createTransport({
      service: config.mailer.service,

      auth: {
        user: config.mailer.user,

        pass: config.mailer.password,
      },
    });

    const mailOptions = {
      from,

      to,

      subject,

      text,
    };

    try {
      transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
          console.log("실패  :  => ", err);
        } else {
          console.log("성공 :  => ", res);
        }

        transporter.close();
      });

      console.log("mail send");
    } catch (error) {
      console.error("메일 발송 실패 :", error);
    }
    return null;
  },
};

exports.sendMail = functions.https.onRequest((req, res) => {
  mailer.sendMail("보내는 이", "받는 이", "제목", "본문");
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
