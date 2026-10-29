#!/usr/bin/env python3
"""Generate the FM Consulting brand system page (self-contained artifact)."""
import os, sys, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B

ROOT = os.path.dirname(os.path.abspath(__file__))
E, P = B.ENTITY, B.PALETTE


def img(name, alt, cls=""):
    p = f"{ROOT}/spec/{name}.jpg"
    b = base64.b64encode(open(p, "rb").read()).decode()
    return f'<img class="{cls}" src="data:image/jpeg;base64,{b}" alt="{alt}">'


def mark(kind, cut, descriptor=False, reverse=False, cls="", label=""):
    vb, d = B.path_only(kind, cut, 10.0, descriptor, reverse=reverse)
    return (f'<svg class="{cls}" viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" '
            f'role="img" aria-label="{label or kind}">'
            f'<path d="{d}" fill="currentColor" fill-rule="nonzero"/></svg>')


# ---- clear-space diagram -------------------------------------------------
def clearspace():
    vb, d = B.path_only("horizontal", "primary")
    x0, y0, w, h = [float(v) for v in vb.split()]
    c = 20.0  # 2w
    return (f'<svg viewBox="{x0-c-14} {y0-c-14} {w+2*c+28} {h+2*c+28}" '
            f'xmlns="http://www.w3.org/2000/svg" role="img" '
            f'aria-label="Clear space is 2w on every side">'
            f'<rect x="{x0-c}" y="{y0-c}" width="{w+2*c}" height="{h+2*c}" fill="none" '
            f'stroke="currentColor" stroke-width="1.1" stroke-dasharray="7 6" opacity=".42"/>'
            f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" fill="none" '
            f'stroke="currentColor" stroke-width=".8" opacity=".2"/>'
            f'<path d="{d}" fill="currentColor"/>'
            f'<g fill="currentColor" opacity=".55" font-family="IBM Plex Mono,monospace" '
            f'font-size="11"><text x="{x0-c}" y="{y0-c-7}">2 w</text></g></svg>')


SWATCH = "".join(
    f'<div class="sw"><div class="chip" style="background:{v["hex"]};'
    f'{"border:1px solid var(--rule)" if k in ("paper","white","mist","silver") else ""}"></div>'
    f'<div class="sw-b"><div class="sw-n">{k.title()}</div>'
    f'<div class="sw-u">{v["use"]}</div>'
    f'<dl class="specs">'
    f'<div><dt>HEX</dt><dd>{v["hex"]}</dd></div>'
    f'<div><dt>RGB</dt><dd>{v["rgb"]}</dd></div>'
    f'<div><dt>CMYK</dt><dd>{v["cmyk"]}</dd></div>'
    f'<div><dt>REF</dt><dd>{v["pantone"]}</dd></div>'
    f'</dl></div></div>'
    for k, v in P.items())

SCALE_ROWS = "".join(
    f'<tr><td class="m">{s}</td><td class="m dim">{s/15:.3f}×</td>'
    f'<td style="font-size:{min(s,34)}px;line-height:1.15">{t}</td></tr>'
    for s, t in zip(B.SCALE[:9],
                    ["Caption / legal", "Table label", "Metadata", "Body — the default",
                     "Lead paragraph", "Subhead", "Section heading", "Page title",
                     "Cover statement"]))

FILES = [
    ("Marks", "fm-primary · fm-compact · fm-icon · fm-icon-16px",
     "Four optical cuts, each with reversed art. SVG."),
    ("Lockups", "horizontal · stacked · monogram, ± descriptor",
     "Type converted to outlines — no font dependency. SVG."),
    ("Stationery", "business card · letterhead · continuation · comp slip · envelope",
     "PDF. Card and slip carry 3 mm bleed and crop marks; letterhead and envelope print as-is."),
    ("Documents", "proposal (4 pp) · invoice · case study",
     "PDF, with the HTML masters that generate them."),
    ("Presentation", "fm-deck-template.pptx",
     "Eight slides: cover, contents, divider, two-column, statement, data, table, closing."),
    ("Digital", "avatars · LinkedIn cover · call backgrounds · favicons · email signature",
     "PNG, ICO, SVG and HTML."),
    ("Fonts", "Archivo (5 weights) · Archivo Expanded (3) · IBM Plex Mono (2)",
     "TTF, correctly named for installation. Both families are open-licence."),
    ("Source", "brand.py · mark.py · printkit.py · stationery.py · documents.py · digital.py · deck.js",
     "Change a constant, re-run, and every artefact regenerates."),
]
FILE_ROWS = "".join(
    f'<div class="fr"><div class="fr-k">{a}</div><div class="fr-v">{b}</div>'
    f'<div class="fr-d">{c}</div></div>' for a, b, c in FILES)

DONTS = [
    ("Never re-colour", "The system is ink and paper. A tinted mark is a different brand."),
    ("Never stretch or rotate", "The stroke unit governs every distance in the drawing."),
    ("Never outline the mark", "It re-closes the aperture and doubles every void."),
    ("Never place on a busy image", "If a photograph is unavoidable, lay an ink field under the mark."),
    ("Never rebuild the lockup", "Spacing is fixed at 3 w. Use the supplied files."),
    ("Never mix the cuts", "One optical size per surface. Match the cut to the reproduction size."),
]
DONT_ROWS = "".join(f'<div class="dont"><h4>{a}</h4><p>{b}</p></div>' for a, b in DONTS)

HTML = f"""<title>FM Consulting Brand System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100,300;100,400;100,500;100,600;125,400;125,500&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{{
  --paper:{B.PAPER}; --ink:{B.INK}; --graphite:{B.GRAPHITE};
  --silver:{B.SILVER}; --mist:{B.MIST};
  --bg:var(--paper); --fg:var(--ink); --dim:var(--graphite);
  --rule:{B.SILVER}; --panel:#FFFFFF; --sunk:{B.MIST};
  --shadow:0 1px 2px rgba(15,18,17,.05),0 10px 34px rgba(15,18,17,.07);
}}
@media (prefers-color-scheme:dark){{
  :root:not([data-theme="light"]){{
    --bg:#0B0D0C; --fg:#E9EBE7; --dim:#8D938E;
    --rule:#262A28; --panel:#141715; --sunk:#191C1A;
    --shadow:0 1px 2px rgba(0,0,0,.6),0 12px 40px rgba(0,0,0,.4);
  }}
}}
:root[data-theme="dark"]{{
  --bg:#0B0D0C; --fg:#E9EBE7; --dim:#8D938E;
  --rule:#262A28; --panel:#141715; --sunk:#191C1A;
  --shadow:0 1px 2px rgba(0,0,0,.6),0 12px 40px rgba(0,0,0,.4);
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--fg);
  font-family:'Archivo',Helvetica,Arial,sans-serif;font-weight:400;
  font-size:15px;line-height:1.62;-webkit-font-smoothing:antialiased}}
.wrap{{max-width:1140px;margin:0 auto;padding:0 32px 140px}}

h1,h2,h3,h4{{margin:0;text-wrap:balance}}
h1{{font-weight:300;font-size:clamp(38px,6vw,72px);line-height:1.02;letter-spacing:-.03em}}
h2{{font-weight:400;font-size:clamp(24px,3vw,34px);line-height:1.12;letter-spacing:-.02em}}
h3{{font-weight:500;font-size:17px;line-height:1.3;letter-spacing:-.008em}}
h4{{font-weight:500;font-size:15px;line-height:1.35}}
p{{margin:0;max-width:68ch}}
.lead{{font-weight:300;font-size:clamp(18px,2vw,21px);line-height:1.5;color:var(--fg);max-width:40ch}}
.dim{{color:var(--dim)}}
.m,.lab{{font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;
  font-variant-numeric:tabular-nums}}
.lab{{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim)}}
.exp{{font-family:'Archivo',sans-serif;font-stretch:125%;font-variation-settings:'wdth' 125}}

section{{padding:76px 0;border-top:1px solid var(--rule);
  display:flex;flex-direction:column;gap:30px}}
.sec-head{{display:flex;flex-direction:column;gap:14px}}
.stack{{display:flex;flex-direction:column;gap:18px}}

/* hero */
.hero{{padding:96px 0 66px;border:none;gap:0}}
.hero .lock{{color:var(--fg);width:min(560px,86%);margin-bottom:52px}}
.hero .lock svg{{width:100%;height:auto;display:block}}
.meta{{display:flex;flex-wrap:wrap;gap:0;margin-top:40px;border-top:1px solid var(--rule)}}
.meta div{{padding:16px 30px 16px 0;margin-right:30px;border-right:1px solid var(--rule)}}
.meta div:last-child{{border-right:none}}
.meta .k{{display:block;font-family:'IBM Plex Mono',monospace;font-size:10px;
  letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}}
.meta .v{{display:block;margin-top:6px;font-size:15px}}

/* panels */
.panel{{background:var(--panel);border:1px solid var(--rule);box-shadow:var(--shadow);
  padding:44px;display:flex;align-items:center;justify-content:center;overflow-x:auto}}
.panel svg{{color:var(--fg);max-width:100%;height:auto}}
.panel.ink{{background:{B.INK};border-color:{B.INK};color:{B.PAPER}}}
.panel.ink svg{{color:{B.PAPER}}}

/* cuts */
.cuts{{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:1px;background:var(--rule);border:1px solid var(--rule)}}
.cut{{background:var(--panel);padding:30px 26px;display:flex;flex-direction:column;gap:18px}}
.cut .art{{height:96px;display:flex;align-items:center;justify-content:center;color:var(--fg)}}
.cut .art svg{{height:76px;width:auto}}
.cut dl{{margin:0;display:flex;flex-direction:column;gap:0}}
.cut dl div{{display:flex;justify-content:space-between;gap:12px;padding:7px 0;
  border-top:1px solid var(--rule);font-family:'IBM Plex Mono',monospace;font-size:12px}}
.cut dt{{color:var(--dim)}} .cut dd{{margin:0}}

/* colour */
.sws{{display:grid;grid-template-columns:repeat(auto-fit,minmax(268px,1fr));gap:1px;
  background:var(--rule);border:1px solid var(--rule)}}
.sw{{background:var(--panel);display:flex;flex-direction:column}}
.chip{{height:132px}}
.sw-b{{padding:22px 22px 24px;display:flex;flex-direction:column;gap:8px}}
.sw-n{{font-weight:500;font-size:15px}}
.sw-u{{font-size:13.5px;line-height:1.5;color:var(--dim);min-height:60px}}
.specs{{margin:6px 0 0;display:flex;flex-direction:column;gap:0}}
.specs div{{display:flex;justify-content:space-between;gap:10px;padding:5.5px 0;
  border-top:1px solid var(--rule);font-family:'IBM Plex Mono',monospace;font-size:11.5px}}
.specs dt{{color:var(--dim)}} .specs dd{{margin:0;text-align:right}}

/* type */
.faces{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1px;
  background:var(--rule);border:1px solid var(--rule)}}
.face{{background:var(--panel);padding:32px 28px 30px;display:flex;flex-direction:column;gap:14px}}
.face .spec-l{{font-size:44px;line-height:1.05;letter-spacing:-.01em}}
.face .nm{{font-weight:500;font-size:15px}}
.face p{{font-size:13.5px;line-height:1.55;color:var(--dim)}}
table{{width:100%;border-collapse:collapse}}
.scale td{{padding:12px 14px 12px 0;border-top:1px solid var(--rule);vertical-align:baseline}}
.scale td.m{{width:66px;font-size:12.5px;color:var(--fg)}}
.scale td.m.dim{{width:74px;color:var(--dim)}}

/* specimens */
.grid2{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px}}
.grid3{{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:22px}}
figure{{margin:0;display:flex;flex-direction:column;gap:11px}}
figure img{{width:100%;height:auto;display:block;border:1px solid var(--rule);
  box-shadow:var(--shadow);background:{B.PAPER}}}
figcaption{{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--dim)}}

/* rules */
.donts{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;
  background:var(--rule);border:1px solid var(--rule)}}
@media (max-width:900px){{.donts{{grid-template-columns:repeat(2,minmax(0,1fr))}}}}
@media (max-width:560px){{.donts{{grid-template-columns:1fr}}}}
.dont{{background:var(--panel);padding:24px 22px;display:flex;flex-direction:column;gap:7px}}
.dont p{{font-size:13.5px;line-height:1.5;color:var(--dim)}}

/* file index */
.files{{display:flex;flex-direction:column;border-top:1px solid var(--rule)}}
.fr{{display:grid;grid-template-columns:150px minmax(0,1.05fr) minmax(0,1.15fr);gap:26px;
  padding:20px 0;border-bottom:1px solid var(--rule);align-items:start}}
.fr-k{{font-weight:500;font-size:14.5px}}
.fr-v{{font-family:'IBM Plex Mono',monospace;font-size:12px;line-height:1.7;color:var(--fg)}}
.fr-d{{font-size:13.5px;line-height:1.55;color:var(--dim)}}

.note{{border-left:2px solid var(--fg);padding-left:22px;font-weight:300;
  font-size:clamp(17px,1.9vw,20px);line-height:1.45;max-width:46ch}}
a{{color:var(--fg)}} a:focus-visible{{outline:2px solid var(--fg);outline-offset:3px}}
footer{{padding:44px 0 0;border-top:1px solid var(--rule);display:flex;
  justify-content:space-between;gap:20px;flex-wrap:wrap;
  font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--dim)}}
@media (max-width:720px){{
  .wrap{{padding:0 20px 90px}}
  .fr{{grid-template-columns:1fr;gap:8px}}
  .meta div{{border-right:none;padding-right:0;margin-right:0}}
}}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important;transition:none!important}}}}
</style>

<div class="wrap">

<header class="hero">
  <div class="lock">{mark("horizontal", "primary", True, label="FM Consulting")}</div>
  <h1>Brand<br>System</h1>
  <p class="lead" style="margin-top:26px">Ink, paper and one engineered grotesque. Everything
  else in this document exists to keep those three decisions from drifting.</p>
  <div class="meta">
    <div><span class="k">Colours</span><span class="v">2 + 3 tints</span></div>
    <div><span class="k">Typefaces</span><span class="v">2 families</span></div>
    <div><span class="k">Mark cuts</span><span class="v">3 + pixel</span></div>
    <div><span class="k">Module</span><span class="v">w — the spine</span></div>
    <div><span class="k">Issued</span><span class="v">August 2026</span></div>
  </div>
</header>

<section>
  <div class="sec-head"><span class="lab">The mark</span>
  <h2>One drawing, three optical sizes</h2></div>
  <div class="stack">
    <p>The monogram reads as a figure before it reads as initials — head, outstretched arm,
    spine, stance. That is deliberate: the product here is one operator's judgement, not a
    firm's letterhead. The head opens on the spine's axis, the F's crossbar floats free, and
    a single stroke serves as both the F's stem and the M's first leg.</p>
    <p>Because the drawing is fine, it does not survive reduction as a single file. Three cuts
    exist. Match the cut to the size it will be reproduced at, never to the size of the file
    on your screen. Full construction, grid and reduction tests are in the
    <a href="https://claude.ai/code/artifact/7cee10cf-278f-4f26-9d36-14a0c54e4a32">mark
    construction sheet</a>.</p>
  </div>
  <div class="cuts">
    <div class="cut"><div class="art">{mark("monogram","primary",label="Primary cut")}</div>
      <h3>Primary</h3><p class="dim" style="font-size:13.5px;margin:-6px 0 0">Signage,
      stationery, covers, the site header.</p>
      <dl><div><dt>Ring weight</dt><dd>0.55 w</dd></div>
      <div><dt>Crossbar void</dt><dd>2.00 w</dd></div>
      <div><dt>Minimum</dt><dd>64 px / 24 mm</dd></div></dl></div>
    <div class="cut"><div class="art">{mark("monogram","compact",label="Compact cut")}</div>
      <h3>Compact</h3><p class="dim" style="font-size:13.5px;margin:-6px 0 0">Business card,
      email signature, embroidery, decks.</p>
      <dl><div><dt>Ring weight</dt><dd>0.70 w</dd></div>
      <div><dt>Crossbar void</dt><dd>1.20 w</dd></div>
      <div><dt>Minimum</dt><dd>32 px / 12 mm</dd></div></dl></div>
    <div class="cut"><div class="art">{mark("monogram","icon",label="Icon cut")}</div>
      <h3>Icon</h3><p class="dim" style="font-size:13.5px;margin:-6px 0 0">Avatars, app icons,
      favicons. The crossbar is dropped rather than left to break.</p>
      <dl><div><dt>Ring weight</dt><dd>0.85 w</dd></div>
      <div><dt>Crossbar</dt><dd>removed</dd></div>
      <div><dt>Minimum</dt><dd>20 px</dd></div></dl></div>
  </div>
</section>

<section>
  <div class="sec-head"><span class="lab">Lockups</span>
  <h2>Three arrangements, fixed spacing</h2></div>
  <p>The wordmark is Archivo Expanded, set in caps at a cap height of 2.2&nbsp;w with
  +0.18&nbsp;em tracking, and supplied as outlines so no artwork ever depends on a font being
  installed. The gap between mark and wordmark is 3&nbsp;w and does not change. In the
  horizontal lockup the wordmark is centred on the mark's cap-to-foot band, not on its
  bounding box — the descender would otherwise drag it low.</p>
  <div class="panel">{mark("horizontal","primary",True,cls="",label="Horizontal lockup with descriptor")}</div>
  <div class="grid2">
    <div class="panel" style="padding:36px">{mark("stacked","primary",True,label="Stacked lockup")}</div>
    <div class="panel ink" style="padding:36px">{mark("horizontal","primary",True,reverse=True,label="Reversed lockup")}</div>
  </div>
  <div class="stack">
    <h3>Clear space</h3>
    <p class="dim">2&nbsp;w on every side — the mark's own internal void, repeated outside it.
    Nothing sits inside that box: no text, no rule, no image edge. In a circular avatar,
    centre optically rather than by bounding box; the descender and the left-reaching arm pull
    the geometric centre down and to the left.</p>
  </div>
  <div class="panel">{clearspace()}</div>
</section>

<section>
  <div class="sec-head"><span class="lab">Colour</span>
  <h2>Ink and paper. That is the palette.</h2></div>
  <div class="stack">
    <p>There is no accent colour, and adding one later is the single fastest way to make this
    system look like everyone else's. Monochrome is not a limitation here — it is the only
    palette in which a hairline monoline mark stays the most confident thing on the page.
    Hierarchy is carried by weight, scale and space.</p>
    <p>Both the ink and the paper carry the same faint green-grey cast, so printed and digital
    surfaces read as one material rather than a cold screen white beside a borrowed black. The
    three tints exist for rules, panels and secondary text — never for emphasis.</p>
  </div>
  <div class="sws">{SWATCH}</div>
  <p class="note">If a piece needs colour to work, the piece is not working.</p>
</section>

<section>
  <div class="sec-head"><span class="lab">Typography</span>
  <h2>One grotesque, one monospace</h2></div>
  <p>Archivo carries the voice. Its width axis gives the wordmark wide-set, engineered caps
  without introducing a third typeface. IBM Plex Mono carries anything countable — figures,
  addresses, reference numbers, table labels — which is most of what a consultancy's documents
  actually contain. Both are open-licence and ship with this kit.</p>
  <div class="faces">
    <div class="face"><div class="spec-l exp">FM</div><div class="nm">Archivo Expanded</div>
      <p>400 / 500 / 600. Caps only, +0.18&nbsp;em. The wordmark, cover statements, and
      nothing else. It is a signature, not a text face.</p></div>
    <div class="face"><div class="spec-l">Aa</div><div class="nm">Archivo</div>
      <p>300 / 400 / 500 / 600. Headings and running text. Light at display sizes,
      Regular for body, Medium for anything that must be found quickly.</p></div>
    <div class="face"><div class="spec-l m">0123</div><div class="nm">IBM Plex Mono</div>
      <p>400 / 500. Every figure, label, address and reference. Tabular by default so
      columns of numbers line up without intervention.</p></div>
  </div>
  <h3 style="margin-top:14px">Scale</h3>
  <p class="dim">A modular scale at ratio 1.26, anchored on 15&nbsp;px body. Set type on this
  scale or not at all; an off-scale size is always visible next to one that is on it.</p>
  <div class="panel" style="display:block;padding:34px 40px">
    <table class="scale">{SCALE_ROWS}</table></div>
</section>

<section>
  <div class="sec-head"><span class="lab">Stationery</span>
  <h2>Core stationery</h2></div>
  <p>One margin governs every piece. The card front is a full ink field carrying nothing but
  the monogram; everything a recipient needs to read sits on the back, on the same left margin
  as the letterhead. Card and compliments slip carry 3&nbsp;mm bleed with crop marks; the
  letterhead and envelope are supplied at exact size so they can go through an office printer
  unmodified.</p>
  <div class="grid2">
    <figure>{img("card-front","Business card front")}<figcaption>Business card · front · 85 × 55 mm</figcaption></figure>
    <figure>{img("card-back","Business card back")}<figcaption>Business card · back</figcaption></figure>
  </div>
  <div class="grid3">
    <figure>{img("letterhead","A4 letterhead")}<figcaption>Letterhead · A4</figcaption></figure>
    <figure>{img("compslip","Compliments slip")}<figcaption>Compliments slip · 210 × 99 mm</figcaption></figure>
    <figure>{img("envelope","DL envelope")}<figcaption>Envelope · DL 220 × 110 mm</figcaption></figure>
  </div>
</section>

<section>
  <div class="sec-head"><span class="lab">Client documents</span>
  <h2>Proposal, invoice, case study</h2></div>
  <p>The document system is where the monospace earns its place. Fees, dates, references and
  metrics are all set in Plex Mono so they align down the page without tabs or hand-kerning,
  and so a number always looks like a number rather than like prose. Sample copy is real
  enough to stress the layout — replace it, but keep the structure.</p>
  <div class="grid2">
    <figure>{img("proposal-cover","Proposal cover")}<figcaption>Proposal · cover</figcaption></figure>
    <figure>{img("proposal-inside","Proposal inside page")}<figcaption>Proposal · content page</figcaption></figure>
    <figure>{img("invoice","Invoice")}<figcaption>Invoice</figcaption></figure>
    <figure>{img("case-study","Case study")}<figcaption>Case study · one page</figcaption></figure>
  </div>
</section>

<section>
  <div class="sec-head"><span class="lab">Presentation</span>
  <h2>Eight slides, and a rule for each</h2></div>
  <p>Ink for the cover, dividers and close; paper for everything in between — so a deck is
  bracketed rather than uniform. The mono eyebrow at the top of every content slide is the
  navigation. There is no accent stripe, no underline beneath a title, and no chart colour
  that is not a tint of the ink.</p>
  <div class="grid2">
    <figure>{img("deck-cover","Deck cover")}<figcaption>Cover</figcaption></figure>
    <figure>{img("deck-divider","Section divider")}<figcaption>Section divider</figcaption></figure>
    <figure>{img("deck-two-col","Two-column slide")}<figcaption>Two-column + evidence</figcaption></figure>
    <figure>{img("deck-data","Data slide")}<figcaption>Data — chart left, takeaway right</figcaption></figure>
  </div>
  <p class="note">If you cannot write the takeaway as a sentence, the chart is not ready
  to be shown.</p>
</section>

<section>
  <div class="sec-head"><span class="lab">Digital</span>
  <h2>Avatars, covers, favicons, signature</h2></div>
  <p>The icon cut is optically centred in every badge — the geometric centre would sit low and
  left. The 16&nbsp;px favicon is not a scaled vector but a hand-set pixel glyph, because no
  outline survives a sixteen-pixel box. The email signature is supplied twice: once with the
  lockup as an embedded image, and once as type only, for clients that strip images.</p>
  <div class="grid2">
    <figure>{img("cover","LinkedIn cover")}<figcaption>LinkedIn cover · 1584 × 396</figcaption></figure>
    <figure>{img("signature","Email signature")}<figcaption>Email signature · HTML</figcaption></figure>
  </div>
  <div class="grid2">
    <figure style="max-width:300px">{img("avatar","Profile avatar")}<figcaption>Avatar · 400 / 800 / 1000 px</figcaption></figure>
    <figure>{img("favicons","Favicon set at 16, 32, 48 and 180 pixels")}<figcaption>Favicons · 16 px is hand-set</figcaption></figure>
  </div>
</section>

<section>
  <div class="sec-head"><span class="lab">Rules</span><h2>Six ways to break it</h2></div>
  <div class="donts">{DONT_ROWS}</div>
</section>

<section>
  <div class="sec-head"><span class="lab">The kit</span><h2>What you have</h2></div>
  <p>Every artefact in this document is generated from one set of constants. The identity is
  not a folder of files that will drift apart — it is a small program that emits them.</p>
  <div class="files">{FILE_ROWS}</div>
  <p class="dim" style="font-size:13.5px;margin-top:12px">Placeholders marked in the source —
  phone, street, registration and VAT numbers, and the web address — need your real details
  before anything goes to a printer.</p>
</section>

<footer>
  <span>{E['legal']} · brand system · v1.0</span>
  <span>Ink &amp; paper · Archivo · IBM Plex Mono</span>
</footer>

</div>
"""

if __name__ == "__main__":
    open(f"{ROOT}/fm-brand-system.html", "w").write(HTML)
    print("written", len(HTML) // 1024, "KB")
