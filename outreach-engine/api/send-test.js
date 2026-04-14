import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, html, smtp } = req.body || {};

  if (!to || !subject || !smtp?.host || !smtp?.user || !smtp?.pass) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Extract the domain from the sender address to use as EHLO hostname
  const senderDomain = smtp.user.split("@")[1] || "iconicone.de";

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      secure: smtp.port === 465,
      name: senderDomain, // EHLO hostname — prevents internal Vercel IP showing up
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const fromAddress = smtp.fromName
      ? `"${smtp.fromName}" <${smtp.user}>`
      : smtp.user;

    await transporter.sendMail({
      from: fromAddress,
      replyTo: smtp.user,
      to,
      subject,
      html: html || subject,
      text: subject, // plain-text fallback reduces spam score
      headers: {
        "X-Mailer": "Nodemailer",
        "X-Priority": "3",
      },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "SMTP error" });
  }
}
