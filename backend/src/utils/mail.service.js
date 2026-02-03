import nodemailer from "nodemailer";

const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: mailUser,
        pass: mailPass
    }
});

export const sendPlanningEmail = async ({ to, date, duration }) => {
    const mailOptions = {
        from: "Planning "+mailUser,
        to,
        subject: "Confirmation de rendez-vous",
        html: `
      <p>Bonjour,</p>
      <p>Votre rendez-vous a été planifié avec succès.</p>
      <p>
        <strong>Date :</strong> ${new Date(date).toLocaleString("fr-FR", {
            timeZone: "Indian/Antananarivo"
        })}<br/>
        <strong>Durée :</strong> ${duration} minutes
      </p>
      <p>Merci.</p>
    `
    };

    await transporter.sendMail(mailOptions);
};
