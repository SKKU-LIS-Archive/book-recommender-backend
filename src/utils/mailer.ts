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
  sendMail: ({from, to, subject, text}: any) => {
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