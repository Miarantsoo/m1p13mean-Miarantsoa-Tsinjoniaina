import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import User from "../admin/user/user.model.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: mailUser,
        pass: mailPass
    },
    port: 465,
    host: "smtp.gmail.com"
});

export const notifyAdminOnShopRequest = async (recipient, covering_letter) => {
    const admin = await User.findOne({ role: "admin" });

    console.log("ADMIN", admin.email)
    if (!admin) {
        console.error("Aucun administrateur trouvé pour recevoir la notification de demande de boutique.");
        return;
    }

    const mailOptionsSender = {
        from: mailUser,
        to: admin.email,
        subject: "Une nouvelle demande de boutique est présente dans votre application",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Nouvelle demande de boutique</h2>
                <p>Un utilisateur a soumis une nouvelle demande de création de boutique.</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Email du demandeur :</strong> ${recipient}</p>
                    <p><strong>Lettre de motivation :</strong></p>
                    <div style="background-color: white; padding: 15px; border-left: 4px solid #4CAF50;">
                        ${covering_letter}
                    </div>
                </div>
                <p>Veuillez examiner cette demande dans votre application.</p>
            </div>
        `
    };

    console.log(mailOptionsSender)

    await transporter.sendMail(mailOptionsSender);
}

export const sendShopRequestEmail = async ({recipient, covering_letter}) => {
    const confirmationTemplate = readFileSync(
        join(__dirname, "../templates/shop-request-confirmation.html"),
        "utf-8"
    );

    const mailOptionsRecipient = {
        from: mailUser,
        to: recipient,
        subject: "Votre demande a bien été envoyée",
        html: confirmationTemplate
    };

    console.log(mailOptionsRecipient)

    await transporter.sendMail(mailOptionsRecipient);

    await notifyAdminOnShopRequest(recipient, covering_letter)
}

export const sendShopRequestRejectionEmail = async ({recipient, reason}) => {
    const rejectionTemplate = readFileSync(
        join(__dirname, "../templates/shop-request-rejection.html"),
        "utf-8"
    );

    const htmlContent = rejectionTemplate.replace("{{reason}}", reason);

    const mailOptions = {
        from: mailUser,
        to: recipient,
        subject: "Réponse à votre demande de boutique",
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
}

export const sendPlanningEmail = async ({ recipient, date, duration }) => {
    const mailOptions = {
        from: "Planning "+mailUser,
        to: recipient,
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
