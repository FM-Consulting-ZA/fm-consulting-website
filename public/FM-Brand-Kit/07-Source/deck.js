// FM Consulting — presentation template.
// Monochrome by design: tonal separation does the work colour usually does.
const pptx = require("pptxgenjs");
const fs = require("fs");

const INK = "0F1211", PAPER = "F2F3F0", GRAPHITE = "585E5B",
      SILVER = "C6C9C4", MIST = "E4E6E1", WHITE = "FFFFFF";
const SANS = "Archivo", MONO = "IBM Plex Mono";
const A = "assets/deck/";
const img = (f) => ({ data: "image/png;base64," + fs.readFileSync(A + f).toString("base64") });

// 13.333 x 7.5 in. One margin, used everywhere.
const M = 0.85, TOP = 0.62, BOT = 6.5, W = 13.333, CW = W - 2 * M;

const p = new pptx();
p.layout = "LAYOUT_WIDE";
p.author = "FM Consulting (Pty) Ltd";
p.company = "FM Consulting (Pty) Ltd";
p.title = "FM Consulting — presentation template";

// ---------------------------------------------------------------- helpers
const eyebrow = (s, text, opt = {}) => s.addText(text, {
  x: M, y: TOP, w: CW, h: 0.24, fontFace: MONO, fontSize: 9.5, charSpacing: 2.6,
  color: opt.color || GRAPHITE, bold: false, margin: 0, valign: "middle", ...opt,
});

const title = (s, text, opt = {}) => s.addText(text, {
  x: M, y: opt.y || 1.05, w: opt.w || CW * 0.78, h: opt.h || 1.15,
  fontFace: SANS, fontSize: opt.fontSize || 32, color: opt.color || INK,
  bold: false, margin: 0, valign: "top", lineSpacingMultiple: 1.06, ...opt,
});

const hair = (s, y, color = SILVER, x = M, w = CW) =>
  s.addShape(p.ShapeType.rect, { x, y, w, h: 0.008, fill: { color } });

const pageMark = (s, n, onInk = false) => {
  s.addText(n, {
    x: W - M - 1.2, y: BOT + 0.62, w: 1.2, h: 0.24, align: "right",
    fontFace: MONO, fontSize: 9, color: onInk ? GRAPHITE : SILVER, margin: 0,
  });
  s.addImage({ ...img(onInk ? "mono-rev.png" : "mono-ink.png"),
    x: M, y: BOT + 0.55, w: 0.36, h: 0.376, transparency: onInk ? 45 : 55 });
};

// ---------------------------------------------------------------- 1 · cover
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addImage({ ...img("lockup-rev.png"), x: M, y: TOP, w: 2.9, h: 2.9 / 3.3251 });
  s.addText("PROPOSAL", {
    x: M, y: TOP + 0.12, w: CW, h: 0.3, align: "right",
    fontFace: MONO, fontSize: 9.5, charSpacing: 2.6, color: SILVER, margin: 0,
  });
  s.addText("Acquisition &\nretention system\nredesign", {
    x: M, y: 3.15, w: 9.2, h: 2.5, fontFace: SANS, fontSize: 40, color: PAPER,
    bold: false, margin: 0, lineSpacingMultiple: 1.04,
  });
  hair(s, 6.42, "3A3E3C");
  s.addText([
    { text: "PREPARED FOR\n", options: { color: GRAPHITE } },
    { text: "Client Name (Pty) Ltd", options: { color: PAPER } },
  ], { x: M, y: 6.6, w: 5, h: 0.6, fontFace: MONO, fontSize: 10,
       charSpacing: 0.6, margin: 0, lineSpacingMultiple: 1.5 });
  s.addText([
    { text: "REF  FM-2026-014\n", options: { color: PAPER } },
    { text: "23 AUGUST 2026", options: { color: GRAPHITE } },
  ], { x: W - M - 5, y: 6.6, w: 5, h: 0.6, align: "right", fontFace: MONO,
       fontSize: 10, charSpacing: 0.6, margin: 0, lineSpacingMultiple: 1.5 });
  s.addNotes("Cover. Replace title, client, reference and date. Keep the lockup at this size and position — it is the same optical position as the letterhead.");
}

// ---------------------------------------------------------------- 2 · contents
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  eyebrow(s, "CONTENTS");
  title(s, "What we will cover");
  const rows = [
    ["01", "Where the revenue is leaking"],
    ["02", "What we would change"],
    ["03", "The system, end to end"],
    ["04", "Measurement & reporting"],
    ["05", "Timeline, resourcing & commercials"],
  ];
  let y = 2.5;
  rows.forEach(([n, t], i) => {
    hair(s, y, i === 0 ? INK : SILVER);
    s.addText(n, { x: M, y: y + 0.14, w: 0.7, h: 0.42, fontFace: MONO,
      fontSize: 11, color: GRAPHITE, margin: 0, valign: "middle" });
    s.addText(t, { x: M + 0.95, y: y + 0.14, w: CW - 1.5, h: 0.42, fontFace: SANS,
      fontSize: 15, color: INK, margin: 0, valign: "middle" });
    y += 0.72;
  });
  hair(s, y, SILVER);
  pageMark(s, "02");
  s.addNotes("Contents. Add or remove rows — keep the first rule in ink and the rest in silver, so the top of the list reads as the anchor.");
}

// ---------------------------------------------------------------- 3 · divider
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addText("01", { x: M, y: 2.0, w: 4, h: 2.4, fontFace: MONO, fontSize: 90,
    color: GRAPHITE, margin: 0, valign: "middle" });
  s.addText("Where the revenue\nis leaking", { x: M, y: 4.25, w: 9, h: 1.8,
    fontFace: SANS, fontSize: 34, color: PAPER, margin: 0, lineSpacingMultiple: 1.06 });
  s.addText("SECTION", { x: M, y: TOP + 0.12, w: CW, h: 0.3, align: "right",
    fontFace: MONO, fontSize: 9.5, charSpacing: 2.6, color: GRAPHITE, margin: 0 });
  s.addImage({ ...img("lockup-rev.png"), x: M, y: TOP, w: 2.1, h: 2.1 / 3.3251 });
  s.addNotes("Section divider. The numeral is the navigation — keep it large and quiet, and let the section title carry the meaning.");
}

// ---------------------------------------------------------------- 4 · two-column + stats
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  eyebrow(s, "01 · WHERE THE REVENUE IS LEAKING");
  title(s, "Spend is not the constraint");
  s.addText(
    "The constraint is what happens in the forty-eight hours after a lead arrives, and nothing currently owns that window.\n\n" +
    "Three systems hold partial versions of the same customer record and none of them is authoritative. The call centre works from a nightly export. The CRM holds a partial view. The ad platforms optimise against a conversion event that fires before qualification.\n\n" +
    "Each is defensible alone. Together they guarantee the highest-intent leads are worked last.",
    { x: M, y: 2.45, w: 6.1, h: 3.3, fontFace: SANS, fontSize: 13.5, color: INK,
      margin: 0, lineSpacingMultiple: 1.42, valign: "top" });

  const stats = [["R 4.2m", "ANNUAL SPEND UNDER\nMANAGEMENT"],
                 ["38%", "OF LEADS NEVER CONTACTED\nWITHIN 48 HOURS"],
                 ["1.9×", "MODELLED UPLIFT AT\nCURRENT VOLUME"]];
  let y = 2.45;
  stats.forEach(([fig, cap]) => {
    hair(s, y, INK, 7.55, CW - 6.7);
    s.addText(fig, { x: 7.55, y: y + 0.16, w: 4.9, h: 0.62, fontFace: MONO,
      fontSize: 27, color: INK, bold: true, margin: 0, valign: "middle" });
    s.addText(cap, { x: 7.55, y: y + 0.78, w: 4.9, h: 0.46, fontFace: MONO,
      fontSize: 8.5, charSpacing: 1.4, color: GRAPHITE, margin: 0,
      lineSpacingMultiple: 1.24 });
    y += 1.46;
  });
  pageMark(s, "03");
  s.addNotes("Two-column workhorse. Body left, evidence right. Never more than three figures — a fourth turns the column into a table.");
}

// ---------------------------------------------------------------- 5 · statement
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  eyebrow(s, "THE ARGUMENT");
  s.addText("Making one system authoritative is worth more than any change to media efficiency we could make this year.",
    { x: M, y: 2.2, w: 10.4, h: 2.6, fontFace: SANS, fontSize: 30, color: INK,
      margin: 0, lineSpacingMultiple: 1.22, valign: "top" });
  hair(s, 5.3, SILVER, M, 4.2);
  s.addText("The routing gap alone accounts for an estimated R 1.1m in annual gross profit, before a single change to targeting or creative.",
    { x: M, y: 5.5, w: 7.2, h: 0.8, fontFace: SANS, fontSize: 12.5,
      color: GRAPHITE, margin: 0, lineSpacingMultiple: 1.42 });
  pageMark(s, "04");
  s.addNotes("Statement slide. One idea, no supporting bullets. Use it to mark the turn in the argument — at most twice in a deck.");
}

// ---------------------------------------------------------------- 6 · data
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  eyebrow(s, "01 · CHANNEL PERFORMANCE");
  title(s, "Qualified conversion by channel", { fontSize: 28, h: 0.7 });
  s.addChart(p.ChartType.bar, [{
    name: "Qualified CVR",
    labels: ["Lead forms", "Paid search", "Paid social", "Retargeting"],
    values: [4.8, 2.4, 1.1, 0.9],
  }], {
    x: M, y: 2.1, w: 7.6, h: 4.1,
    barDir: "col", barGapWidthPct: 58,
    chartColors: [INK, GRAPHITE, SILVER, MIST],
    varyColors: true,
    showTitle: false, showLegend: false,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0.0"%"',
    dataLabelFontFace: MONO, dataLabelFontSize: 11, dataLabelColor: INK,
    catAxisLabelFontFace: SANS, catAxisLabelFontSize: 11, catAxisLabelColor: INK,
    valAxisLabelFontFace: MONO, valAxisLabelFontSize: 9.5, valAxisLabelColor: GRAPHITE,
    valAxisMaxVal: 6, valAxisMajorUnit: 2, valAxisLabelFormatCode: '0"%"',
    valGridLine: { color: MIST, size: 0.75 }, catGridLine: { style: "none" },
    catAxisLineShow: true, catAxisLineColor: INK, valAxisLineShow: false,
  });
  s.addText("READ THIS AS", { x: 9.0, y: 2.35, w: 3.5, h: 0.26, fontFace: MONO,
    fontSize: 9, charSpacing: 2.2, color: GRAPHITE, margin: 0 });
  s.addText("Lead forms convert at more than twice paid search, on a third of the budget. The allocation is inverted relative to the outcome it produces.",
    { x: 9.0, y: 2.75, w: 3.5, h: 1.9, fontFace: SANS, fontSize: 12.5, color: INK,
      margin: 0, lineSpacingMultiple: 1.42 });
  hair(s, 4.85, SILVER, 9.0, 3.5);
  s.addText("Blended CVR measured at qualified-lead stage, not form submission. 12 months to 31 July 2026.",
    { x: 9.0, y: 5.0, w: 3.5, h: 1.0, fontFace: MONO, fontSize: 8.5, color: GRAPHITE,
      margin: 0, lineSpacingMultiple: 1.4 });
  pageMark(s, "05");
  s.addNotes("Data slide. Chart left, the takeaway right — written as a sentence, not a label. If you cannot write the takeaway, the chart is not ready.");
}

// ---------------------------------------------------------------- 7 · table
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  eyebrow(s, "05 · TIMELINE & COMMERCIALS");
  title(s, "Phases, duration and fee", { fontSize: 28, h: 0.7 });
  const head = ["Phase", "Basis", "Duration", "Fee (ex VAT)"];
  const body = [
    ["Discovery & systems audit", "Fixed fee", "3 weeks", "R 96,000"],
    ["Architecture & build", "Fixed fee, staged", "8 weeks", "R 284,000"],
    ["Migration & enablement", "Fixed fee", "3 weeks", "R 78,000"],
    ["Optimisation retainer", "Monthly, 6-month term", "ongoing", "R 42,000 / mo"],
  ];
  const rows = [head.map((h, i) => ({
    text: h.toUpperCase(),
    options: { fontFace: MONO, fontSize: 9, charSpacing: 1.8, color: GRAPHITE,
      bold: false, align: i >= 2 ? "right" : "left",
      border: [{ pt: 0 }, { pt: 0 }, { pt: 1, color: INK }, { pt: 0 }] },
  }))];
  body.forEach((r) => rows.push(r.map((c, i) => ({
    text: c,
    options: { fontFace: i >= 2 ? MONO : SANS, fontSize: i >= 2 ? 12 : 13,
      color: INK, align: i >= 2 ? "right" : "left",
      border: [{ pt: 0 }, { pt: 0 }, { pt: 0.5, color: SILVER }, { pt: 0 }] },
  }))));
  s.addTable(rows, { x: M, y: 2.15, w: CW, colW: [4.8, 3.4, 1.9, 1.53],
    rowH: 0.52, valign: "middle", margin: [0, 0, 0, 0], autoPage: false });
  s.addText("Project total  R 458,000  ·  Year one including retainer  R 836,000", {
    x: M, y: 4.9, w: CW, h: 0.4, fontFace: MONO, fontSize: 12, color: INK,
    align: "right", margin: 0 });
  pageMark(s, "06");
  s.addNotes("Table slide. Words left, numbers right, monospaced so the digits line up. Keep to five rows — beyond that it belongs in an appendix.");
}

// ---------------------------------------------------------------- 8 · closing
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addImage({ ...img("lockup-rev.png"), x: M, y: 2.5, w: 4.2, h: 4.2 / 3.3251 });
  hair(s, 4.35, "3A3E3C", M, 6.4);
  s.addText([
    { text: "Fouad Maasdorp\n", options: { fontFace: SANS, fontSize: 16, color: PAPER } },
    { text: "FOUNDER & PRINCIPAL CONSULTANT", options: { fontFace: MONO, fontSize: 9.5, charSpacing: 1.8, color: GRAPHITE } },
  ], { x: M, y: 4.6, w: 6.4, h: 0.8, margin: 0, lineSpacingMultiple: 1.6 });
  s.addText("fmaasdorp08@gmail.com\n+27 00 000 0000\nfmconsulting.co.za",
    { x: M, y: 5.55, w: 6.4, h: 1.1, fontFace: MONO, fontSize: 11.5, color: PAPER,
      margin: 0, lineSpacingMultiple: 1.6 });
  s.addText("THANK YOU", { x: M, y: TOP + 0.12, w: CW, h: 0.3, align: "right",
    fontFace: MONO, fontSize: 9.5, charSpacing: 2.6, color: GRAPHITE, margin: 0 });
  s.addNotes("Closing. Same ink ground as the cover, so the deck is bracketed. Replace contact details once, here and on the cover.");
}

p.writeFile({ fileName: "out/fm-deck-template.pptx" }).then(() =>
  console.log("deck written"));
