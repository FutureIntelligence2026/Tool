import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { smtp } = req.body || {};
  if (!smtp?.host || !smtp?.user || !smtp?.pass) {
    return res.status(400).json({ ok: false, error: "Fehlende Felder" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 465,
      secure: smtp.port === 465,
      name: smtp.user.split("@")[1] || smtp.host,
      auth: { user: smtp.user, pass: smtp.pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
    });

    await transporter.verify();
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(200).json({ ok: false, error: err.message || "Verbindung fehlgeschlagen" });
  }
}
