// ═══════════════════════════════════════════════════════════════════════════
// ICONICONE Reply Tracker — Vercel Serverless Function
// Deployed auf Vercel, läuft alle 15 Min via Cron
//
// SETUP:
// 1. npm install imapflow  (im Projektordner)
// 2. vercel.json Cron eintragen (siehe unten)
// 3. Env-Variablen in Vercel Dashboard setzen:
//    IMAP_HOST=imap.strato.de
//    IMAP_PORT=993
//    IMAP_USER=outreach@iconicone.de
//    IMAP_PASS=deinPasswort
//    WEBHOOK_SECRET=einZufaelligerString123
//    LEADS_STORE_URL=https://dein-kv-store.vercel.app  (optional, KV Store)
// ═══════════════════════════════════════════════════════════════════════════

import { ImapFlow } from "imapflow";

// KV Store für Leads (Vercel KV oder einfaches JSON via Vercel Blob)
// Falls du kein KV hast: Leads werden im Request-Body übergeben
// und das Ergebnis zurückgegeben — das Tool speichert es dann lokal.

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Secret");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Auth
  const secret = req.headers["x-secret"];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Body: { leads: [{ id, email, step, sentAt }], accounts: [{ email, host, port, user, pass }] }
  const { leads = [], accounts = [] } = req.body;

  if (!leads.length || !accounts.length) {
    return res.status(200).json({ replied: [], checked: 0 });
  }

  const replied = [];
  let totalChecked = 0;

  for (const account of accounts) {
    const client = new ImapFlow({
      host: account.imapHost || process.env.IMAP_HOST || "imap.strato.de",
      port: parseInt(account.imapPort || process.env.IMAP_PORT || "993"),
      secure: true,
      auth: {
        user: account.email || process.env.IMAP_USER,
        pass: account.pass || process.env.IMAP_PASS,
      },
      logger: false,
      tls: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      const lock = await client.getMailboxLock("INBOX");

      try {
        // Nur ungelesene Mails der letzten 30 Tage checken
        const since = new Date();
        since.setDate(since.getDate() - 30);

        const messages = client.fetch(
          { since, unseen: false },
          { envelope: true, source: false }
        );

        for await (const msg of messages) {
          totalChecked++;
          const fromEmail = msg.envelope?.from?.[0]?.address?.toLowerCase() || "";
          const subject   = msg.envelope?.subject?.toLowerCase() || "";
          const date      = msg.envelope?.date;

          // Prüfe ob fromEmail zu einem unserer Leads gehört
          const matchedLead = leads.find(l =>
            l.email?.toLowerCase() === fromEmail ||
            // Auch Re: Betreff checken
            subject.includes(l.email?.split("@")[0]?.toLowerCase() || "___")
          );

          if (matchedLead && !replied.find(r => r.id === matchedLead.id)) {
            // Sicherstellen dass die Antwort NACH unserem Versand kam
            const sentDate = matchedLead.lastSentAt ? new Date(matchedLead.lastSentAt) : null;
            if (!sentDate || (date && new Date(date) > sentDate)) {
              replied.push({
                id:          matchedLead.id,
                email:       fromEmail,
                repliedAt:   date || new Date().toISOString(),
                subject:     msg.envelope?.subject || "",
                detectedVia: account.email,
              });
            }
          }
        }
      } finally {
        lock.release();
      }

      await client.logout();
    } catch (err) {
      console.error(`IMAP error for ${account.email}:`, err.message);
      // Weiter mit nächstem Account — kein crash
    }
  }

  return res.status(200).json({
    replied,
    checked: totalChecked,
    checkedAt: new Date().toISOString(),
  });
}
