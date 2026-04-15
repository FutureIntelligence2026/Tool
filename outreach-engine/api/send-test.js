import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";

// Build the raw RFC822 message buffer using a stream transport (no actual send)
async function buildRawMessage(mailOptions) {
  const streamTransport = nodemailer.createTransport({ streamTransport: true, newline: "unix" });
  const info = await streamTransport.sendMail(mailOptions);
  return new Promise((resolve, reject) => {
    const chunks = [];
    info.message.on("data", (chunk) => chunks.push(chunk));
    info.message.on("end", () => resolve(Buffer.concat(chunks)));
    info.message.on("error", reject);
  });
}

async function appendToSentFolder(smtp, rawMessage) {
  // Common Sent folder names — Strato typically uses INBOX.Sent
  const sentFolderCandidates = ["INBOX.Sent", "Sent", "Gesendete Objekte", "Sent Items", "Sent Messages"];

  const imapHost = smtp.imapHost || smtp.host.replace(/^smtp\./, "imap.");
  const imapPort = smtp.imapPort || 993;

  const client = new ImapFlow({
    host: imapHost,
    port: imapPort,
    secure: true,
    auth: { user: smtp.user, pass: smtp.pass },
    tls: { rejectUnauthorized: false },
    logger: false,
  });

  await client.connect();
  try {
    for (const candidate of sentFolderCandidates) {
      const status = await client.status(candidate, { messages: true }).catch(() => null);
      if (status) {
        await client.append(candidate, rawMessage, ["\\Seen"], new Date());
        break;
      }
    }
  } finally {
    await client.logout();
  }
}

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
      auth: { user: smtp.user, pass: smtp.pass },
      tls: { rejectUnauthorized: false },
    });

    const fromAddress = smtp.fromName
      ? `"${smtp.fromName}" <${smtp.user}>`
      : smtp.user;

    const mailOptions = {
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
    };

    // Build raw RFC822 buffer BEFORE sending (stream transport, no actual SMTP connection)
    const rawMessage = await buildRawMessage(mailOptions);

    // Send via real SMTP — throws on failure, so IMAP append is never reached on error
    await transporter.sendMail(mailOptions);

    // Confirmed sent: append copy to Sent folder — must await before response,
    // otherwise Vercel terminates the function before IMAP finishes
    await appendToSentFolder(smtp, rawMessage).catch(() => {});

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "SMTP error" });
  }
}
