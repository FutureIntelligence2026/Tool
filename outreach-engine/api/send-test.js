import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, html, smtp } = req.body || {};

  if (!to || !subject || !smtp?.host || !smtp?.user || !smtp?.pass) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      secure: smtp.port === 465,
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
      to,
      subject,
      html: html || subject,
      headers: {
        "X-Mailer": "ICONICONE Outreach",
        "X-Priority": "3",
        "Precedence": "bulk",
      },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "SMTP error" });
  }
}
