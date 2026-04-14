import { useState, useRef, useEffect } from "react";

const TEMPLATE_VERSION = "v6";

// ═══════════════════════════════════════════════════════════════════════════
// ICONICONE BRAND KONFIG — direkt von iconicone.de
// ═══════════════════════════════════════════════════════════════════════════
const IC = {
  url:        "https://iconicone.de",
  hubspot:    "https://calendly.com/website-iconicone/15min",
  logo:       "https://www.iconicone.de/img/iconicone-logo-wide.png",
  achiFace:   "https://www.iconicone.de/img/achi-face.jpeg",
  achiPortrait:"https://www.iconicone.de/img/achi-portrait.jpeg",
  achiPointing:"https://www.iconicone.de/img/achi-pointing.png",
  name:       "Achi Schmidt",
  title:      "Gründer & Geschäftsführer",
  tel:        "0151 684 16402",
  telLink:    "tel:015168416402",
  email:      "website@iconicone.de",
  instagram:  "https://www.instagram.com/iconicone.de/",
  // ICONICONE Farben (dark luxury)
  black:      "#0a0a0a",
  darkBg:     "#111111",
  cardBg:     "#1a1a1a",
  gold:       "#c9a84c",
  goldLight:  "#e8c76a",
  goldDark:   "#a07830",
  white:      "#f5f0e8",
  muted:      "#888880",
};

// ═══════════════════════════════════════════════════════════════════════════
// SIGNATUR HTML — erscheint am Ende jeder Mail
// ═══════════════════════════════════════════════════════════════════════════
const SIGNATUR_HTML = `
<div style="margin-top:14px;padding-top:12px;border-top:2px solid #f97316;font-family:Arial,sans-serif;max-width:480px">
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding-right:14px;vertical-align:middle;width:68px">
        <img src="${IC.achiFace}" alt="Achi Schmidt" width="60" height="60"
          style="width:60px;height:60px;border-radius:50%;object-fit:cover;display:block;border:2px solid #f97316"/>
      </td>
      <td style="vertical-align:middle">
        <div style="font-size:16px;font-weight:700;color:#f97316;margin-bottom:1px;letter-spacing:0.01em">${IC.name}</div>
        <div style="font-size:12px;color:#555;margin-bottom:6px;font-style:italic">${IC.title} · ICONICONE</div>
        <div style="font-size:12px;color:#333;line-height:1.9">
          <a href="${IC.telLink}" style="color:#f97316;text-decoration:none;font-weight:600">📞 ${IC.tel}</a><br/>
          <a href="mailto:${IC.email}" style="color:#f97316;text-decoration:none;font-weight:600">✉ ${IC.email}</a><br/>
          <a href="${IC.url}" style="color:#f97316;text-decoration:none;font-weight:600">🌐 www.iconicone.de</a>
        </div>
      </td>
      <td style="vertical-align:middle;padding-left:14px;text-align:right">
        <a href="${IC.url}" style="text-decoration:none">
          <img src="${IC.logo}" alt="ICONICONE" height="26"
            style="height:26px;display:block;"/>
        </a>
      </td>
    </tr>
  </table>
</div>`;

// Signatur als Plain-Text (für Textversion)
const SIGNATUR_TEXT = `
──────────────────────────────
${IC.name}
${IC.title} · ICONICONE

📞 ${IC.tel}
✉  ${IC.email}
🌐 ${IC.url}
──────────────────────────────`;

// ═══════════════════════════════════════════════════════════════════════════
// MAIL TEMPLATES — alle 5 Steps mit ICONICONE Branding + Achi Signatur
// ═══════════════════════════════════════════════════════════════════════════
const DEFAULT_TEMPLATES = [
  {
    step:1, label:"Demo", tag:"Tag 0", tagColor:IC.gold, daysAfterPrev:0,
    desc:"Demo-Website zeigen. Kein Preis, kein Druck.",
    subject:`Kurze Frage zu Ihrer Online-Präsenz, {{NACHNAME}}`,
    body:`Hallo {{VORNAME}},

ich recherchiere gerade nach {{VERSICHERER}}-Beratern in {{ORT}} — und bin dabei auf Sie gestoßen.

Ich habe Ihnen bereits eine fertige Website erstellt:
{{URL}}
Die Seite ist komplett auf Sie zugeschnitten — mit Ihren Kontaktdaten, Ihren Leistungen und einem Kontaktformular, das neue Kundenanfragen direkt zu Ihnen leitet.

Werfen Sie kurz einen Blick darauf — ich bin gespannt, was Sie sagen.

Viele Grüße
{{SIGNATUR}}`,
  },
  {
    step:2, label:"Preis & Anker", tag:"+1 Tag", tagColor:"#3b82f6", daysAfterPrev:1,
    desc:"499€ als No-Brainer. HubSpot-Termin.",
    subject:`Andere zahlen 3.000€ dafür — ich mach's für 499€`,
    body:`Hallo {{VORNAME}},

kurze Nachfrage — haben Sie die Website gesehen?
{{URL}}

Was Sie bekommen:
✓ SEO-optimiert — damit Sie bei Google in {{ORT}} gefunden werden
✓ Conversion-optimiert — damit Besucher zu echten Anfragen werden
✓ Online-Terminbuchung direkt auf der Seite
✓ Impressum, Datenschutz, Mobile — alles fertig

Was andere dafür zahlen:
Agenturen berechnen 2.000–5.000€ für vergleichbare Seiten, plus laufende Wartungskosten.

Was Sie bei ICONICONE zahlen:
Einmalig 499€. Kein Abo. Keine Folgekosten. Fertig in 24h.

Termin buchen — 15 Minuten reichen:
{{HUBSPOT}}

Viele Grüße
{{SIGNATUR}}`,
  },
  {
    step:3, label:"Nutzen", tag:"+7 Tage", tagColor:"#8b5cf6", daysAfterPrev:7,
    desc:"Neukunden, Google-Sichtbarkeit. Frage stellen.",
    subject:`Wie viele Neukunden gewinnen Sie aktuell über Google?`,
    body:`Hallo {{VORNAME}},

eine ehrliche Frage: Wie viele Ihrer Neukunden finden Sie heute über Google?

Die meisten {{VERSICHERER}}-Berater, die ich kenne, sagen: kaum bis keine. Weil entweder gar keine Website da ist — oder die bestehende nicht für Conversions gebaut wurde.

Genau das löst die Seite, die ich für Sie erstellt habe:
{{URL}}

499€ einmalig. SEO eingebaut. Neue Anfragen laufen automatisch zu Ihnen.

Möchten Sie das kurz besprechen?
{{HUBSPOT}}

Oder einfach antworten — ich erkläre alles in 15 Minuten.

Viele Grüße
{{SIGNATUR}}`,
  },
  {
    step:4, label:"Letzte Chance", tag:"+7 Tage", tagColor:"#f97316", daysAfterPrev:7,
    desc:"FOMO subtil. Eine letzte direkte Frage.",
    subject:`Noch offen: Ihre Website in {{ORT}}`,
    body:`Hallo {{VORNAME}},

ich melde mich ein letztes Mal wegen Ihrer Website:
{{URL}}

Ich frage, weil ich in {{ORT}} aktuell nur eine Seite für {{VERSICHERER}}-Berater livesetze — und ich diese Möglichkeit nicht an Ihnen vorbeigehen lassen wollte.

499€ einmalig. In 24h live.

Falls es passt:
{{HUBSPOT}}

Falls nicht — kein Problem, ich melde mich nicht mehr.

Viele Grüße
{{SIGNATUR}}`,
  },
  {
    step:5, label:"Break-up", tag:"+1 Monat", tagColor:"#6b7280", daysAfterPrev:30,
    desc:"Respektvoll raus. Tür offen lassen.",
    subject:`Ich nehme Sie aus meiner Liste, {{VORNAME}}`,
    body:`Hallo {{VORNAME}},

ich nehme Sie aus meinen Nachrichten raus — Sie hören nichts mehr von mir.

Die Website bleibt noch eine Weile online, falls Sie irgendwann Interesse haben:
{{URL}}

Falls sich Ihre Situation ändert, melden Sie sich gerne:
🌐 ${IC.url}
📞 ${IC.tel}

Alles Gute für Sie und Ihr Geschäft in {{ORT}}.

{{SIGNATUR}}`,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// INTERPOLATION
// ═══════════════════════════════════════════════════════════════════════════
function interpolate(text, lead, insurerName, previewUrl) {
  return (text || "")
    .replace(/\{\{VORNAME\}\}/g,     lead?.vorname    || "")
    .replace(/\{\{NACHNAME\}\}/g,    lead?.nachname   || "")
    .replace(/\{\{ORT\}\}/g,         lead?.ort        || "")
    .replace(/\{\{VERSICHERER\}\}/g, insurerName      || "")
    .replace(/\{\{URL\}\}/g,         previewUrl       || "")
    .replace(/\{\{HUBSPOT\}\}/g,     IC.hubspot)
    .replace(/\{\{SIGNATUR\}\}/g,    SIGNATUR_TEXT);
}

function textToHtml(text) {
  // Real emails use <br/><br/> between paragraphs — no block margins, no sections
  const escaped = text
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const html = escaped
    .split(/\n{2,}/)
    .filter(p => p.trim())
    .map(p => p.split("\n").join("<br/>"))
    .join("<br/><br/>");
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.7;max-width:560px">${html}</div>`;
}

function interpolateHtml(text, lead, insurerName, previewUrl) {
  // Split template at {{SIGNATUR}} BEFORE interpolation — 100% reliable
  const tpl = text || "";
  const sigMarker = tpl.indexOf("{{SIGNATUR}}");
  const bodyTpl = sigMarker >= 0 ? tpl.slice(0, sigMarker) : tpl;
  const hasSig = sigMarker >= 0;

  // URL → clickable link
  const URL_TOKEN = "__ICURL__";
  const HUB_TOKEN = "__ICHUB__";
  const displayUrl = previewUrl ? "www." + previewUrl.replace(/^https?:\/\/(www\.)?/, "") : "";
  const linkHtml = previewUrl
    ? `<a href="${previewUrl}" style="color:#f97316;font-weight:700;text-decoration:none">👉 ${displayUrl}</a>`
    : "";
  const hubHtml = `<a href="${IC.hubspot}" style="color:#f97316;font-weight:700;text-decoration:none">👉 Termin buchen — 15 Minuten</a>`;

  // Replace {{URL}} and {{HUBSPOT}} with tokens before HTML escaping
  const bodyWithToken = bodyTpl
    .replace(/\{\{URL\}\}/g, URL_TOKEN)
    .replace(/\{\{HUBSPOT\}\}/g, HUB_TOKEN);

  // Interpolate remaining placeholders
  const interpolated = bodyWithToken
    .replace(/\{\{VORNAME\}\}/g,     lead?.vorname    || "")
    .replace(/\{\{NACHNAME\}\}/g,    lead?.nachname   || "")
    .replace(/\{\{ORT\}\}/g,         lead?.ort        || "")
    .replace(/\{\{VERSICHERER\}\}/g, insurerName      || "");

  // Convert body text to HTML, then inject links
  let bodyHtml = textToHtml(interpolated.trim());
  bodyHtml = bodyHtml.replace(new RegExp(URL_TOKEN, "g"), linkHtml);
  bodyHtml = bodyHtml.replace(new RegExp(HUB_TOKEN, "g"), hubHtml);

  const fullHtml = bodyHtml + (hasSig ? SIGNATUR_HTML : "");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="margin:0;padding:16px;background:#ffffff;font-family:Arial,sans-serif;color:#1a1a1a">${fullHtml}</body></html>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// VERSICHERER
// ═══════════════════════════════════════════════════════════════════════════
const VERSICHERER = {
  signal_iduna: {id:"signal_iduna",name:"SIGNAL IDUNA",shortName:"SI",primary:"#003087",accent:"#F5A800"},
  arag:         {id:"arag",        name:"ARAG",         shortName:"AG",primary:"#E30613",accent:"#E30613"},
  huk:          {id:"huk",         name:"HUK-COBURG",   shortName:"HK",primary:"#005CA9",accent:"#FFB800"},
  allianz:      {id:"allianz",     name:"Allianz",      shortName:"AL",primary:"#003781",accent:"#00A8E0"},
  generali:     {id:"generali",    name:"Generali",     shortName:"GN",primary:"#CC0000",accent:"#CC0000"},
  zurich:       {id:"zurich",      name:"Zurich",       shortName:"ZR",primary:"#0F1A7F",accent:"#E8000D"},
};

// ═══════════════════════════════════════════════════════════════════════════
// SCHEDULE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
function scheduleSequence(lead, startDate, accounts, seqDef) {
  if (!accounts.length) return seqDef.map(s=>({step:s.step,scheduledAt:null,accountId:null,status:"pending",sentAt:null}));
  const MAX=30,START=8,END=18,GAP=20;
  const slots={},lastTime={};
  function findSlot(d) {
    const dk=d.toDateString();
    const avail=accounts.filter(a=>(slots[a.id]?.[dk]||0)<MAX);
    if(!avail.length)return null;
    const acc=avail.sort((a,b)=>(slots[a.id]?.[dk]||0)-(slots[b.id]?.[dk]||0))[0];
    const used=slots[acc.id]?.[dk]||0;
    const sz=Math.floor(((END-START)*60)/MAX);
    let mins=START*60+used*sz+Math.floor(Math.random()*Math.max(1,sz-5));
    const lt=lastTime[acc.id];
    if(lt&&lt.toDateString()===dk){const lm=lt.getHours()*60+lt.getMinutes();if(mins-lm<GAP)mins=lm+GAP+Math.floor(Math.random()*5);}
    if(mins>=END*60)return null;
    const sc=new Date(d);sc.setHours(Math.floor(mins/60),mins%60,0,0);
    if(!slots[acc.id])slots[acc.id]={};
    slots[acc.id][dk]=(slots[acc.id][dk]||0)+1;
    lastTime[acc.id]=sc;
    return{scheduledAt:sc,accountId:acc.id};
  }
  const result=[];let cur=new Date(startDate);
  for(const s of seqDef){
    if(s.step>1){cur=new Date(cur);cur.setDate(cur.getDate()+s.daysAfterPrev);}
    let slot=null;
    for(let d=0;d<14;d++){const t=new Date(cur);t.setDate(t.getDate()+d);slot=findSlot(t);if(slot)break;}
    result.push({step:s.step,scheduledAt:slot?.scheduledAt||null,accountId:slot?.accountId||null,status:slot?"scheduled":"pending",sentAt:null});
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTO-DETECTION
// ═══════════════════════════════════════════════════════════════════════════
const DKW={signal_iduna:["signal iduna","signal-iduna","signaliduna"],arag:["arag"],huk:["huk","huk-coburg","hukcoburg"],allianz:["allianz"],generali:["generali"],zurich:["zurich","zürich"]};
function detectIns(str){if(!str)return null;const l=str.toLowerCase();for(const[id,kws]of Object.entries(DKW))if(kws.some(k=>l.includes(k)))return id;return null;}
function detectFromRow(parts){return detectIns(parts[7]||"")||detectIns(parts[2]||"")||null;}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════
const EMPTY_LEAD={vorname:"",nachname:"",email:"",telefon:"",strasse:"",plz:"",ort:""};
const EMPTY_ACC={name:"",email:"",password:"",smtpHost:"smtp.strato.de",smtpPort:"465",imapHost:"imap.strato.de",imapPort:"993"};
const ACC_COLORS=[IC.gold,"#3b82f6","#10b981","#a855f7","#f97316","#06b6d4","#ec4899","#84cc16"];
const LSC={active:"#3b82f6",replied:"#10b981",completed:"#6b7280",stopped:"#ef4444",archived:"#94a3b8"};
const LSL={active:"Aktiv",replied:"Geantwortet ✓",completed:"Abgeschlossen",stopped:"Gestoppt",archived:"Archiviert"};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES — Clean Light SaaS
// ═══════════════════════════════════════════════════════════════════════════
const S = {
  app:  {minHeight:"100vh",background:"#f4f6f9",fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",color:"#1e2532",fontSize:14},
  hdr:  {background:"#ffffff",borderBottom:"1px solid #e2e8f0",padding:"0 24px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"},
  hdrIn:{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,height:56},
  tabs: {background:"#ffffff",borderBottom:"1px solid #e2e8f0",padding:"0 24px",display:"flex",gap:0,overflowX:"auto"},
  tab:  a=>({padding:"14px 18px",fontSize:13,fontWeight:600,cursor:"pointer",border:"none",background:"transparent",color:a?"#2563eb":"#64748b",borderBottom:a?"2px solid #2563eb":"2px solid transparent",whiteSpace:"nowrap",fontFamily:"inherit",letterSpacing:"normal",transition:"color .15s"}),
  body: {maxWidth:1400,margin:"0 auto",padding:"24px"},
  card: {background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"20px 24px",marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"},
  goldCard: {background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"16px 20px",marginBottom:14},
  lbl:  {fontSize:12,fontWeight:600,color:"#64748b",letterSpacing:"0.03em",marginBottom:6,display:"block"},
  inp:  e=>({width:"100%",padding:"10px 13px",background:"#fff",border:`1.5px solid ${e?"#ef4444":"#cbd5e1"}`,borderRadius:8,color:"#1e2532",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .15s"}),
  ta:   {width:"100%",padding:"10px 13px",background:"#fff",border:"1.5px solid #cbd5e1",borderRadius:8,color:"#1e2532",fontSize:13,outline:"none",fontFamily:"'JetBrains Mono','Fira Mono',monospace",boxSizing:"border-box",resize:"vertical",lineHeight:1.8},
  btn:  (v="pri")=>({
    padding:v==="sm"?"5px 10px":"10px 18px",
    background:v==="pri"?"#2563eb":v==="green"?"#ecfdf5":v==="blue"?"#eff6ff":v==="red"?"#fef2f2":v==="purple"?"#f5f3ff":"#f8fafc",
    border:v==="pri"?"none":v==="green"?"1px solid #bbf7d0":v==="red"?"1px solid #fecaca":v==="purple"?"1px solid #ddd6fe":v==="ghost"?"1px solid #e2e8f0":"1px solid #e2e8f0",
    borderRadius:8,color:v==="pri"?"#fff":v==="green"?"#15803d":v==="red"?"#dc2626":v==="purple"?"#7c3aed":"#374151",
    fontSize:v==="sm"?12:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",letterSpacing:"normal",
    boxShadow:v==="pri"?"0 1px 3px rgba(37,99,235,0.3)":"none",transition:"opacity .15s",
  }),
  stepDot:(status,color)=>({width:22,height:22,borderRadius:"50%",flexShrink:0,
    background:status==="sent"?"#16a34a":status==="failed"?"#ef4444":status==="stopped"?"#f1f5f9":status==="scheduled"?`${color}18`:"#1e2a1e",
    display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,
    color:status==="sent"?"#fff":status==="failed"?"#fff":status==="stopped"?"#94a3b8":status==="pending"?"#4ade80":color||"#2563eb",
    border:status==="scheduled"?`2px solid ${color}`:status==="sent"?"2px solid #16a34a":status==="failed"?"2px solid #ef4444":status==="pending"?"2px solid #4ade80":"1.5px solid #e2e8f0"}),
  pill: (c)=>({background:`${c}18`,border:`1px solid ${c}40`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600,color:c}),
  statPill:{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"8px 16px",textAlign:"center"},
};

const VDot=({id,sz=6})=><div style={{width:sz,height:sz,borderRadius:"50%",background:VERSICHERER[id]?.primary||"#444",flexShrink:0}}/>;

// ═══════════════════════════════════════════════════════════════════════════
// WEBSITE TEMPLATES (public/templates/{folder}/index.html)
// ═══════════════════════════════════════════════════════════════════════════
const WEBSITE_TEMPLATES = [
  {folder:"arag-basis",          label:"ARAG",          tag:"ARAG",         color:"#F5A800"},
  {folder:"huk-basis",           label:"HUK-COBURG",    tag:"HUK-COBURG",   color:"#FFB300"},
  {folder:"signal-iduna-basis",  label:"SIGNAL IDUNA",  tag:"SIGNAL IDUNA", color:"#003087"},
  {folder:"allianz-basis",       label:"Allianz",        tag:"Allianz",      color:"#003781"},
  {folder:"generali-basis",      label:"Generali",       tag:"Generali",     color:"#CC0000"},
  {folder:"zurich-basis",        label:"Zurich",         tag:"Zurich",       color:"#0C2A5F"},
];

const INS_TO_FOLDER = {
  arag:"arag-basis", huk:"huk-basis", signal_iduna:"signal-iduna-basis",
  allianz:"allianz-basis", generali:"generali-basis", zurich:"zurich-basis",
};

function generatePreviewUrl(lead, insurerId) {
  const folder = INS_TO_FOLDER[insurerId];
  if (!folder) return "";
  const base = `${window.location.origin}/templates/${folder}/index.html`;
  const q = new URLSearchParams();
  if (lead.vorname)  q.set("v", lead.vorname);
  if (lead.nachname) q.set("n", lead.nachname);
  if (lead.telefon)  q.set("t", lead.telefon);
  if (lead.ort)      q.set("o", lead.ort);
  if (lead.email)    q.set("e", lead.email);
  if (lead.strasse)  q.set("s", lead.strasse);
  if (lead.plz)      q.set("p", lead.plz);
  // AGENTUR_NAME = Vorname Nachname
  const agentur = [lead.vorname, lead.nachname].filter(Boolean).join(" ");
  if (agentur) q.set("a", agentur);
  return `${base}?${q}`;
}

function makeAlias(lead, insurerId) {
  const ins = (INS_TO_FOLDER[insurerId] || "").replace("-basis", "");
  const name = [lead.vorname, lead.nachname]
    .filter(Boolean).join("-").toLowerCase()
    .replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss")
    .replace(/[^a-z0-9-]/g,"").slice(0, 22);
  return `${ins}-${name}`.slice(0, 30);
}

async function shortenUrl(longUrl, alias) {
  if (!longUrl) return longUrl;
  try {
    const params = new URLSearchParams({ url: longUrl });
    if (alias) params.set("alias", alias);
    const resp = await fetch(`/api/shorten?${params}`);
    const data = await resp.json();
    if (data.short && data.short.startsWith("http")) return data.short;
  } catch {}
  return longUrl;
}

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab,setTab]=useState("leads");
  const [templates,setTemplates]=useState(DEFAULT_TEMPLATES);
  const [editingTpl,setEditingTpl]=useState(null);
  const [accounts,setAccounts]=useState([{id:"acc1",name:"Achi Schmidt – ICONICONE",email:"website@iconicone.de",smtpHost:"smtp.strato.de",smtpPort:"465",imapHost:"imap.strato.de",imapPort:"993",active:true}]);
  const [showAccForm,setShowAccForm]=useState(false);
  const [accForm,setAccForm]=useState(EMPTY_ACC);
  const [editAccId,setEditAccId]=useState(null);
  const [leads,setLeads]=useState([]);
  const [expandLead,setExpandLead]=useState(null);
  const [expandStep,setExpandStep]=useState(null);
  const [addMode,setAddMode]=useState("single");
  const [leadForm,setLeadForm]=useState(EMPTY_LEAD);
  const [selIns,setSelIns]=useState("signal_iduna");
  const [formErrors,setFormErrors]=useState({});
  const [csvText,setCsvText]=useState("");
  const [detectLog,setDetectLog]=useState([]);
  const [trackerStatus,setTrackerStatus]=useState("idle");
  const [lastChecked,setLastChecked]=useState(null);
  const [trackerLog,setTrackerLog]=useState([]);
  const [backendUrl,setBackendUrl]=useState("https://iconicone-reply-tracker.vercel.app/api/check-replies");
  const [backendSecret,setBackendSecret]=useState("3D26NzJk03LwJZota_Zqjm0laCVquypEfsgNfwLU8PM");
  const [accPasswords,setAccPasswords]=useState({});
  const [showMailPreview,setShowMailPreview]=useState(null); // {lead, step}
  const [filterStatus,setFilterStatus]=useState("all");
  const [filterIns,setFilterIns]=useState("all");
  const [vPreview,setVPreview]=useState(null); // template folder name
  const [testMailModal,setTestMailModal]=useState(null); // {step}
  const [testMailTo,setTestMailTo]=useState("");
  const [testMailSending,setTestMailSending]=useState(false);
  const [testMailResult,setTestMailResult]=useState(null);
  const [editLeadId,setEditLeadId]=useState(null);
  const [editLeadForm,setEditLeadForm]=useState(null);

  const activeAccounts=accounts.filter(a=>a.active!==false);

  // ── LOCALSTORAGE PERSISTENCE ───────────────────────────────────────────────
  useEffect(()=>{
    try{
      const sl=localStorage.getItem("ic_leads");     if(sl) setLeads(JSON.parse(sl));
      const sa=localStorage.getItem("ic_accounts");  if(sa) setAccounts(JSON.parse(sa));
      const sv=localStorage.getItem("ic_tplver"); const st=localStorage.getItem("ic_templates"); if(st&&sv===TEMPLATE_VERSION) setTemplates(JSON.parse(st));
      const sp=localStorage.getItem("ic_passwords"); if(sp) setAccPasswords(JSON.parse(sp));
    }catch(e){}
  },[]);
  useEffect(()=>{try{localStorage.setItem("ic_leads",JSON.stringify(leads));}catch(e){}},[leads]);
  useEffect(()=>{try{localStorage.setItem("ic_accounts",JSON.stringify(accounts));}catch(e){}},[accounts]);
  useEffect(()=>{try{localStorage.setItem("ic_templates",JSON.stringify(templates));localStorage.setItem("ic_tplver",TEMPLATE_VERSION);}catch(e){}},[templates]);
  useEffect(()=>{try{localStorage.setItem("ic_passwords",JSON.stringify(accPasswords));}catch(e){}},[accPasswords]);

  // ── AUTO-SEND: every 2 min, strict 08-18 Uhr, max 30/Tag, max 1 pro Run ────
  const lastSentRef=useRef({});
  useEffect(()=>{
    const SEND_GAP_MS=20*60*1000; // 20 Min Abstand → 30 Mails gleichmäßig über 08–18 Uhr
    const HOUR_START=8, HOUR_END=18, DAY_MAX=30;

    // Nächsten freien Slot morgen früh (08:05–08:55) berechnen
    const nextMorningSlot=()=>{
      const d=new Date();
      d.setDate(d.getDate()+1);
      d.setHours(HOUR_START,5+Math.floor(Math.random()*50),0,0);
      return d;
    };

    const run=async()=>{
      const now=new Date();
      const hour=now.getHours();

      // ── Außerhalb Geschäftszeiten: überfällige Mails auf morgen früh verschieben
      if(hour<HOUR_START||hour>=HOUR_END){
        setLeads(p=>p.map(lead=>{
          if(lead.status==="archived"||lead.status==="replied"||lead.status==="stopped")return lead;
          const changed=lead.sequence?.some(s=>s.status==="scheduled"&&s.scheduledAt&&new Date(s.scheduledAt)<=now);
          if(!changed)return lead;
          return{...lead,sequence:lead.sequence.map(s=>{
            if(s.status==="scheduled"&&s.scheduledAt&&new Date(s.scheduledAt)<=now)
              return{...s,scheduledAt:nextMorningSlot()};
            return s;
          })};
        }));
        return;
      }

      // ── Heute bereits gesendete Mails pro Account zählen
      const todayStr=now.toDateString();
      const sentToday={};
      for(const lead of leads)
        for(const s of (lead.sequence||[]))
          if(s.status==="sent"&&s.sentAt&&new Date(s.sentAt).toDateString()===todayStr)
            sentToday[s.accountId]=(sentToday[s.accountId]||0)+1;

      // ── Eine Mail pro Run senden
      let sentThisRun=0;
      outer:for(const lead of leads){
        if(lead.status==="archived"||lead.status==="replied"||lead.status==="stopped")continue;
        for(const seq of (lead.sequence||[])){
          if(seq.status!=="scheduled"||!seq.scheduledAt)continue;
          if(new Date(seq.scheduledAt)>now)continue;
          const acc=accounts.find(a=>a.id===seq.accountId&&a.active!==false);
          if(!acc)continue;
          const pass=accPasswords[acc.id];
          if(!pass)continue;
          // Tageslimit 30/Account prüfen
          if((sentToday[acc.id]||0)>=DAY_MAX){
            // Limit erreicht — auf morgen verschieben
            setLeads(p=>p.map(l=>{
              if(l.id!==lead.id)return l;
              return{...l,sequence:l.sequence.map(s=>s.step===seq.step?{...s,scheduledAt:nextMorningSlot()}:s)};
            }));
            continue;
          }
          // 2-Min Mindestabstand pro Account prüfen
          const lastSent=lastSentRef.current[acc.id]||0;
          if(Date.now()-lastSent<SEND_GAP_MS)continue;

          const mail=getEffectiveMail(lead,seq.step);
          try{
            const res=await fetch("/api/send-test",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:lead.lead.email,subject:mail.subject,html:mail.bodyHtml,smtp:{host:acc.smtpHost,port:parseInt(acc.smtpPort),user:acc.email,pass,fromName:acc.name||IC.name}})});
            const data=await res.json();
            lastSentRef.current[acc.id]=Date.now();
            if(data.ok){
              sentToday[acc.id]=(sentToday[acc.id]||0)+1;
              setLeads(p=>p.map(l=>{
                if(l.id!==lead.id)return l;
                const s2=l.sequence.map(s=>s.step===seq.step?{...s,status:"sent",sentAt:new Date()}:s);
                const done=s2.every(s=>s.status==="sent"||s.status==="stopped");
                return{...l,sequence:s2,status:done?"completed":l.status};
              }));
            }else{
              setLeads(p=>p.map(l=>{
                if(l.id!==lead.id)return l;
                return{...l,sequence:l.sequence.map(s=>s.step===seq.step?{...s,status:"failed",failedAt:new Date(),failReason:data.error||"Unbekannter Fehler"}:s)};
              }));
            }
          }catch(e){
            lastSentRef.current[acc.id]=Date.now();
            setLeads(p=>p.map(l=>{
              if(l.id!==lead.id)return l;
              return{...l,sequence:l.sequence.map(s=>s.step===seq.step?{...s,status:"failed",failedAt:new Date(),failReason:e?.message||"Netzwerkfehler"}:s)};
            }));
          }
          sentThisRun++;
          if(sentThisRun>=1)break outer; // Max 1 pro 2-Min-Run
        }
      }
    };
    const id=setInterval(run,2*60*1000);
    return()=>clearInterval(id);
  },[leads,accounts,accPasswords,templates]);

  // ── AUTO REPLY CHECK: every 15 min ─────────────────────────────────────────
  useEffect(()=>{
    const id=setInterval(()=>{
      const hasPass=accounts.some(a=>a.active!==false&&accPasswords[a.id]);
      const hasActive=leads.some(l=>l.status==="active");
      if(hasPass&&hasActive)checkReplies();
    },15*60*1000);
    return()=>clearInterval(id);
  },[leads,accounts,accPasswords]);

  const todayStr=new Date().toDateString();
  const allSteps=leads.flatMap(l=>l.sequence||[]);
  const stats={
    total:leads.length,active:leads.filter(l=>l.status==="active").length,
    replied:leads.filter(l=>l.status==="replied").length,
    today:allSteps.filter(s=>s.scheduledAt&&new Date(s.scheduledAt).toDateString()===todayStr).length,
    sent:allSteps.filter(s=>s.status==="sent").length,
    failed:allSteps.filter(s=>s.status==="failed").length,
    pending:allSteps.filter(s=>s.status==="pending"||s.status==="scheduled").length,
    next:leads.filter(l=>l.status==="active").flatMap(l=>(l.sequence||[]).filter(s=>s.status==="scheduled").map(s=>({...s,name:`${l.lead.vorname} ${l.lead.nachname}`}))).sort((a,b)=>new Date(a.scheduledAt)-new Date(b.scheduledAt))[0],
  };

  const saveAcc=()=>{
    if(!accForm.name.trim()||!accForm.email.trim())return;
    const{password,...rest}=accForm;
    if(editAccId){
      setAccounts(p=>p.map(a=>a.id===editAccId?{...a,...rest}:a));
      if(password) setAccPasswords(p=>({...p,[editAccId]:password}));
      setEditAccId(null);
    } else {
      const id="acc"+Date.now();
      setAccounts(p=>[...p,{id,...rest,active:true}]);
      if(password) setAccPasswords(p=>({...p,[id]:password}));
    }
    setAccForm(EMPTY_ACC);setShowAccForm(false);
  };
  const accColor=id=>{const i=accounts.findIndex(a=>a.id===id);return ACC_COLORS[i%ACC_COLORS.length]||IC.gold;};

  const makeLead=(ld,insId)=>({id:Date.now()+Math.random(),lead:{...ld},insurer:insId,previewUrl:generatePreviewUrl(ld,insId),status:"active",sequence:scheduleSequence(ld,new Date(),activeAccounts,templates),createdAt:new Date(),repliedAt:null,mailOverrides:{}});
  const validateLead=l=>{const e={};["vorname","nachname","email","telefon","ort"].forEach(k=>{if(!l[k]?.trim())e[k]=true;});setFormErrors(e);return!Object.keys(e).length;};
  const findDup=(email)=>leads.find(l=>l.lead.email?.toLowerCase()===email?.toLowerCase());
  const addSingle=async()=>{
    if(!validateLead(leadForm))return;
    const dup=findDup(leadForm.email);
    if(dup){setDupModal([{existing:dup,newLead:null,form:leadForm,insId:selIns}]);return;}
    const nl=makeLead(leadForm,selIns);const su=await shortenUrl(nl.previewUrl,makeAlias(leadForm,selIns));
    setLeads(p=>[...p,{...nl,previewUrl:su}]);setLeadForm(EMPTY_LEAD);setFormErrors({});setTab("leads");
  };
  const importCSV=async()=>{
    const lines=csvText.trim().split("\n").filter(Boolean).slice(1);const log=[];
    const nl=lines.map((line)=>{
      const parts=line.split(";").map(s=>s?.trim());
      const[vorname,nachname,email,telefon,strasse,plz,ort]=parts;
      if(!vorname||!email)return null;
      const ld={vorname,nachname,email,telefon:telefon||"",strasse:strasse||"",plz:plz||"",ort:ort||""};
      const det=detectFromRow(parts)||selIns;
      log.push({name:`${vorname} ${nachname}`,ins:VERSICHERER[det]?.name,auto:!!detectFromRow(parts)});
      return makeLead(ld,det);
    }).filter(Boolean);
    const shortened=await Promise.all(nl.map(async l=>({...l,previewUrl:await shortenUrl(l.previewUrl,makeAlias(l.lead,l.insurer))})));
    const dups=shortened.filter(nl=>leads.some(l=>l.lead.email?.toLowerCase()===nl.lead.email?.toLowerCase()));
    const clean=shortened.filter(nl=>!leads.some(l=>l.lead.email?.toLowerCase()===nl.lead.email?.toLowerCase()));
    setLeads(p=>[...p,...clean]);
    if(dups.length)setDupModal(dups.map(nl=>({existing:leads.find(l=>l.lead.email?.toLowerCase()===nl.lead.email?.toLowerCase()),newLead:nl})));
    setDetectLog(log);setCsvText("");setTab("leads");
  };

  const markReplied=id=>setLeads(p=>p.map(l=>l.id!==id?l:{...l,status:"replied",repliedAt:new Date(),sequence:l.sequence.map(s=>s.status==="scheduled"?{...s,status:"stopped"}:s)}));
  const markStepSent=(lid,step)=>setLeads(p=>p.map(l=>{if(l.id!==lid)return l;const seq=l.sequence.map(s=>s.step===step?{...s,status:"sent",sentAt:new Date()}:s);const done=seq.every(s=>s.status==="sent"||s.status==="stopped");return{...l,sequence:seq,status:done?"completed":l.status};}));
  const stopLead=id=>setLeads(p=>p.map(l=>l.id!==id?l:{...l,status:"stopped",sequence:l.sequence.map(s=>s.status==="scheduled"?{...s,status:"stopped"}:s)}));
  const removeLead=id=>setLeads(p=>p.filter(l=>l.id!==id));
  const setLeadUrl=(id,url)=>setLeads(p=>p.map(l=>l.id===id?{...l,previewUrl:url}:l));
  const setMailOverride=(lid,step,field,value)=>setLeads(p=>p.map(l=>l.id!==lid?l:{...l,mailOverrides:{...l.mailOverrides,[step]:{...(l.mailOverrides[step]||{}),[field]:value}}}));
  const clearOverride=(lid,step)=>setLeads(p=>p.map(l=>l.id!==lid?l:{...l,mailOverrides:{...l.mailOverrides,[step]:undefined}}));
  const archiveLead=id=>setLeads(p=>p.map(l=>l.id!==id?l:{...l,status:l.status==="archived"?"active":"archived"}));
  const startEditLead=lead=>{setEditLeadId(lead.id);setEditLeadForm({...lead.lead});};
  const saveEditLead=async()=>{if(!editLeadId||!editLeadForm)return;const insId=leads.find(l=>l.id===editLeadId)?.insurer;const su=await shortenUrl(generatePreviewUrl(editLeadForm,insId),makeAlias(editLeadForm,insId));setLeads(p=>p.map(l=>l.id!==editLeadId?l:{...l,lead:{...editLeadForm},previewUrl:su}));setEditLeadId(null);setEditLeadForm(null);};

  const getEffectiveMail=(lead,step)=>{
    const tpl=templates.find(t=>t.step===step);
    const ov=lead.mailOverrides?.[step];
    const ins=VERSICHERER[lead.insurer]?.name||"";
    const url=lead.previewUrl||generatePreviewUrl(lead.lead,lead.insurer);
    return{
      subject:interpolate(ov?.subject??tpl?.subject??"",lead.lead,ins,url),
      body:interpolate(ov?.body??tpl?.body??"",lead.lead,ins,url),
      bodyHtml:interpolateHtml(ov?.body??tpl?.body??"",lead.lead,ins,url),
      isOverride:!!(ov?.subject||ov?.body),
    };
  };

  // ── REPLY TRACKER ──────────────────────────────────────────────────────────
  const checkReplies=async()=>{
    if(trackerStatus==="checking")return;
    const al=leads.filter(l=>l.status==="active").map(l=>({id:l.id,email:l.lead.email,lastSentAt:l.sequence.filter(s=>s.status==="sent").sort((a,b)=>new Date(b.sentAt)-new Date(a.sentAt))[0]?.sentAt||null}));
    if(!al.length){setTrackerLog(["Keine aktiven Leads."]);return;}
    const accsWP=activeAccounts.map(a=>({email:a.email,imapHost:a.imapHost,imapPort:a.imapPort,pass:accPasswords[a.id]||""})).filter(a=>a.pass);
    if(!accsWP.length){setTrackerLog(["⚠ Kein IMAP-Passwort eingetragen — gehe zu Mail-Accounts."]);return;}
    if(backendUrl.includes("[")){ setTrackerLog(["⚠ Backend URL nicht konfiguriert — gehe zu Einstellungen."]);return;}
    setTrackerStatus("checking");setTrackerLog(["🔍 Checke Postfächer..."]);
    try{
      const res=await fetch(backendUrl,{method:"POST",headers:{"Content-Type":"application/json","X-Secret":backendSecret},body:JSON.stringify({leads:al,accounts:accsWP})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"Fehler");
      const log=[`✓ ${data.checked} Mails geprüft`];
      if(data.replied?.length){data.replied.forEach(r=>{markReplied(r.id);const l=leads.find(x=>x.id===r.id);log.push(`🎯 ${l?.lead.vorname} ${l?.lead.nachname} hat geantwortet — Sequenz gestoppt`);});}
      else log.push("Keine neuen Antworten.");
      setTrackerLog(log);setLastChecked(new Date());setTrackerStatus("done");
    }catch(e){setTrackerLog([`❌ ${e.message}`]);setTrackerStatus("error");}
  };

  const exportCSV=()=>{
    const rows=["Vorname;Nachname;Email;Ort;Versicherer;Status;Geantwortet;NächsterSchritt;Geplant",...leads.map(l=>{const ns=l.sequence?.find(s=>s.status==="scheduled");return`${l.lead.vorname};${l.lead.nachname};${l.lead.email};${l.lead.ort};${VERSICHERER[l.insurer]?.name};${LSL[l.status]};${l.repliedAt?new Date(l.repliedAt).toLocaleString("de-DE"):"–"};${ns?`Mail ${ns.step}`:"–"};${ns?.scheduledAt?new Date(ns.scheduledAt).toLocaleString("de-DE"):"–"}`;})].join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows],{type:"text/csv"}));a.download=`iconicone-${new Date().toISOString().slice(0,10)}.csv`;a.click();
  };

  const filtered=leads.filter(l=>{if(filterStatus!=="all"&&l.status!==filterStatus)return false;if(filterIns!=="all"&&l.insurer!==filterIns)return false;return true;});

  // ── MAIL PREVIEW MODAL ─────────────────────────────────────────────────────
  const MailPreviewModal=()=>{
    if(!showMailPreview)return null;
    const{lead,step}=showMailPreview;
    const mail=getEffectiveMail(lead,step);
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowMailPreview(null)}>
        <div style={{background:"#111108",border:`1px solid ${IC.goldDark}44`,borderRadius:16,width:"100%",maxWidth:620,maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
          {/* Modal Header */}
          <div style={{padding:"14px 18px",borderBottom:`1px solid #1e1e14`,display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0d0d0b"}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:IC.white}}>Mail {step} Vorschau</div>
              <div style={{fontSize:10,color:IC.muted,marginTop:1}}>{lead.lead.vorname} {lead.lead.nachname} · {VERSICHERER[lead.insurer]?.name}</div>
            </div>
            <button style={{background:"none",border:"none",color:IC.muted,cursor:"pointer",fontSize:18,lineHeight:1}} onClick={()=>setShowMailPreview(null)}>✕</button>
          </div>
          {/* Mail Info */}
          <div style={{padding:"10px 18px",borderBottom:`1px solid #1e1e14`,display:"flex",gap:14,flexWrap:"wrap",background:"#0a0a08"}}>
            <div><span style={{fontSize:9,color:"#3a3830",textTransform:"uppercase"}}>Betreff  </span><span style={{fontSize:11,color:"#7db3f0",fontWeight:600}}>{mail.subject}</span></div>
            <div><span style={{fontSize:9,color:"#3a3830",textTransform:"uppercase"}}>An  </span><span style={{fontSize:11,color:IC.white}}>{lead.lead.email}</span></div>
          </div>
          {/* Mail Body */}
          <div style={{flex:1,overflowY:"auto",padding:"16px 18px"}}>
            {/* Signatur Preview */}
            <pre style={{fontSize:11,color:"#8a8070",lineHeight:1.75,whiteSpace:"pre-wrap",margin:0,fontFamily:"Arial,sans-serif"}}>
              {mail.body.replace(SIGNATUR_TEXT,"")}
            </pre>
            {/* Achi Signatur visuell */}
            <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid #1e1e14`,display:"flex",alignItems:"center",gap:12}}>
              <img src={IC.achiFace} alt="Achi Schmidt" style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:`2px solid ${IC.gold}`}} onError={e=>e.target.style.display="none"}/>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:IC.white}}>{IC.name}</div>
                <div style={{fontSize:10,color:IC.gold,fontStyle:"italic",marginBottom:4}}>{IC.title}</div>
                <div style={{fontSize:10,color:IC.muted,lineHeight:1.7}}>
                  <span style={{color:IC.gold}}>📞</span> {IC.tel} &nbsp;·&nbsp;
                  <span style={{color:IC.gold}}>✉</span> {IC.email}
                </div>
              </div>
              <img src={IC.logo} alt="ICONICONE" style={{height:22,marginLeft:"auto",opacity:0.7}} onError={e=>e.target.style.display="none"}/>
            </div>
          </div>
          {/* Actions */}
          <div style={{padding:"10px 18px",borderTop:`1px solid #1e1e14`,display:"flex",gap:6}}>
            <button style={S.btn("pri")} onClick={async()=>{await navigator.clipboard.writeText(`Betreff: ${mail.subject}\n\n${mail.body}`);setShowMailPreview(null);}}>📋 Kopieren</button>
            <a href={`mailto:${lead.lead.email}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`} style={{...S.btn("blue"),display:"inline-flex",textDecoration:"none"}} onClick={()=>setShowMailPreview(null)}>📧 Mail-App öffnen</a>
            <button style={{...S.btn("ghost"),marginLeft:"auto"}} onClick={()=>setShowMailPreview(null)}>Schließen</button>
          </div>
        </div>
      </div>
    );
  };

  const [testSmtpPass,setTestSmtpPass]=useState("");
  const [dupModal,setDupModal]=useState(null); // [{existing, newLead}]

  const buildDemoMail=async(step,insId)=>{
    const demoData={vorname:"Max",nachname:"Mustermann",email:testMailTo||"test@example.de",ort:"Berlin"};
    const shortUrl=await shortenUrl(generatePreviewUrl(demoData,insId),makeAlias(demoData,insId));
    const demoLead={lead:demoData,insurer:insId,previewUrl:shortUrl};
    return getEffectiveMail(demoLead,step);
  };

  const sendTestMail=async()=>{
    if(!testMailTo||!testMailModal)return;
    const acc=activeAccounts[0];
    const pass=testSmtpPass||accPasswords[acc?.id]||"";
    if(!acc||!pass){
      setTestMailResult("⚠ Bitte Passwort für website@iconicone.de eingeben.");
      return;
    }
    // Save password for future use
    if(testSmtpPass) setAccPasswords(p=>({...p,[acc.id]:testSmtpPass}));
    const mail=await buildDemoMail(testMailModal.step, testMailModal.insId||Object.keys(VERSICHERER)[0]);
    setTestMailSending(true);setTestMailResult(null);
    try{
      const res=await fetch("/api/send-test",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:testMailTo,subject:mail.subject,html:mail.bodyHtml,smtp:{host:acc.smtpHost,port:parseInt(acc.smtpPort),user:acc.email,pass}})});
      const data=await res.json();
      setTestMailResult(data.ok?"✅ Gesendet! Checke dein Postfach.":"❌ "+data.error);
    }catch(e){setTestMailResult("❌ "+e.message);}
    setTestMailSending(false);
  };

  // ══════════════════════════════════════════════════════════════════════════
  return(
    <div style={S.app}>

      {/* WEBSITE PREVIEW MODAL */}
      {vPreview&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.7)",display:"flex",flexDirection:"column"}}>
          <div style={{background:"#fff",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #e2e8f0",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:WEBSITE_TEMPLATES.find(t=>t.folder===vPreview)?.color||"#2563eb"}}/>
              <span style={{fontWeight:700,fontSize:14,color:"#1e2532"}}>{WEBSITE_TEMPLATES.find(t=>t.folder===vPreview)?.label} — Basis-Template</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <a href={`/templates/${vPreview}/index.html`} target="_blank" rel="noreferrer" style={{...S.btn(),textDecoration:"none",fontSize:12}}>↗ Neu öffnen</a>
              <button style={S.btn("ghost")} onClick={()=>setVPreview(null)}>✕ Schließen</button>
            </div>
          </div>
          <iframe src={`/templates/${vPreview}/index.html`} style={{flex:1,border:"none"}} title="Website Preview"/>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {editLeadId&&editLeadForm&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:520,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:15,fontWeight:700,color:"#1e2532",marginBottom:16}}>✏ Lead bearbeiten</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              {[{k:"vorname",l:"Vorname"},{k:"nachname",l:"Nachname"},{k:"email",l:"E-Mail",f:true},{k:"telefon",l:"Telefon"},{k:"strasse",l:"Straße",f:true},{k:"plz",l:"PLZ"},{k:"ort",l:"Ort"}].map(f=>(
                <div key={f.k} style={{gridColumn:f.f?"1/-1":"auto"}}>
                  <label style={S.lbl}>{f.l}</label>
                  <input value={editLeadForm[f.k]||""} onChange={e=>setEditLeadForm(p=>({...p,[f.k]:e.target.value}))} style={S.inp(false)} onFocus={e=>e.target.style.borderColor="#2563eb"} onBlur={e=>e.target.style.borderColor="#cbd5e1"}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
              <button style={S.btn("ghost")} onClick={()=>{setEditLeadId(null);setEditLeadForm(null);}}>Abbrechen</button>
              <button style={S.btn()} onClick={saveEditLead}>💾 Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* DUPLIKAT MODAL */}
      {dupModal&&(
        <div style={{position:"fixed",inset:0,zIndex:2100,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:520,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)",maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{fontSize:16,fontWeight:700,color:"#1e2532",marginBottom:4}}>⚠ Duplikat{dupModal.length>1?"e":""} gefunden</div>
            <div style={{fontSize:12,color:"#64748b",marginBottom:18}}>{dupModal.length} Lead{dupModal.length>1?"s":""} mit dieser E-Mail {dupModal.length>1?"existieren":"existiert"} bereits.</div>
            {dupModal.map((d,i)=>{
              const ex=d.existing;
              const nw=d.newLead;
              const cfg=VERSICHERER[ex?.insurer];
              return(
                <div key={i} style={{background:"#f8fafc",borderRadius:10,padding:"14px 16px",marginBottom:10,border:"1.5px solid #fbbf24"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:6}}>📧 {ex?.lead?.email}</div>
                  <div style={{fontSize:11,color:"#1e2532",marginBottom:2}}><strong>Bestehend:</strong> {ex?.lead?.vorname} {ex?.lead?.nachname} · {cfg?.name||ex?.insurer} · {ex?.lead?.ort}</div>
                  {nw&&<div style={{fontSize:11,color:"#475569",marginBottom:8}}><strong>Neu:</strong> {nw?.lead?.vorname} {nw?.lead?.nachname} · {VERSICHERER[nw?.insurer]?.name||nw?.insurer} · {nw?.lead?.ort}</div>}
                  <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:8}}>
                    <button style={{...S.btn("ghost"),fontSize:11,padding:"5px 10px"}} onClick={()=>{startEditLead(ex);setDupModal(null);}}>✏ Bearbeiten</button>
                    {nw&&<button style={{...S.btn("blue"),fontSize:11,padding:"5px 10px"}} onClick={async()=>{
                      setLeads(p=>p.map(l=>l.id===ex.id?{...ex,...nw,id:ex.id}:l));
                      setDupModal(p=>{const r=p.filter((_,j)=>j!==i);return r.length?r:null;});
                    }}>🔄 Ersetzen</button>}
                    {(nw||d.form)&&<button style={{...S.btn(),fontSize:11,padding:"5px 10px",background:"rgba(16,185,129,0.1)",color:"#059669",border:"1px solid rgba(16,185,129,0.2)"}} onClick={async()=>{
                      if(nw){setLeads(p=>[...p,nw]);}
                      else if(d.form){const nl=makeLead(d.form,d.insId);const su=await shortenUrl(nl.previewUrl,makeAlias(d.form,d.insId));setLeads(p=>[...p,{...nl,previewUrl:su}]);setLeadForm(EMPTY_LEAD);setFormErrors({});}
                      setDupModal(p=>{const r=p.filter((_,j)=>j!==i);return r.length?r:null;});
                    }}>+ Trotzdem hinzufügen</button>}
                    <button style={{...S.btn("ghost"),fontSize:11,padding:"5px 10px",color:"#ef4444"}} onClick={()=>{removeLead(ex.id);setDupModal(p=>{const r=p.filter((_,j)=>j!==i);return r.length?r:null;});}}>🗑 Löschen</button>
                  </div>
                </div>
              );
            })}
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}>
              <button style={S.btn("ghost")} onClick={()=>setDupModal(null)}>Schließen</button>
            </div>
          </div>
        </div>
      )}

      {/* TEST MAIL MODAL */}
      {testMailModal&&(
        <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:460,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:16,fontWeight:700,color:"#1e2532",marginBottom:4}}>📤 Test-Mail senden — Mail {testMailModal.step}</div>
            <div style={{fontSize:12,color:"#64748b",marginBottom:18}}>Wird gesendet von <strong>website@iconicone.de</strong> (Strato SMTP)</div>

            <label style={S.lbl}>Versicherung (für Vorschau)</label>
            <select value={testMailModal.insId||Object.keys(VERSICHERER)[0]} onChange={e=>setTestMailModal(p=>({...p,insId:e.target.value}))} style={{...S.inp(false),marginBottom:12}}>
              {Object.values(VERSICHERER).map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
            </select>

            <label style={S.lbl}>Deine E-Mail (Empfänger)</label>
            <input value={testMailTo} onChange={e=>setTestMailTo(e.target.value)} placeholder="deine@gmail.com" style={{...S.inp(false),marginBottom:12}} autoFocus/>

            <label style={S.lbl}>
              Passwort für website@iconicone.de
              {accPasswords[activeAccounts[0]?.id]&&<span style={{color:"#10b981",fontWeight:400}}> ✓ gespeichert</span>}
            </label>
            <input
              type="password"
              value={testSmtpPass||(accPasswords[activeAccounts[0]?.id]||"")}
              onChange={e=>setTestSmtpPass(e.target.value)}
              placeholder={accPasswords[activeAccounts[0]?.id]?"••••••••• (gespeichert)":"Strato-Passwort eingeben"}
              style={{...S.inp(false),marginBottom:14}}
              onKeyDown={e=>e.key==="Enter"&&sendTestMail()}
            />

            <div style={{background:"#f8fafc",borderRadius:8,padding:"9px 12px",fontSize:11,color:"#475569",marginBottom:14,border:"1px solid #e2e8f0"}}>
              <span style={{fontWeight:600}}>Betreff: </span>
              {(templates.find(t=>t.step===testMailModal.step)?.subject||"").replace(/{{VORNAME}}/g,"Max").replace(/{{NACHNAME}}/g,"Mustermann").replace(/{{ORT}}/g,"Berlin").replace(/{{VERSICHERER}}/g,VERSICHERER[testMailModal.insId||Object.keys(VERSICHERER)[0]]?.name||"")}
            </div>

            {testMailResult&&<div style={{padding:"8px 12px",borderRadius:8,marginBottom:12,fontSize:13,background:testMailResult.startsWith("✅")?"#f0fdf4":"#fff1f2",color:testMailResult.startsWith("✅")?"#15803d":"#dc2626",border:`1px solid ${testMailResult.startsWith("✅")?"#bbf7d0":"#fecaca"}`}}>{testMailResult}</div>}

            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button style={S.btn("ghost")} onClick={()=>{setTestMailModal(null);setTestMailResult(null);setTestSmtpPass("");}}>Abbrechen</button>
              <button style={S.btn()} onClick={sendTestMail} disabled={testMailSending||!testMailTo}>
                {testMailSending?"Wird gesendet…":"📤 Jetzt senden"}
              </button>
            </div>
            <div style={{fontSize:10,color:"#94a3b8",marginTop:8}}>Das Passwort wird nach dem Senden lokal gespeichert.</div>
          </div>
        </div>
      )}

      {/* MODAL */}
      <MailPreviewModal/>

      {/* HEADER */}
      <div style={S.hdr}>
        <div style={S.hdrIn}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <img src={IC.logo} alt="ICONICONE" style={{height:28,opacity:0.9}} onError={e=>e.target.style.display="none"}/>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:IC.white}}>Outreach Engine <span style={{fontSize:9,color:`${IC.gold}66`}}>v6</span></div>
              <div style={{fontSize:9,color:`${IC.gold}55`}}>5-Mail Sequenz · Auto Reply-Tracking · {activeAccounts.length} Account{activeAccounts.length!==1?"s":""} aktiv</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            {[{l:"Leads",v:stats.total,c:IC.white},{l:"Aktiv",v:stats.active,c:"#3b82f6"},{l:"Pending",v:stats.pending,c:IC.gold},{l:"Gesendet",v:stats.sent,c:"#10b981"},{l:"Failed",v:stats.failed,c:"#ef4444"},{l:"Geantw.",v:stats.replied,c:"#a78bfa"}].map(s=>(
              <div key={s.l} style={S.statPill}><div style={{fontSize:15,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:8,color:"#3a3830",textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2}}>{s.l}</div></div>
            ))}
            <button style={{...S.btn(trackerStatus==="checking"?"ghost":"green"),display:"flex",alignItems:"center",gap:5}} onClick={checkReplies} disabled={trackerStatus==="checking"}>
              {trackerStatus==="checking"?"⟳ Checke...":"🔍 Replies checken"}
            </button>
            {lastChecked&&<div style={{fontSize:9,color:"#3a3830"}}>{lastChecked.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</div>}
          </div>
        </div>
        {trackerLog.length>0&&(
          <div style={{maxWidth:1300,margin:"5px auto 0",padding:"0 20px"}}>
            <div style={{background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.1)",borderRadius:8,padding:"6px 14px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              {trackerLog.map((l,i)=><span key={i} style={{fontSize:10,color:"#6a7060"}}>{l}</span>)}
              <button style={{...S.btn("ghost"),padding:"1px 6px",fontSize:8,marginLeft:"auto"}} onClick={()=>setTrackerLog([])}>✕</button>
            </div>
          </div>
        )}
      </div>

      {/* TABS */}
      <div style={S.tabs}>
        {[{id:"leads",l:"📋 Leads"},{id:"editor",l:"✏ Mail-Templates"},{id:"add",l:"➕ Lead"},{id:"accounts",l:"📬 Accounts"},{id:"settings",l:"⚙ Setup"}].map(t=>(
          <button key={t.id} style={S.tab(tab===t.id)} onClick={()=>setTab(t.id)}>{t.l}</button>
        ))}
      </div>

      <div style={S.body}>

        {/* ══════════ LEADS ══════════ */}
        {tab==="leads"&&(
          <div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
              <button style={S.btn()} onClick={exportCSV} disabled={!leads.length}>📊 CSV</button>
              {stats.next&&(
                <div style={{marginLeft:"auto",fontSize:9,color:"#3a3830",display:"flex",alignItems:"center",gap:5,background:"#111108",border:`1px solid #1e1e14`,borderRadius:8,padding:"5px 10px"}}>
                  <span style={{color:IC.gold,fontWeight:700}}>Nächste:</span>
                  <span style={{color:IC.white}}>{stats.next.name}</span>·
                  <span style={{color:"#3b82f6"}}>M{stats.next.step}</span>·
                  <span style={{color:IC.gold}}>{new Date(stats.next.scheduledAt).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})} {new Date(stats.next.scheduledAt).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</span>
                </div>
              )}
            </div>
            {detectLog.length>0&&(
              <div style={{...S.goldCard,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:9,color:IC.gold,fontWeight:700}}>🔍 Auto-Detection</span><button style={{...S.btn("ghost"),padding:"1px 5px",fontSize:8}} onClick={()=>setDetectLog([])}>✕</button></div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {detectLog.map((l,i)=><div key={i} style={{background:"#0a0a08",borderRadius:5,padding:"2px 7px",display:"flex",alignItems:"center",gap:3}}><VDot id={Object.values(VERSICHERER).find(v=>v.name===l.ins)?.id}/><span style={{fontSize:8,color:IC.muted}}>{l.name}</span><span style={{fontSize:8,color:l.auto?"#10b981":IC.gold,fontWeight:700}}>→{l.ins}{l.auto?" ✓":""}</span></div>)}
                </div>
              </div>
            )}
            {/* Filter */}
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10,alignItems:"center"}}>
              <span style={{fontSize:8,color:"#3a3830",textTransform:"uppercase"}}>Status:</span>
              {[{id:"all",l:"Alle"},...Object.entries(LSL).map(([id,l])=>({id,l}))].map(s=><button key={s.id} onClick={()=>setFilterStatus(s.id)} style={{...S.btn("ghost"),padding:"2px 7px",fontSize:8,background:filterStatus===s.id?"#1a1a12":"transparent",color:filterStatus===s.id&&s.id!=="all"?LSC[s.id]:"inherit"}}>{s.l}</button>)}
              <span style={{fontSize:8,color:"#3a3830",textTransform:"uppercase",marginLeft:6}}>Versicherer:</span>
              {[{id:"all"},...Object.values(VERSICHERER)].map(v=><button key={v.id} onClick={()=>setFilterIns(v.id)} style={{...S.btn("ghost"),padding:"2px 7px",fontSize:8,background:filterIns===v.id?"#1a1a12":"transparent",display:"flex",alignItems:"center",gap:3}}>{v.id!=="all"&&<VDot id={v.id} sz={4}/>}{v.id==="all"?"Alle":v.shortName}</button>)}
            </div>
            {!filtered.length?(
              <div style={{...S.card,textAlign:"center",padding:"32px"}}>
                <div style={{fontSize:28,marginBottom:6}}>📭</div>
                <div style={{fontSize:11,color:"#3a3830",marginBottom:12}}>{leads.length?"Keine Treffer":"Noch keine Leads"}</div>
                {!leads.length&&<button style={S.btn()} onClick={()=>setTab("add")}>+ Lead hinzufügen</button>}
              </div>
            ):filtered.map(lead=>{
              const cfg=VERSICHERER[lead.insurer];const isExp=expandLead===lead.id;
              const sentCount=lead.sequence?.filter(s=>s.status==="sent").length||0;
              return(
                <div key={lead.id} style={{...S.card,padding:0,border:`1px solid ${lead.status==="replied"?"rgba(16,185,129,0.15)":"#1e1e14"}`,overflow:"hidden"}}>
                  <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",cursor:"pointer"}} onClick={()=>setExpandLead(isExp?null:lead.id)}>
                    <div style={{width:3,alignSelf:"stretch",background:cfg?.primary,borderRadius:2,flexShrink:0,minHeight:26}}/>
                    <div style={S.pill(LSC[lead.status])}>{LSL[lead.status]}</div>
                    <div style={{flex:1,minWidth:130}}>
                      <div style={{fontSize:11,fontWeight:700,color:IC.white}}>{lead.lead.vorname} {lead.lead.nachname}</div>
                      <div style={{display:"flex",alignItems:"center",gap:4,marginTop:1}}><VDot id={lead.insurer} sz={4}/><span style={{fontSize:9,color:cfg?.primary,fontWeight:600}}>{cfg?.name}</span><span style={{fontSize:9,color:"#3a3830"}}>· {lead.lead.ort} · {lead.lead.email}</span></div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:3}}>
                      {lead.sequence?.map(s=>{const def=templates.find(t=>t.step===s.step);return<div key={s.step} title={s.status==="failed"?s.failReason:undefined} style={S.stepDot(s.status,def?.tagColor)}>{s.status==="sent"?"✓":s.status==="failed"?"✕":s.status==="stopped"?"–":s.status==="pending"?"·":s.step}</div>;})}
                      <span style={{fontSize:8,color:"#3a3830",marginLeft:2}}>{sentCount}/5</span>
                    </div>
                    {lead.status==="active"&&(()=>{const ns=lead.sequence?.find(s=>s.status==="scheduled");if(!ns)return null;return<div style={{fontSize:8,textAlign:"right",minWidth:65}}><div style={{color:IC.gold,fontWeight:700}}>{new Date(ns.scheduledAt).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})} {new Date(ns.scheduledAt).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</div><div style={{color:accColor(ns.accountId),marginTop:1,fontSize:7}}>{accounts.find(a=>a.id===ns.accountId)?.email?.split("@")[0]||"?"}</div></div>;})()}
                    <div style={{display:"flex",gap:3}} onClick={e=>e.stopPropagation()}>
                      {lead.status==="active"&&<button style={S.btn("green")} onClick={()=>markReplied(lead.id)}>✉ Geantwortet</button>}
                      {lead.status==="active"&&<button style={S.btn("red")} onClick={()=>stopLead(lead.id)}>⏹</button>}
                      <button title="Bearbeiten" style={{...S.btn("ghost"),fontSize:10,padding:"3px 7px"}} onClick={()=>startEditLead(lead)}>✏</button>
                      <button title={lead.status==="archived"?"Wiederherstellen":"Archivieren"} style={{...S.btn("ghost"),fontSize:10,padding:"3px 7px",color:"#94a3b8"}} onClick={()=>archiveLead(lead.id)}>{lead.status==="archived"?"↩":"📁"}</button>
                      <button title="Löschen" style={{...S.btn("red"),fontSize:10,padding:"3px 7px"}} onClick={()=>removeLead(lead.id)}>🗑</button>
                    </div>
                    <span style={{fontSize:9,color:"#3a3830"}}>{isExp?"▲":"▼"}</span>
                  </div>
                  {isExp&&(
                    <div style={{borderTop:"1px solid #1a1a12",background:"#0a0a08"}}>
                      <div style={{padding:"7px 14px",borderBottom:"1px solid #1a1a12"}}>
                        <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4}}>
                          <span style={{fontSize:8,color:"#3a3830",flexShrink:0,textTransform:"uppercase"}}>Preview-Link (personalisiert):</span>
                          <div style={{display:"flex",gap:4,marginLeft:"auto"}}>
                            <button title="Neu generieren" style={{...S.btn("ghost"),padding:"2px 7px",fontSize:9}} onClick={async()=>{const su=await shortenUrl(generatePreviewUrl(lead.lead,lead.insurer),makeAlias(lead.lead,lead.insurer));setLeadUrl(lead.id,su);}}>⟳</button>
                            {lead.previewUrl&&<button title="Kopieren" style={{...S.btn("ghost"),padding:"2px 7px",fontSize:9}} onClick={()=>navigator.clipboard.writeText(lead.previewUrl)}>📋</button>}
                            {lead.previewUrl&&<a href={lead.previewUrl} target="_blank" rel="noreferrer" title="Vorschau öffnen" style={{...S.btn("ghost"),padding:"2px 7px",fontSize:9,textDecoration:"none"}}>👁 Vorschau</a>}
                          </div>
                        </div>
                        {lead.previewUrl?(
                          <div style={{fontSize:9,color:"#10b981",background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.1)",borderRadius:6,padding:"4px 9px",wordBreak:"break-all",lineHeight:1.5}}>
                            ✓ {lead.previewUrl}
                          </div>
                        ):(
                          <div style={{fontSize:9,color:"#3a3830",fontStyle:"italic"}}>Kein Link — klick ⟳ zum Generieren</div>
                        )}
                        <input value={lead.previewUrl||""} onChange={e=>setLeadUrl(lead.id,e.target.value)} placeholder="https://..." style={{...S.inp(false),fontSize:9,padding:"4px 8px",marginTop:5}} onFocus={e=>e.target.style.borderColor=IC.gold} onBlur={e=>e.target.style.borderColor="#1e1e14"}/>
                      </div>
                      {lead.status==="replied"&&<div style={{padding:"6px 14px",background:"rgba(16,185,129,0.05)",borderBottom:"1px solid rgba(16,185,129,0.1)",fontSize:9,color:"#10b981"}}>✓ Geantwortet {lead.repliedAt?`· ${new Date(lead.repliedAt).toLocaleString("de-DE")}`:""} — alle weiteren Mails gestoppt</div>}
                      {lead.sequence?.map(seq=>{
                        const def=templates.find(t=>t.step===seq.step);
                        const mail=getEffectiveMail(lead,seq.step);
                        const isExpS=expandStep===`${lead.id}-${seq.step}`;
                        const acc=accounts.find(a=>a.id===seq.accountId);
                        const hasOv=!!(lead.mailOverrides?.[seq.step]?.subject||lead.mailOverrides?.[seq.step]?.body);
                        return(
                          <div key={seq.step} style={{borderBottom:"1px solid #1a1a12",opacity:seq.status==="stopped"?0.3:1}}>
                            <div style={{padding:"7px 14px",display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                              <div style={S.stepDot(seq.status,def?.tagColor)} title={seq.status==="failed"?seq.failReason:undefined}>{seq.status==="sent"?"✓":seq.status==="failed"?"✕":seq.status==="stopped"?"–":seq.status==="pending"?"·":seq.step}</div>
                              <div style={{flex:1,minWidth:100}}>
                                <div style={{display:"flex",alignItems:"center",gap:5}}>
                                  <span style={{fontSize:10,fontWeight:600,color:IC.white}}>{def?.label}</span>
                                  <span style={S.pill(def?.tagColor||IC.gold)}>{def?.tag}</span>
                                  {hasOv&&<span style={S.pill("#8b5cf6")}>✏ Individuell</span>}
                                </div>
                                <div style={{fontSize:8,color:"#3a3830",marginTop:1,fontStyle:"italic"}}>{mail.subject.slice(0,55)}…</div>
                              </div>
                              {seq.status==="pending"&&<div style={{fontSize:8,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",borderRadius:8,padding:"2px 7px",color:"#4ade80",fontWeight:700}}>Pending</div>}
                              {seq.status==="failed"&&<div style={{fontSize:8,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"2px 7px",color:"#f87171",fontWeight:700}} title={seq.failReason}>✕ Failed</div>}
                              {seq.scheduledAt&&seq.status==="scheduled"&&<div style={{fontSize:8,color:IC.gold}}>Pending: {new Date(seq.scheduledAt).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})} {new Date(seq.scheduledAt).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</div>}
                              {seq.scheduledAt&&seq.status==="sent"&&<div style={{fontSize:8,color:"#10b981",fontWeight:700}}>✓ Gesendet: {new Date(seq.sentAt||seq.scheduledAt).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})} {new Date(seq.sentAt||seq.scheduledAt).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</div>}
                              {seq.status==="stopped"&&<div style={{fontSize:8,color:"#2a2a20"}}>Gestoppt</div>}
                              {acc&&<div style={{fontSize:7,color:accColor(acc.id)}}>via {acc.email.split("@")[0]}</div>}
                              <div style={{display:"flex",gap:3}} onClick={e=>e.stopPropagation()}>
                                <button style={S.btn("sm")} onClick={()=>setShowMailPreview({lead,step:seq.step})}>👁</button>
                                <button style={{...S.btn("sm"),color:IC.gold}} onClick={()=>setExpandStep(isExpS?null:`${lead.id}-${seq.step}`)}>✏</button>
                                {(seq.status==="scheduled"||seq.status==="pending")&&lead.status==="active"&&<button style={{...S.btn("sm"),background:"rgba(16,185,129,0.1)",color:"#34d399",border:"1px solid rgba(16,185,129,0.15)"}} onClick={()=>markStepSent(lead.id,seq.step)}>✓</button>}
                                {seq.status==="failed"&&<button style={{...S.btn("sm"),background:"rgba(239,68,68,0.1)",color:"#f87171",border:"1px solid rgba(239,68,68,0.2)"}} onClick={()=>setLeads(p=>p.map(l=>l.id!==lead.id?l:{...l,sequence:l.sequence.map(s=>s.step===seq.step?{...s,status:"scheduled",failedAt:null,failReason:null}:s)}))}>↺ Retry</button>}
                              </div>
                            </div>
                            {isExpS&&<MailStepEditor mail={mail} hasOv={hasOv} lead={lead} step={seq.step} templates={templates} onSave={(s,b)=>{setMailOverride(lead.id,seq.step,"subject",s);setMailOverride(lead.id,seq.step,"body",b);setExpandStep(null);}} onClear={()=>clearOverride(lead.id,seq.step)} S={S} IC={IC}/>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════ MAIL TEMPLATES ══════════ */}
        {tab==="editor"&&(
          <div style={{maxWidth:800}}>
            <div style={S.goldCard}>
              <div style={{fontSize:10,color:IC.gold,fontWeight:700,marginBottom:3}}>Globale Templates — gelten für alle neuen Leads</div>
              <div style={{fontSize:9,color:IC.muted}}>Variablen: <code style={{color:IC.gold}}>{"{{VORNAME}} {{NACHNAME}} {{ORT}} {{VERSICHERER}} {{URL}} {{HUBSPOT}} {{SIGNATUR}}"}</code></div>
              <div style={{fontSize:9,color:"#3a3830",marginTop:3}}>{"{{SIGNATUR}}"} → wird automatisch mit Achi's Foto, Logo und Kontaktdaten ersetzt.</div>
            </div>
            {/* Sequenz Timeline */}
            <div style={{display:"flex",gap:0,marginBottom:14,flexWrap:"wrap"}}>
              {templates.map((t,i)=>(
                <div key={t.step} style={{display:"flex",alignItems:"center"}}>
                  {i>0&&<div style={{width:20,height:1,background:"#1e1e14"}}/>}
                  <button onClick={()=>setEditingTpl(editingTpl===t.step?null:t.step)} style={{background:editingTpl===t.step?`${t.tagColor}12`:"#111108",border:`1.5px solid ${editingTpl===t.step?t.tagColor:"#1e1e14"}`,borderRadius:8,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all 0.15s"}}>
                    <div style={{fontSize:9,fontWeight:700,color:t.tagColor}}>Mail {t.step}</div>
                    <div style={{fontSize:7,color:IC.muted,marginTop:1}}>{t.tag}</div>
                    <div style={{fontSize:7,color:"#3a3830",marginTop:1}}>{t.label}</div>
                  </button>
                </div>
              ))}
            </div>
            {editingTpl&&(()=>{
              const tpl=templates.find(t=>t.step===editingTpl);if(!tpl)return null;
              return(
                <div style={S.card}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}><span style={S.pill(tpl.tagColor)}>Mail {tpl.step} · {tpl.tag}</span><span style={{fontSize:14,fontWeight:600,color:"#1e2532"}}>{tpl.label}</span></div>
                    <button style={{...S.btn("blue"),display:"flex",alignItems:"center",gap:6}} onClick={()=>{setTestMailModal({step:tpl.step,insId:selIns||Object.keys(VERSICHERER)[0]});setTestMailResult(null);}}>✉ Test senden</button>
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={S.lbl}>Betreff</label>
                    <input value={tpl.subject} onChange={e=>setTemplates(p=>p.map(t=>t.step===editingTpl?{...t,subject:e.target.value}:t))} style={S.inp(false)} onFocus={e=>e.target.style.borderColor=tpl.tagColor} onBlur={e=>e.target.style.borderColor="#cbd5e1"}/>
                  </div>
                  <div>
                    <label style={S.lbl}>Text</label>
                    <textarea value={tpl.body} onChange={e=>setTemplates(p=>p.map(t=>t.step===editingTpl?{...t,body:e.target.value}:t))} style={{...S.ta,minHeight:260}} onFocus={e=>e.target.style.borderColor=tpl.tagColor} onBlur={e=>e.target.style.borderColor="#cbd5e1"}/>
                  </div>
                  <div style={{display:"flex",gap:7,marginTop:8}}>
                    <button style={S.btn("ghost")} onClick={()=>{const d=DEFAULT_TEMPLATES.find(x=>x.step===editingTpl);if(d)setTemplates(p=>p.map(t=>t.step===editingTpl?{...t,subject:d.subject,body:d.body}:t));}}>↺ Reset</button>
                    <div style={{fontSize:12,color:"#64748b",display:"flex",alignItems:"center"}}>Änderungen sofort aktiv</div>
                  </div>
                </div>
              );
            })()}

            {/* ── WEBSITE TEMPLATES GALERIE ── */}
            <div style={S.card}>
              <div style={{fontSize:14,fontWeight:700,color:"#1e2532",marginBottom:4}}>🌐 Website-Templates</div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>Fertige Websites — direkt im Tool vorschauen</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {WEBSITE_TEMPLATES.map(t=>(
                  <div key={t.folder} style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px",border:`1.5px solid ${t.color}22`,display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:t.color,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,color:"#1e2532",marginBottom:1}}>{t.label}</div>
                      <div style={{fontSize:10,color:t.color,fontWeight:600}}>Basis-Template</div>
                    </div>
                    <button style={{...S.btn(),padding:"6px 12px",fontSize:11,flexShrink:0,background:t.color,boxShadow:"none"}} onClick={()=>setVPreview(t.folder)}>👁</button>
                  </div>
                ))}
              </div>
            </div>
            {/* Signatur Vorschau */}
            <div style={S.card}>
              <div style={{fontSize:10,color:"#f97316",fontWeight:700,marginBottom:12}}>Signatur-Vorschau (automatisch in jeder Mail)</div>
              <div style={{background:"#fff",borderRadius:8,padding:"16px 20px",border:"3px solid #f97316",borderTop:"3px solid #f97316",maxWidth:480}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <img src={IC.achiFace} alt="" style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:"2px solid #f97316",flexShrink:0}} onError={e=>e.target.style.display="none"}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#f97316"}}>{IC.name}</div>
                    <div style={{fontSize:11,color:"#555",fontStyle:"italic",marginBottom:5}}>{IC.title} · ICONICONE</div>
                    <div style={{fontSize:11,color:"#333",lineHeight:1.9}}>
                      <a href={IC.telLink} style={{color:"#f97316",fontWeight:600,textDecoration:"none"}}>📞 {IC.tel}</a><br/>
                      <a href={`mailto:${IC.email}`} style={{color:"#f97316",fontWeight:600,textDecoration:"none"}}>✉ {IC.email}</a><br/>
                      <a href={IC.url} style={{color:"#f97316",fontWeight:600,textDecoration:"none"}}>🌐 www.iconicone.de</a>
                    </div>
                  </div>
                  <a href={IC.url}><img src={IC.logo} alt="ICONICONE" style={{height:22,opacity:0.9}} onError={e=>e.target.style.display="none"}/></a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ ADD LEAD ══════════ */}
        {tab==="add"&&(
          <div style={{maxWidth:540}}>
            <div style={{...S.card,marginBottom:12}}>
              <div style={{fontSize:9,color:"#3a3830",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Versicherer</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {Object.values(VERSICHERER).map(v=><button key={v.id} onClick={()=>setSelIns(v.id)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 11px",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:700,background:selIns===v.id?v.primary:"#111108",border:selIns===v.id?`2px solid ${v.accent}`:`2px solid #1e1e14`,color:"#fff",transition:"all 0.15s"}}><div style={{width:5,height:5,borderRadius:"50%",background:v.accent}}/>{v.shortName}</button>)}
              </div>
            </div>
            <div style={{display:"flex",gap:3,marginBottom:10}}>
              {["single","csv"].map(m=><button key={m} style={{...S.tab(addMode===m),padding:"8px 12px"}} onClick={()=>setAddMode(m)}>{m==="single"?"Einzeln":"CSV"}</button>)}
            </div>
            {addMode==="single"?(
              <div style={S.card}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                  {[{k:"vorname",l:"Vorname",p:"Thomas"},{k:"nachname",l:"Nachname",p:"Müller"},{k:"email",l:"E-Mail Lead",p:"t.mueller@example.de",f:true},{k:"telefon",l:"Telefon",p:"089 123456"},{k:"strasse",l:"Straße",p:"Hauptstraße 12",f:true},{k:"plz",l:"PLZ",p:"80331"},{k:"ort",l:"Ort",p:"München"}].map(f=>(
                    <div key={f.k} style={{gridColumn:f.f?"1/-1":"auto"}}>
                      <label style={S.lbl}>{f.l}{formErrors[f.k]&&<span style={{color:"#ef4444"}}> *</span>}</label>
                      <input value={leadForm[f.k]||""} onChange={e=>{setLeadForm(p=>({...p,[f.k]:e.target.value}));setFormErrors(p=>({...p,[f.k]:false}));}} placeholder={f.p} style={S.inp(formErrors[f.k])} onFocus={e=>e.target.style.borderColor=IC.gold} onBlur={e=>e.target.style.borderColor=formErrors[f.k]?"#ef4444":"#1e1e14"}/>
                    </div>
                  ))}
                </div>
                <button style={{...S.btn(),marginTop:12,width:"100%",padding:11}} onClick={addSingle}>+ Sequenz starten für {VERSICHERER[selIns]?.name}</button>
              </div>
            ):(
              <div style={S.card}>
                <div style={{fontSize:9,color:IC.muted,marginBottom:7,lineHeight:1.6}}>Format: <code style={{color:IC.gold,fontSize:8}}>Vorname;Nachname;Email;Telefon;Strasse;PLZ;Ort;Versicherer</code></div>
                {/* File upload drop zone */}
                <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,border:`2px dashed ${IC.gold}55`,borderRadius:8,padding:"14px 12px",marginBottom:8,cursor:"pointer",color:IC.muted,fontSize:11,background:"#111108",transition:"border-color 0.15s"}}
                  onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=IC.gold;}}
                  onDragLeave={e=>{e.currentTarget.style.borderColor=`${IC.gold}55`;}}
                  onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor=`${IC.gold}55`;const f=e.dataTransfer.files[0];if(f)f.text().then(t=>setCsvText(t.replace(/\r\n/g,"\n").replace(/\r/g,"\n")));}}
                >
                  <input type="file" accept=".csv,.txt" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)f.text().then(t=>setCsvText(t.replace(/\r\n/g,"\n").replace(/\r/g,"\n")));e.target.value="";}}/>
                  <span style={{fontSize:18}}>📂</span>
                  <span>CSV-Datei hochladen oder hier reinziehen</span>
                </label>
                <textarea value={csvText} onChange={e=>setCsvText(e.target.value)} placeholder={"Vorname;Nachname;Email;...;Versicherer\nThomas;Müller;t.mueller@example.de;089 123;Hauptstr 1;80331;München;SIGNAL IDUNA"} style={{...S.ta,minHeight:80}}/>
                <div style={{display:"flex",gap:6,marginTop:9}}>
                  <button style={S.btn()} onClick={importCSV} disabled={!csvText.trim()}>📥 {Math.max(0,csvText.trim().split("\n").length-1)} Leads importieren</button>
                  <button style={S.btn("ghost")} onClick={()=>setCsvText("Vorname;Nachname;Email;Telefon;Strasse;PLZ;Ort;Versicherer\nThomas;Müller;t.mueller@example.de;089 123456;Hauptstr 1;80331;München;SIGNAL IDUNA\nAnna;Schmidt;a.schmidt@example.de;030 456789;Berliner Str 5;10115;Berlin;ARAG")}>Demo</button>
                  {csvText&&<button style={S.btn("ghost")} onClick={()=>setCsvText("")}>✕</button>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ ACCOUNTS ══════════ */}
        {tab==="accounts"&&(
          <div style={{maxWidth:700}}>
            <div style={S.goldCard}>
              <div style={{fontSize:10,color:IC.gold,fontWeight:700,marginBottom:3}}>{activeAccounts.length*30} Mails/Tag Kapazität</div>
              <div style={{fontSize:9,color:IC.muted}}>30/Tag pro Account · 08–18 Uhr · Automatisch rotiert · Passwort wird lokal gespeichert<br/>Gmail: smtp.gmail.com:587, App-Passwort verwenden (Google Konto → Sicherheit → App-Passwörter)</div>
            </div>
            {accounts.map((acc,i)=>(
              <div key={acc.id} style={{...S.card,opacity:acc.active?1:0.5}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <div style={{width:32,height:32,borderRadius:9,background:`${ACC_COLORS[i%ACC_COLORS.length]}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>✉</div>
                  <div style={{flex:1,minWidth:150}}>
                    <div style={{fontSize:11,fontWeight:700,color:IC.white}}>{acc.name}</div>
                    <div style={{fontSize:10,color:ACC_COLORS[i%ACC_COLORS.length]}}>{acc.email}</div>
                    <div style={{fontSize:8,color:"#3a3830"}}>SMTP {acc.smtpHost}:{acc.smtpPort} · IMAP {acc.imapHost}:{acc.imapPort}</div>
                  </div>
                  <div style={{minWidth:170}}>
                    <label style={S.lbl}>IMAP-Passwort (Reply Tracking)</label>
                    <input type="password" value={accPasswords[acc.id]||""} onChange={e=>setAccPasswords(p=>({...p,[acc.id]:e.target.value}))} placeholder="Strato-Passwort" style={{...S.inp(false),fontSize:10,padding:"5px 9px"}} onFocus={e=>e.target.style.borderColor=IC.gold} onBlur={e=>e.target.style.borderColor="#1e1e14"}/>
                    <div style={{fontSize:7,color:"#10b981",marginTop:2}}>✓ Wird lokal gespeichert</div>
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    <button style={S.btn(acc.active?"ghost":"green")} onClick={()=>setAccounts(p=>p.map(a=>a.id===acc.id?{...a,active:!a.active}:a))}>{acc.active?"⏸":"▶"}</button>
                    <button style={S.btn("ghost")} onClick={()=>{setAccForm({name:acc.name,email:acc.email,smtpHost:acc.smtpHost,smtpPort:acc.smtpPort,imapHost:acc.imapHost,imapPort:acc.imapPort});setEditAccId(acc.id);setShowAccForm(true);}}>✏</button>
                    <button style={S.btn("red")} onClick={()=>setAccounts(p=>p.filter(a=>a.id!==acc.id))}>✕</button>
                  </div>
                </div>
              </div>
            ))}
            {showAccForm?(
              <div style={{...S.card,border:`1px solid ${IC.goldDark}44`}}>
                <div style={{fontSize:11,color:IC.gold,fontWeight:700,marginBottom:10}}>{editAccId?"Bearbeiten":"Neuer Account"}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                  {[{k:"name",l:"Name",p:"Achi Schmidt – ICONICONE"},{k:"email",l:"E-Mail",p:"website@iconicone.de"},{k:"password",l:"Passwort",p:"••••••••",t:"password"},{k:"smtpHost",l:"SMTP Host",p:"smtp.strato.de"},{k:"smtpPort",l:"SMTP Port",p:"465"},{k:"imapHost",l:"IMAP Host",p:"imap.strato.de"},{k:"imapPort",l:"IMAP Port",p:"993"}].map(f=>(
                    <div key={f.k}><label style={S.lbl}>{f.l}</label><input type={f.t||"text"} value={accForm[f.k]||""} onChange={e=>setAccForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={S.inp(false)} onFocus={e=>e.target.style.borderColor=IC.gold} onBlur={e=>e.target.style.borderColor="#1e1e14"}/></div>
                  ))}
                </div>
                <div style={{display:"flex",gap:7,marginTop:10}}>
                  <button style={S.btn()} onClick={saveAcc}>{editAccId?"Speichern":"+ Hinzufügen"}</button>
                  <button style={S.btn("ghost")} onClick={()=>{setShowAccForm(false);setEditAccId(null);setAccForm(EMPTY_ACC);}}>Abbrechen</button>
                </div>
              </div>
            ):<button style={{...S.btn(),width:"100%",padding:11,marginTop:4}} onClick={()=>setShowAccForm(true)}>+ Account hinzufügen</button>}
          </div>
        )}

        {/* ══════════ SETTINGS ══════════ */}
        {tab==="settings"&&(
          <div style={{maxWidth:580}}>
            <div style={S.card}>
              <div style={{fontSize:11,color:IC.white,fontWeight:700,marginBottom:12}}>Reply Tracker — Vercel Backend</div>
              <div style={{marginBottom:10}}><label style={S.lbl}>Backend URL</label><input value={backendUrl} onChange={e=>setBackendUrl(e.target.value)} placeholder="https://xxx.vercel.app/api/check-replies" style={S.inp(false)} onFocus={e=>e.target.style.borderColor=IC.gold} onBlur={e=>e.target.style.borderColor="#1e1e14"}/></div>
              <div style={{marginBottom:10}}><label style={S.lbl}>Webhook Secret</label><input type="password" value={backendSecret} onChange={e=>setBackendSecret(e.target.value)} placeholder="einZufaelligerString" style={S.inp(false)} onFocus={e=>e.target.style.borderColor=IC.gold} onBlur={e=>e.target.style.borderColor="#1e1e14"}/></div>
              <div style={{background:"#0a0a08",borderRadius:8,padding:"10px 14px",fontSize:9,color:IC.muted,lineHeight:1.8}}>
                <div style={{color:IC.gold,fontWeight:700,marginBottom:4}}>Setup:</div>
                <div>1. <code style={{color:IC.white}}>vercel deploy</code> mit den 3 Backend-Dateien</div>
                <div>2. URL hier eintragen</div>
                <div>3. Env Vars in Vercel: <code style={{color:IC.white}}>IMAP_HOST, IMAP_USER, IMAP_PASS, WEBHOOK_SECRET</code></div>
                <div style={{marginTop:4,color:"#10b981"}}>✓ Kostenlos auf Vercel Free Plan · Cron alle 15 Min</div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIL STEP EDITOR SUB-COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function MailStepEditor({mail,hasOv,lead,step,templates,onSave,onClear,S,IC}){
  const[subj,setSubj]=useState(mail.subject);
  const[body,setBody]=useState(mail.body);
  useEffect(()=>{setSubj(mail.subject);setBody(mail.body);},[mail.subject,mail.body]);
  return(
    <div style={{padding:"0 14px 10px 42px",background:"#070705"}}>
      <div style={{background:"#0a0a08",border:`1px solid #1a1a12`,borderRadius:8,overflow:"hidden"}}>
        <div style={{padding:"6px 10px",borderBottom:`1px solid #1a1a12`,display:"flex",gap:5,alignItems:"center"}}>
          <span style={{fontSize:8,color:"#3a3830"}}>Individuelle Anpassung für {lead.lead.vorname} {lead.lead.nachname}:</span>
          {hasOv&&<button style={{...S.btn("red"),padding:"2px 7px",fontSize:8}} onClick={onClear}>↺ Reset</button>}
        </div>
        <div style={{padding:"10px"}}>
          <div style={{marginBottom:8}}>
            <label style={S.lbl}>Betreff</label>
            <input value={subj} onChange={e=>setSubj(e.target.value)} style={S.inp(false)} onFocus={e=>e.target.style.borderColor=IC.gold} onBlur={e=>e.target.style.borderColor="#1a1a12"}/>
          </div>
          <div style={{marginBottom:8}}>
            <label style={S.lbl}>Text</label>
            <textarea value={body} onChange={e=>setBody(e.target.value)} style={{...S.ta,minHeight:150}}/>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button style={S.btn()} onClick={()=>onSave(subj,body)}>✓ Für diesen Lead speichern</button>
          </div>
        </div>
      </div>
    </div>
  );
}
