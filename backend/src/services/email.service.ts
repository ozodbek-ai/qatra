import nodemailer from "nodemailer";

import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,

  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
) => {
  await transporter.sendMail({
    from: `"Qatra" <${env.SMTP_USER}>`,
    to: email,
    subject: "Qatra — parolni tiklash",

    text: `
Qatra hisobingiz uchun parolni tiklash so'rovi qabul qilindi.

Parolingizni tiklash uchun quyidagi havolaga o'ting:

${resetUrl}

Ushbu havola 15 daqiqa davomida amal qiladi.

Agar bu so'rovni siz yubormagan bo'lsangiz, ushbu emailni e'tiborsiz qoldiring.
    `,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Qatra — parolni tiklash</h2>

        <p>
          Hisobingiz uchun parolni tiklash so'rovi qabul qilindi.
        </p>

        <p>
          Yangi parol yaratish uchun quyidagi tugmani bosing:
        </p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 8px;
            "
          >
            Parolni tiklash
          </a>
        </p>

        <p>
          Ushbu havola 15 daqiqa davomida amal qiladi.
        </p>

        <p>
          Agar bu so'rovni siz yubormagan bo'lsangiz,
          ushbu emailni e'tiborsiz qoldiring.
        </p>
      </div>
    `,
  });
};