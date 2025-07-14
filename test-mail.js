import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // для порта 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM, // отправляем себе для теста
      subject: 'Тестовое письмо от Nodemailer',
      text: 'Привет! Это тестовое письмо.',
    });

    console.log('Письмо отправлено: ', info.messageId);
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
  }
}

sendTestEmail();
