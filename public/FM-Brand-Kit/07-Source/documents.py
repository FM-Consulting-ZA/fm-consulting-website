#!/usr/bin/env python3
"""Client documents: proposal, invoice, case study. A4, one grid, one type scale.

Sample copy is drawn from the kind of work FM actually does, so the templates
demonstrate the system under real load rather than under lorem ipsum.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B, printkit as P

E = B.ENTITY
OUT = f"{os.path.dirname(os.path.abspath(__file__))}/out"
W, H = 210, 297
ML, MR, MT, MB = 20.0, 20.0, 20.0, 22.0
COLW = W - ML - MR

CSS = f"""
.abs{{position:absolute}}
.col{{position:absolute;left:{ML}mm;width:{COLW}mm}}
.eyebrow{{font-family:'Plex Mono',monospace;font-size:6.4pt;letter-spacing:.26em;
  text-transform:uppercase;color:{B.GRAPHITE}}}
.eyebrow-rev{{color:{B.SILVER}}}
h1{{font-weight:300;font-size:31pt;line-height:1.08;letter-spacing:-.024em}}
h2{{font-weight:500;font-size:15pt;line-height:1.2;letter-spacing:-.012em;margin-bottom:3mm}}
h3{{font-weight:500;font-size:9.6pt;line-height:1.3;letter-spacing:-.004em;margin-bottom:1.6mm}}
p{{font-size:9.4pt;line-height:1.62;color:{B.INK};max-width:150mm}}
p+p{{margin-top:3.2mm}}
.lead{{font-size:12pt;line-height:1.48;font-weight:300;letter-spacing:-.01em}}
.dim{{color:{B.GRAPHITE}}}
.mono{{font-family:'Plex Mono',monospace}}
.meta{{font-family:'Plex Mono',monospace;font-size:7.4pt;line-height:1.85;
  letter-spacing:.02em;color:{B.GRAPHITE}}}
.meta b{{color:{B.INK};font-weight:500}}
.meta-rev b{{color:{B.PAPER}}}
table{{width:100%;border-collapse:collapse}}
th{{font-family:'Plex Mono',monospace;font-size:6.4pt;letter-spacing:.18em;
  text-transform:uppercase;color:{B.GRAPHITE};text-align:left;font-weight:400;
  padding:0 0 2mm 0;border-bottom:.3mm solid {B.INK}}}
td{{font-size:9pt;padding:2.6mm 0;border-bottom:.2mm solid {B.SILVER};vertical-align:top}}
td.num,th.num{{text-align:right;font-family:'Plex Mono',monospace;
  font-variant-numeric:tabular-nums;letter-spacing:0}}
td.qty{{font-family:'Plex Mono',monospace;color:{B.GRAPHITE};font-size:8.4pt}}
tr.total td{{border-bottom:none;padding-top:3.4mm;font-weight:500}}
tr.grand td{{border-top:.3mm solid {B.INK};font-size:11pt;font-weight:500;padding-top:3.4mm}}
.tiles{{display:flex;gap:0}}
.tile{{flex:1;border-top:.3mm solid {B.INK};padding:3.5mm 5mm 0 0}}
.tile .fig{{font-family:'Plex Mono',monospace;font-size:23pt;font-weight:500;
  letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}}
.tile .cap{{font-family:'Plex Mono',monospace;font-size:6.4pt;letter-spacing:.16em;
  text-transform:uppercase;color:{B.GRAPHITE};margin-top:2.2mm;line-height:1.5}}
.toc{{width:100%;border-collapse:collapse}}
.toc td{{border-bottom:.2mm solid {B.SILVER};padding:3.4mm 0;font-size:10pt}}
.toc td.n{{font-family:'Plex Mono',monospace;color:{B.GRAPHITE};width:14mm;font-size:8.4pt}}
.toc td.p{{font-family:'Plex Mono',monospace;text-align:right;width:14mm;font-size:8.4pt;
  color:{B.GRAPHITE}}}
.foot{{font-family:'Plex Mono',monospace;font-size:5.8pt;letter-spacing:.02em;color:{B.GRAPHITE}}}
.two{{display:flex;gap:8mm}}
.two > div{{flex:1}}
"""


def d(x, y, extra=""):
    return f'class="abs" style="left:{x}mm;top:{y}mm;{extra}"'


def running_head(title, page_no, rev=False):
    c = B.SILVER if rev else B.GRAPHITE
    return (f'<div {d(ML, 13, f"width:{COLW}mm;color:{c}")}>'
            f'<span class="eyebrow" style="color:{c}">{title}</span></div>'
            f'<div {d(ML, 13, f"width:{COLW}mm;text-align:right;color:{c}")}>'
            f'<span class="eyebrow" style="color:{c}">{page_no}</span></div>'
            f'<div {d(ML, 19.5, f"width:{COLW}mm")}>'
            f'<div style="height:.2mm;background:{B.SILVER if not rev else "#3A3E3C"}"></div></div>')


def doc_footer():
    return (f'<div {d(ML, H-MB+6, f"width:{COLW}mm")}>'
            f'<div style="height:.2mm;background:{B.SILVER}"></div></div>'
            f'<div {d(ML, H-MB+9, f"width:{COLW}mm")}><span class="foot">'
            f'{E["legal"]} &nbsp;·&nbsp; {E["email"]} &nbsp;·&nbsp; {E["web"]}</span></div>')


# ---------------------------------------------------------------- proposal
def proposal():
    # 1 — cover
    cover = (
        f'<div {d(ML, 22)}>{P.logo("horizontal","primary",13.0,colour=B.PAPER,reverse=True)}</div>'
        f'<div {d(ML, 27.5, f"width:{COLW}mm;text-align:right")}>'
        f'<span class="eyebrow eyebrow-rev">PROPOSAL</span></div>'
        f'<div {d(ML, 168, f"width:{COLW-20}mm;color:{B.PAPER}")}>'
        f'<h1>Acquisition &amp;<br>retention system<br>redesign</h1></div>'
        f'<div {d(ML, 246, f"width:{COLW}mm")}>'
        f'<div style="height:.3mm;background:#3A3E3C"></div></div>'
        f'<div {d(ML, 250, f"width:{COLW/2}mm")}><div class="meta meta-rev">'
        f'PREPARED FOR<br><b>Client Name (Pty) Ltd</b></div></div>'
        f'<div {d(ML+COLW/2, 250, f"width:{COLW/2}mm;text-align:right")}>'
        f'<div class="meta meta-rev">REF &nbsp;<b>FM-2026-014</b><br>'
        f'DATE &nbsp;<b>23 AUG 2026</b></div></div>'
    )

    # 2 — contents
    rows = [("01", "Where the revenue is leaking", "03"),
            ("02", "What we would change", "05"),
            ("03", "The system, end to end", "08"),
            ("04", "Measurement &amp; reporting", "12"),
            ("05", "Timeline &amp; resourcing", "14"),
            ("06", "Commercials", "16")]
    toc = "".join(f'<tr><td class="n">{n}</td><td>{t}</td><td class="p">{p}</td></tr>'
                  for n, t, p in rows)
    contents = (
        running_head("PROPOSAL &nbsp;·&nbsp; CLIENT NAME", "02")
        + f'<div {d(ML, 34, f"width:{COLW}mm")}><h2>Contents</h2></div>'
        + f'<div {d(ML, 48, f"width:{COLW}mm")}><table class="toc">{toc}</table></div>'
        + f'<div {d(ML, 120, f"width:{COLW}mm")}>'
          f'<p class="lead dim">This proposal assumes the audit findings shared on '
          f'11 August. Where an assumption is doing heavy lifting, it is marked in the margin '
          f'so you can challenge it before we build on it.</p></div>'
        + doc_footer()
    )

    # 3 — content page with a data table and stat tiles
    tiles = "".join(
        f'<div class="tile"><div class="fig">{f}</div><div class="cap">{c}</div></div>'
        for f, c in [("R 4.2m", "Annual spend<br>under management"),
                     ("38%", "Of leads never<br>contacted in 48h"),
                     ("1.9×", "Modelled uplift<br>at current volume")])
    trows = "".join(
        f'<tr><td>{a}</td><td class="qty">{b}</td><td class="num">{c}</td>'
        f'<td class="num">{dd}</td></tr>'
        for a, b, c, dd in [
            ("Paid search", "Google Ads", "R 1,840,000", "2.4%"),
            ("Paid social", "Meta", "R 1,220,000", "1.1%"),
            ("Lead forms", "Native + landing", "R 640,000", "4.8%"),
            ("Retargeting", "Cross-network", "R 500,000", "0.9%")])
    content = (
        running_head("01 &nbsp;·&nbsp; WHERE THE REVENUE IS LEAKING", "03")
        + f'<div {d(ML, 32, f"width:{COLW}mm")}><h2>Where the revenue is leaking</h2></div>'
        + f'<div {d(ML, 46, f"width:{COLW}mm")}><p class="lead">'
          f'Spend is not the constraint. The constraint is what happens in the '
          f'forty-eight hours after a lead arrives — and nothing currently owns that window.</p></div>'
        + f'<div {d(ML, 70, f"width:{COLW}mm")}><div class="tiles">{tiles}</div></div>'
        + f'<div {d(ML, 108, f"width:{COLW}mm")}><p>'
          f'Three separate systems hold pieces of the same customer record, and none of them '
          f'is authoritative. The call centre works from a spreadsheet exported nightly; the '
          f'CRM holds a partial view; the ad platforms optimise against a conversion event '
          f'that fires before qualification. Each system is defensible on its own. Together '
          f'they guarantee that the highest-intent leads are worked last.</p>'
          f'<p>The table below is the current allocation, with blended conversion measured '
          f'at the qualified-lead stage rather than at form submission.</p></div>'
        + f'<div {d(ML, 152, f"width:{COLW}mm")}><table>'
          f'<tr><th>Channel</th><th>Platform</th><th class="num">Annual spend</th>'
          f'<th class="num">Qualified CVR</th></tr>{trows}</table></div>'
        + f'<div {d(ML, 214, f"width:{COLW}mm")}><div class="two">'
          f'<div><h3>What this costs today</h3><p class="dim" style="font-size:8.8pt">'
          f'At current volume, the routing gap alone accounts for an estimated '
          f'R 1.1m in annual gross profit — before any change to media efficiency.</p></div>'
          f'<div><h3>What we would fix first</h3><p class="dim" style="font-size:8.8pt">'
          f'Single customer record, deterministic routing inside five minutes, and a '
          f'conversion signal the ad platforms can actually optimise against.</p></div>'
          f'</div></div>'
        + doc_footer()
    )

    # 4 — commercials
    frows = "".join(
        f'<tr><td>{a}<div class="dim" style="font-size:7.8pt;margin-top:1mm">{b}</div></td>'
        f'<td class="qty">{c}</td><td class="num">{dd}</td></tr>'
        for a, b, c, dd in [
            ("Discovery &amp; systems audit", "Weeks 1–3. Fixed fee.", "3 weeks", "R 96,000"),
            ("Architecture &amp; build", "Weeks 4–11. Fixed fee, staged.", "8 weeks", "R 284,000"),
            ("Migration &amp; enablement", "Weeks 12–14. Fixed fee.", "3 weeks", "R 78,000"),
            ("Optimisation retainer", "From month 4. Monthly, 6-month term.", "monthly", "R 42,000")])
    comm = (
        running_head("06 &nbsp;·&nbsp; COMMERCIALS", "16")
        + f'<div {d(ML, 32, f"width:{COLW}mm")}><h2>Commercials</h2></div>'
        + f'<div {d(ML, 46, f"width:{COLW}mm")}><p class="lead">'
          f'Fixed fee for everything with a defined end. Retainer only for the part that '
          f'genuinely never ends.</p></div>'
        + f'<div {d(ML, 74, f"width:{COLW}mm")}><table>'
          f'<tr><th>Phase</th><th>Basis</th><th class="num">Fee (ex VAT)</th></tr>{frows}'
          f'<tr class="total"><td colspan="2">Project total</td>'
          f'<td class="num">R 458,000</td></tr>'
          f'<tr class="grand"><td colspan="2">Year one, including retainer</td>'
          f'<td class="num">R 836,000</td></tr></table></div>'
        + f'<div {d(ML, 196, f"width:{COLW}mm")}><div class="two">'
          f'<div><h3>Payment terms</h3><p class="dim" style="font-size:8.8pt">'
          f'30% on signature, 40% at architecture sign-off, 30% on handover. '
          f'Retainer invoiced monthly in advance. 14 days net.</p></div>'
          f'<div><h3>What is not included</h3><p class="dim" style="font-size:8.8pt">'
          f'Media spend, third-party licences, and any development inside your '
          f'core platform. Quoted separately once scoped.</p></div></div></div>'
        + doc_footer()
    )

    pages = [P.page(W, H, cover, marks=False, ground=B.INK),
             P.page(W, H, contents, marks=False),
             P.page(W, H, content, marks=False),
             P.page(W, H, comm, marks=False)]
    P.render(P.document(pages, CSS), f"{OUT}/fm-proposal-template.pdf")


# ---------------------------------------------------------------- invoice
def invoice():
    rows = "".join(
        f'<tr><td>{a}<div class="dim" style="font-size:7.8pt;margin-top:1mm">{b}</div></td>'
        f'<td class="qty">{c}</td><td class="num">{dd}</td><td class="num">{e}</td></tr>'
        for a, b, c, dd, e in [
            ("Discovery &amp; systems audit", "Phase 1 of 3 — milestone invoice", "1", "R 96,000.00", "R 96,000.00"),
            ("CRM architecture workshop", "Two sessions, on site", "2", "R 14,500.00", "R 29,000.00"),
            ("Routing logic specification", "Delivered 18 Aug 2026", "1", "R 22,000.00", "R 22,000.00")])
    body = (
        f'<div {d(ML, 20)}>{P.logo("horizontal","primary",11.5)}</div>'
        f'<div {d(ML, 22.5, f"width:{COLW}mm;text-align:right")}>'
        f'<span class="eyebrow">TAX INVOICE</span></div>'
        f'<div {d(ML, 44, f"width:{COLW}mm")}><div style="height:.3mm;background:{B.INK}"></div></div>'
        f'<div {d(ML, 50, f"width:{COLW*0.48}mm")}><div class="meta">'
        f'BILL TO<br><b>Client Name (Pty) Ltd</b><br>Attn: Finance<br>'
        f'00 Street Name<br>Suburb, Johannesburg 0000<br>VAT 0000000000</div></div>'
        f'<div {d(ML+COLW*0.55, 50, f"width:{COLW*0.45}mm;text-align:right")}><div class="meta">'
        f'INVOICE &nbsp;<b>FM-INV-0142</b><br>ISSUED &nbsp;<b>23 AUG 2026</b><br>'
        f'DUE &nbsp;<b>06 SEP 2026</b><br>TERMS &nbsp;<b>14 DAYS NET</b><br>'
        f'PO &nbsp;<b>—</b></div></div>'
        f'<div {d(ML, 104, f"width:{COLW}mm")}><table>'
        f'<tr><th>Description</th><th class="num">Qty</th><th class="num">Unit</th>'
        f'<th class="num">Amount</th></tr>{rows}'
        f'<tr class="total"><td colspan="3">Subtotal</td><td class="num">R 147,000.00</td></tr>'
        f'<tr class="total"><td colspan="3">VAT @ 15%</td><td class="num">R 22,050.00</td></tr>'
        f'<tr class="grand"><td colspan="3">Total due</td><td class="num">R 169,050.00</td></tr>'
        f'</table></div>'
        f'<div {d(ML, 214, f"width:{COLW}mm")}><div class="two">'
        f'<div><h3>Banking</h3><div class="meta">BANK &nbsp;<b>Bank Name</b><br>'
        f'ACCOUNT &nbsp;<b>0000 0000 000</b><br>BRANCH &nbsp;<b>000 000</b><br>'
        f'REFERENCE &nbsp;<b>FM-INV-0142</b></div></div>'
        f'<div><h3>Notes</h3><p class="dim" style="font-size:8.4pt">'
        f'Please use the invoice number as your payment reference. '
        f'Interest at prime + 2% applies to amounts outstanding beyond terms.</p></div>'
        f'</div></div>'
        + doc_footer()
    )
    P.render(P.document([P.page(W, H, body, marks=False)], CSS),
             f"{OUT}/fm-invoice-template.pdf")


# ---------------------------------------------------------------- case study
def case_study():
    tiles = "".join(
        f'<div class="tile"><div class="fig">{f}</div><div class="cap">{c}</div></div>'
        for f, c in [("−41%", "Cost per<br>qualified lead"),
                     ("+2.3×", "Lead-to-sale<br>conversion"),
                     ("5 min", "Median routing<br>time, from 26h"),
                     ("14 wk", "Design to<br>full migration")])
    body = (
        f'<div {d(ML, 20)}>{P.logo("horizontal","compact",9.0)}</div>'
        f'<div {d(ML, 21.5, f"width:{COLW}mm;text-align:right")}>'
        f'<span class="eyebrow">CASE STUDY &nbsp;·&nbsp; 2026</span></div>'
        f'<div {d(ML, 40, f"width:{COLW}mm")}><div style="height:.3mm;background:{B.INK}"></div></div>'
        f'<div {d(ML, 50, f"width:{COLW-16}mm")}>'
        f'<h1 style="font-size:26pt">Rebuilding a debt-review<br>acquisition funnel around<br>a single customer record</h1></div>'
        f'<div {d(ML, 108, f"width:{COLW}mm")}><div class="tiles">{tiles}</div></div>'
        f'<div {d(ML, 150, f"width:{COLW}mm")}><div class="two">'
        f'<div><h3>The problem</h3><p style="font-size:8.8pt">'
        f'Three systems held partial versions of the same lead. The call centre worked from '
        f'a nightly export, so the highest-intent enquiries were contacted last — often more '
        f'than a day after they raised their hand.</p></div>'
        f'<div><h3>The work</h3><p style="font-size:8.8pt">'
        f'One authoritative record, deterministic routing inside five minutes, and a '
        f'qualification event wired back into both ad platforms so they optimised against '
        f'revenue rather than form fills.</p></div>'
        f'<div><h3>The result</h3><p style="font-size:8.8pt">'
        f'Media spend held flat. Qualified volume rose, cost per qualified lead fell 41%, '
        f'and the sales floor stopped triaging by hand — which is where most of the '
        f'conversion gain actually came from.</p></div></div></div>'
        f'<div {d(ML, 214, f"width:{COLW}mm")}>'
        f'<div style="height:.2mm;background:{B.SILVER}"></div></div>'
        f'<div {d(ML, 220, f"width:{COLW}mm")}>'
        f'<p class="lead dim" style="font-size:11pt;max-width:145mm">'
        f'&ldquo;The change was not more spend or better creative. It was making one system '
        f'authoritative and letting everything else read from it.&rdquo;</p></div>'
        + doc_footer()
    )
    P.render(P.document([P.page(W, H, body, marks=False)], CSS),
             f"{OUT}/fm-case-study-template.pdf")


if __name__ == "__main__":
    proposal(); print("proposal")
    invoice(); print("invoice")
    case_study(); print("case study")
