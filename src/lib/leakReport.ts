/*
 * One-page leak report, built in the browser with jsPDF so nothing leaves the
 * visitor's machine to make it. Set in the brand faces (Archivo, IBM Plex
 * Mono) on the same 3 + 9 column grid as the site.
 *
 * jsPDF and the fonts are loaded only when someone asks for a report.
 */
import { contactConfig, legalEntity } from '@/config';
import {
  formatCount,
  formatRand,
  formatRange,
  formatRate,
  playbooks,
  roundRand,
  type LeakResult,
  type PlaybookInputs,
} from '@/data/playbook';

const INK = '#0F1211';
const GRAPHITE = '#585E5B';
const SILVER = '#C6C9C4';
const PAPER = '#F2F3F0';

async function fontBase64(path: string) {
  const buf = await (await fetch(path)).arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

/** The lockup SVG rendered to a PNG data URL at print resolution. */
async function logoPng(): Promise<{ data: string; ratio: number }> {
  const svg = await (await fetch('/brand/fm-lockup.svg')).text();
  const vb = /viewBox="([\d.\s-]+)"/.exec(svg)?.[1].split(/\s+/).map(Number) ?? [0, 0, 602, 181];
  const ratio = vb[2] / vb[3];
  const h = 240;
  const w = Math.round(h * ratio);
  const sized = svg.replace('<svg ', `<svg width="${w}" height="${h}" `);
  const url = URL.createObjectURL(new Blob([sized], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
    return { data: canvas.toDataURL('image/png'), ratio };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export interface ReportPerson {
  name: string;
  business?: string;
}

export async function downloadLeakReport(input: PlaybookInputs, result: LeakResult, person: ReportPerson) {
  const [{ jsPDF }, regular, semibold, mono, logo] = await Promise.all([
    import('jspdf'),
    fontBase64('/fonts/report/Archivo-Regular.ttf'),
    fontBase64('/fonts/report/Archivo-SemiBold.ttf'),
    fontBase64('/fonts/report/IBMPlexMono-400.ttf'),
    logoPng(),
  ]);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.addFileToVFS('Archivo-Regular.ttf', regular);
  doc.addFont('Archivo-Regular.ttf', 'Archivo', 'normal');
  doc.addFileToVFS('Archivo-SemiBold.ttf', semibold);
  doc.addFont('Archivo-SemiBold.ttf', 'Archivo', 'bold');
  doc.addFileToVFS('IBMPlexMono-400.ttf', mono);
  doc.addFont('IBMPlexMono-400.ttf', 'Plex', 'normal');

  const pb = playbooks[result.leak];
  const W = 210;
  const M = 18; // page margin
  const colL = M; // label column
  const colR = M + 50; // content column (3 of 12)
  const contentW = W - M - colR;
  const date = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

  const meta = (text: string, x: number, y: number, color = GRAPHITE, align: 'left' | 'right' = 'left') => {
    doc.setFont('Plex', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(color);
    const t = text.toUpperCase();
    const width = doc.getTextWidth(t) + 0.35 * (t.length - 1);
    doc.text(t, align === 'right' ? x - width : x, y, { charSpace: 0.35 });
  };
  const rule = (y: number, color = INK, weight = 0.25) => {
    doc.setDrawColor(color);
    doc.setLineWidth(weight);
    doc.line(M, y, W - M, y);
  };
  const para = (text: string, x: number, y: number, width: number, size = 9.5, color = GRAPHITE, lh = 1.45) => {
    doc.setFont('Archivo', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, width) as string[];
    doc.text(lines, x, y, { lineHeightFactor: lh });
    return y + lines.length * size * 0.3528 * lh;
  };

  // Header
  doc.addImage(logo.data, 'PNG', M, 14, 9 * logo.ratio, 9);
  meta(`Leak report  /  ${date}`, W - M, 20, GRAPHITE, 'right');
  rule(30);

  // Title block
  let y = 40;
  meta('Prepared for', colL, y);
  doc.setFont('Archivo', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(INK);
  doc.text([person.name, person.business].filter(Boolean) as string[], colL, y + 6, { lineHeightFactor: 1.4 });

  doc.setFont('Archivo', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(INK);
  const title = doc.splitTextToSize(`Your biggest leak: ${pb.name.toLowerCase()}.`, contentW) as string[];
  doc.text(title, colR, y + 2, { lineHeightFactor: 1.05 });
  y += 2 + title.length * 23 * 0.3528 * 1.05 + 4;
  y = para(pb.summary, colR, y, contentW - 10, 10, GRAPHITE);

  // Value
  y += 6;
  rule(y, SILVER);
  y += 8;
  meta('What it is worth', colL, y);
  if (result.monthlyValue != null && result.monthlyValue > 0 && result.stage && result.target != null) {
    doc.setFont('Plex', 'normal');
    doc.setFontSize(24);
    doc.setTextColor(INK);
    doc.text(`${formatRand(roundRand(result.monthlyValue))} a month`, colR, y + 3);
    const extra = Math.round(result.extraCustomers ?? 0);
    const step = result.stage.leak === 'repeat' ? 'repeat purchases' : `${result.stage.from.toLowerCase()} to ${result.stage.to.toLowerCase()}`;
    y = para(
      `A rough figure, not a forecast. If ${step} reached ${formatRate(result.target)}, ${
        result.headroomOnly ? 'the top' : 'the low end'
      } of the first-look range, with everything else unchanged, you would gain about ${extra} more ${
        extra === 1 ? 'customer' : 'customers'
      } a month at your average sale of ${formatRand(input.avgSale ?? 0)}.`,
      colR,
      y + 10,
      contentW - 10,
      9
    );
  } else {
    y = para(
      result.leak === 'measure'
        ? 'Not enough of the numbers were known to put a value on the leak. Getting them is the first job.'
        : 'Your figures do not support a reliable value yet. Check the numbers flagged below first.',
      colR,
      y,
      contentW - 10,
      10,
      INK
    );
  }

  // Funnel table
  y += 6;
  rule(y, SILVER);
  y += 8;
  meta('Your numbers', colL, y);
  const cols = [colR, colR + 56, colR + 80, colR + 102];
  meta('Step', cols[0], y);
  meta('Monthly', cols[1], y);
  meta('Your rate', cols[2], y);
  meta('Range', cols[3], y);
  y += 3;
  doc.setDrawColor(INK);
  doc.setLineWidth(0.25);
  doc.line(colR, y, W - M, y);
  result.stages.forEach((s) => {
    y += 6;
    const isLeak = result.stage === s;
    doc.setFont('Archivo', isLeak ? 'bold' : 'normal');
    doc.setFontSize(9);
    doc.setTextColor(INK);
    doc.text(`${s.from} to ${s.to.toLowerCase()}`, cols[0], y);
    doc.setFont('Plex', 'normal');
    doc.setFontSize(8.5);
    doc.text(s.toCount != null ? formatCount(s.toCount) : 'Not known', cols[1], y);
    doc.text(s.rate != null ? formatRate(s.rate) : '–', cols[2], y);
    doc.setTextColor(GRAPHITE);
    doc.text(formatRange(s.range), cols[3], y);
    if (isLeak) {
      doc.setFillColor(INK);
      doc.circle(colR - 3, y - 1.1, 0.9, 'F');
    }
    y += 2.6;
    doc.setDrawColor(SILVER);
    doc.setLineWidth(0.15);
    doc.line(colR, y, W - M, y);
  });
  if (input.visits != null) {
    y += 5;
    para(`Starting from ${formatCount(input.visits)} visits a month.`, colR, y, contentW, 8);
  }
  result.warnings.forEach((w) => {
    y += 5;
    y = para(w, colR, y, contentW, 8, INK);
  });

  // Where we'd look first
  y += 6;
  rule(y, SILVER);
  y += 8;
  meta('First questions', colL, y);
  pb.chapters.forEach((c, i) => {
    doc.setFont('Plex', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(GRAPHITE);
    doc.text(String(i + 1).padStart(2, '0'), colR, y + 0.5);
    doc.setFont('Archivo', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(INK);
    doc.text(c.title, colR + 8, y + 0.5);
    y = para(c.questions[0], colR + 8, y + 5, contentW - 8, 8.5);
    y += 3;
  });

  // Recommended engagement
  y += 3;
  const why = doc.splitTextToSize(pb.planWhy, contentW - 8) as string[];
  const bookY = y + 6 + why.length * 9 * 0.3528 * 1.45 + 3;
  const boxH = bookY + 4 - (y - 5);
  doc.setFillColor(PAPER);
  doc.rect(colR - 4, y - 5, contentW + 4, boxH, 'F');
  meta('Where to start', colL, y);
  doc.setFont('Archivo', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(INK);
  doc.text(pb.planName, colR, y + 0.5);
  para(pb.planWhy, colR, y + 6, contentW - 8, 9);
  para('Book a call: fmconsultingza.co.za/contact', colR, bookY, contentW - 8, 8.5, INK);

  // Footer
  const fy = 270;
  rule(fy);
  para(
    'First-look ranges are FM Consulting’s working assumptions for deciding where to look first. They are broad, they are not benchmarks for your sector, and this report is not a forecast. The figures are the ones you entered.',
    M,
    fy + 6,
    W - 2 * M,
    7.5
  );
  para(
    `${legalEntity.name}, registration ${legalEntity.registrationNumber}. ${contactConfig.contactInfo.email}, ${contactConfig.contactInfo.phone}, fmconsultingza.co.za`,
    M,
    fy + 16,
    W - 2 * M,
    7.5,
    INK
  );

  const file = `FM-Leak-Report-${(person.business || person.name || 'your-business').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}.pdf`;
  doc.save(file);
}
