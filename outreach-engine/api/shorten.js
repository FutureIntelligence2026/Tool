export default async function handler(req, res) {
  const { url, alias } = req.query;
  if (!url) return res.status(400).json({ error: "No URL" });
  try {
    // Try custom alias first (e.g. signal-iduna-max-mustermann)
    if (alias) {
      const customResp = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}&alias=${encodeURIComponent(alias)}`
      );
      const customShort = (await customResp.text()).trim();
      if (customShort.startsWith("http") && !customShort.toLowerCase().includes("error")) {
        return res.json({ short: customShort });
      }
    }
    // Fall back to random short URL
    const resp = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    const short = (await resp.text()).trim();
    if (short.startsWith("http")) return res.json({ short });
    return res.json({ short: url });
  } catch (e) {
    return res.json({ short: url });
  }
}
