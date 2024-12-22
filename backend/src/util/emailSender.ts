import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../config/secrets.js";

export const sendEmail = async (user_email: string, v_code: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: user_email,
      subject: "Password Reset",
      text: `Your verification code is ${v_code}`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
