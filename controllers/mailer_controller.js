import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host:"smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // Deshabilitar la verificación del certificado
    }

});

export default transporter;