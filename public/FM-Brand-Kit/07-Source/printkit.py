#!/usr/bin/env python3
"""Shared print scaffolding — page setup, bleed, crop marks, type styles.

Every piece is laid out in millimetres against the same grid so a card, a
letterhead and a compliments slip share one optical logic rather than three.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B

ROOT = os.path.dirname(os.path.abspath(__file__))
FONTS = f"file://{ROOT}/fonts"

BLEED = 3      # mm
SLUG = 6       # mm of paper outside the bleed, carrying the crop marks
MARK_LEN = 4   # mm
MARK_OFF = BLEED + 1  # crop marks must sit clear of the bleed, not inside it


def face(name, file, weight="400", style="normal"):
    return (f"@font-face{{font-family:'{name}';src:url('{FONTS}/{file}') format('truetype');"
            f"font-weight:{weight};font-style:{style};font-display:block}}")


FONT_FACES = "".join([
    face("Archivo", "Archivo-Light.ttf", "300"),
    face("Archivo", "Archivo-Regular.ttf", "400"),
    face("Archivo", "Archivo-Medium.ttf", "500"),
    face("Archivo", "Archivo-SemiBold.ttf", "600"),
    face("Archivo", "Archivo-Bold.ttf", "700"),
    face("Archivo Expanded", "ArchivoExpanded-Regular.ttf", "400"),
    face("Archivo Expanded", "ArchivoExpanded-Medium.ttf", "500"),
    face("Archivo Expanded", "ArchivoExpanded-SemiBold.ttf", "600"),
    face("Plex Mono", "IBMPlexMono-400.ttf", "400"),
    face("Plex Mono", "IBMPlexMono-500.ttf", "500"),
])

BASE_CSS = f"""
*{{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
html,body{{background:{B.PAPER};color:{B.INK};
  font-family:'Archivo',Helvetica,Arial,sans-serif;font-weight:400;
  -webkit-font-smoothing:antialiased;font-kerning:normal}}
.mono{{font-family:'Plex Mono',monospace}}
.exp{{font-family:'Archivo Expanded',Helvetica,sans-serif}}
.sheet{{position:relative;overflow:hidden}}
.trim{{position:absolute;overflow:hidden}}
.rule{{background:{B.SILVER};height:.25mm;width:100%}}
.rule-ink{{background:{B.INK};height:.3mm;width:100%}}
svg{{display:block}}
/* crop marks */
.cm{{position:absolute;background:{B.INK}}}
"""


def crop_marks(trim_w, trim_h, off):
    """Four corner pairs, hairline, clear of the trim by MARK_OFF."""
    t = ".08mm"
    out = []
    for (x, y) in [(0, 0), (trim_w, 0), (0, trim_h), (trim_w, trim_h)]:
        hx = x - MARK_LEN - MARK_OFF if x == 0 else x + MARK_OFF
        out.append(f'<div class="cm" style="left:{off+hx}mm;top:{off+y}mm;'
                   f'width:{MARK_LEN}mm;height:{t}"></div>')
        vy = y - MARK_LEN - MARK_OFF if y == 0 else y + MARK_OFF
        out.append(f'<div class="cm" style="left:{off+x}mm;top:{off+vy}mm;'
                   f'width:{t};height:{MARK_LEN}mm"></div>')
    return "".join(out)


def page(trim_w, trim_h, body, marks=True, ground=None, extra_css=""):
    """One printed side. Returns (html_fragment, page_w_mm, page_h_mm)."""
    off = (BLEED + SLUG) if marks else 0
    pw, ph = trim_w + 2 * off, trim_h + 2 * off
    g = ground or B.PAPER
    slug = crop_marks(trim_w, trim_h, off) if marks else ""
    # A ground that is not paper must run to the bleed edge, or the trimmed
    # card shows a white hairline wherever the guillotine drifts.
    bleed_layer = ""
    if marks and g != B.PAPER:
        bleed_layer = (f'<div class="abs-bleed" style="position:absolute;'
                       f'left:{off-BLEED}mm;top:{off-BLEED}mm;'
                       f'width:{trim_w+2*BLEED}mm;height:{trim_h+2*BLEED}mm;background:{g}"></div>')
    frag = (f'<div class="sheet" style="width:{pw}mm;height:{ph}mm;background:{B.PAPER}">'
            f'{bleed_layer}{slug}'
            f'<div class="trim" style="left:{off}mm;top:{off}mm;'
            f'width:{trim_w}mm;height:{trim_h}mm;background:{g}">{body}</div>'
            f'</div>')
    return frag, pw, ph


def document(pages, extra_css=""):
    """pages = list of (fragment, w, h) — all sides must share page size."""
    _, pw, ph = pages[0]
    sheets = "".join(f'<div class="pg">{f}</div>' for f, _, _ in pages)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
{FONT_FACES}{BASE_CSS}{extra_css}
@page{{size:{pw}mm {ph}mm;margin:0}}
.pg{{break-after:page;page-break-after:always}}
.pg:last-child{{break-after:auto;page-break-after:auto}}
</style></head><body>{sheets}</body></html>"""


# ---------------------------------------------------------------- artwork

def logo(kind="horizontal", cut="primary", height_mm=10.0, colour=None,
         descriptor=False, extra="", reverse=False):
    """Inline lockup SVG scaled to a given height in millimetres."""
    vb, d = B.path_only(kind, cut, 10.0, descriptor, reverse=reverse)
    _, _, vw, vh = [float(v) for v in vb.split()]
    w_mm = height_mm * vw / vh
    return (f'<svg viewBox="{vb}" style="width:{w_mm:.3f}mm;height:{height_mm:.3f}mm;{extra}" '
            f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="FM Consulting">'
            f'<path d="{d}" fill="{colour or B.INK}" fill-rule="nonzero"/></svg>')


def logo_width(kind, cut, height_mm, descriptor=False):
    vb, _ = B.path_only(kind, cut, 10.0, descriptor)
    _, _, vw, vh = [float(v) for v in vb.split()]
    return height_mm * vw / vh


def render(html, out_pdf, out_png=None, scale=3):
    from playwright.sync_api import sync_playwright
    tmp = out_pdf.replace(".pdf", ".src.html")
    open(tmp, "w").write(html)
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        pg = b.new_page(device_scale_factor=scale)
        pg.goto(f"file://{os.path.abspath(tmp)}")
        pg.wait_for_timeout(900)
        pg.pdf(path=out_pdf, print_background=True, prefer_css_page_size=True)
        if out_png:
            pg.screenshot(path=out_png, full_page=True)
        b.close()
    return out_pdf
