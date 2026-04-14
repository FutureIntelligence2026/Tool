export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "No URL" });
  try {
    const resp = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    const short = (await resp.text()).trim();
    if (short.startsWith("http")) return res.json({ short });
    return res.json({ short: url });
  } catch (e) {
    return res.json({ short: url });
  }
}
