const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: //,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "noreply.rapidamic@gmail.com",
        pass: "//",
    },
});
