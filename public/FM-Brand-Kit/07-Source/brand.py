#!/usr/bin/env python3
"""FM Consulting — brand system.

One source of truth for palette, type, geometry and the logo lockups.
Everything downstream (stationery, documents, digital assets, guidelines)
imports from here, so a change to a constant propagates to every artefact.
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mark as M
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

ROOT = os.path.dirname(os.path.abspath(__file__))
FONTS = f"{ROOT}/fonts"

# ---------------------------------------------------------------- identity
ENTITY = dict(
    legal="FM Consulting (Pty) Ltd",
    wordmark="FM CONSULTING",
    descriptor="GROWTH SYSTEMS",
    person="Fouad Maasdorp",
    role="Founder & Principal Consultant",
    email="fmaasdorp08@gmail.com",
    phone="+27 00 000 0000",          # placeholder — replace
    web="fmconsulting.co.za",         # placeholder — replace
    city="Cape Town",
    country="South Africa",
    street="00 Street Name",          # placeholder — replace
    area="Suburb, Cape Town 0000",    # placeholder — replace
    reg="Reg. 0000/000000/07",        # placeholder — replace
    vat="VAT 0000000000",             # placeholder — replace
)

# ---------------------------------------------------------------- palette
# Ink and paper only. Both carry the same faint green-grey cast, so the
# system reads as one material rather than a cold screen white plus a
# borrowed black. Every value below is deliberate, not inherited.
PALETTE = {
    "ink":      dict(hex="#0F1211", rgb="15 18 17",    cmyk="63 52 52 100", pantone="Pantone 419 C",
                     use="Every mark, every headline, every rule that matters."),
    "paper":    dict(hex="#F2F3F0", rgb="242 243 240", cmyk="3 2 4 0",      pantone="Uncoated natural white stock",
                     use="The default ground. Digital surfaces and unprinted stock."),
    "graphite": dict(hex="#585E5B", rgb="88 94 91",    cmyk="60 47 51 17",  pantone="Pantone 7540 C",
                     use="Secondary text, captions, metadata. Never for headlines."),
    "silver":   dict(hex="#C6C9C4", rgb="198 201 196", cmyk="24 17 22 0",   pantone="Pantone 428 C",
                     use="Hairlines, table rules, dividers. 0.5 pt in print."),
    "mist":     dict(hex="#E4E6E1", rgb="228 230 225", cmyk="11 7 11 0",    pantone="Pantone 427 C",
                     use="Panel fills, table banding, disabled states."),
    "white":    dict(hex="#FFFFFF", rgb="255 255 255", cmyk="0 0 0 0",      pantone="Substrate white",
                     use="Knockout ground and coated card stock only."),
}
INK, PAPER = PALETTE["ink"]["hex"], PALETTE["paper"]["hex"]
GRAPHITE, SILVER, MIST = PALETTE["graphite"]["hex"], PALETTE["silver"]["hex"], PALETTE["mist"]["hex"]

# ---------------------------------------------------------------- type
# Archivo carries the voice; the width axis gives the wordmark its
# engineered, wide-set caps. IBM Plex Mono carries anything countable.
TYPE = dict(
    display=("Archivo Expanded", "600", "Wordmark, covers, section openers. Caps only, +0.14 em."),
    primary=("Archivo", "400 / 500 / 600", "Headings and running text. The workhorse."),
    data=("IBM Plex Mono", "400 / 500", "Figures, labels, addresses, reference numbers, code."),
)
# Modular scale, ratio 1.26, anchored on 15 px body.
SCALE = [11, 12, 13, 15, 17, 21, 27, 34, 43, 54, 68]

# ---------------------------------------------------------------- geometry
# The layout module is the mark's own stroke unit. Print grids are set in
# millimetres derived from the same relationship.
GRID = dict(columns=12, gutter_mm=5, margin_a4_mm=18, baseline_mm=4)

# ---------------------------------------------------------------- outlining

_CACHE = {}


def _font(path):
    if path not in _CACHE:
        f = TTFont(path)
        _CACHE[path] = (f, f.getGlyphSet(), f["head"].unitsPerEm,
                        getattr(f["OS/2"], "sCapHeight", None) or f["head"].unitsPerEm * 0.72)
    return _CACHE[path]


def text_path(s, font_file, cap_height, tracking_em=0.0, x=0.0, y=0.0):
    """Return (svg path data, advance width). y is the BASELINE.
    Type is converted to outlines, so the artwork carries no font dependency."""
    f, gs, upm, cap = _font(f"{FONTS}/{font_file}")
    cmap = f.getBestCmap()
    scale = cap_height / cap
    track = tracking_em * cap_height
    pen_out, cursor = [], 0.0
    for ch in s:
        gname = cmap.get(ord(ch))
        if gname is None:
            cursor += cap_height * 0.5 + track
            continue
        glyph = gs[gname]
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.3f}")
        tp = TransformPen(pen, Transform(scale, 0, 0, -scale, x + cursor, y))
        glyph.draw(tp)
        d = pen.getCommands()
        if d:
            pen_out.append(d)
        cursor += glyph.width * scale + track
    return " ".join(pen_out), cursor - track


def text_width(s, font_file, cap_height, tracking_em=0.0):
    return text_path(s, font_file, cap_height, tracking_em)[1]


# ---------------------------------------------------------------- lockups
# w is the mark's stroke unit. Every distance in a lockup is a multiple of w.
LOCK = dict(
    wordmark_cap=2.2,      # wordmark cap height, in w
    gap_h=3.0,             # mark -> wordmark, horizontal lockup
    gap_v=2.6,             # mark -> wordmark, stacked lockup
    desc_cap=1.10,         # descriptor cap height, in w
    desc_track=0.24,
    desc_gap=1.5,          # wordmark -> rule -> descriptor
    clear=2.0,             # clear space, in w
)
# The wordmark follows the same optical-size logic as the mark: the display
# cut is set lighter and wider, the small cut picks up weight to survive.
WM_CUT = {
    "primary": ("ArchivoExpanded-Regular.ttf", 0.18),
    "compact": ("ArchivoExpanded-Medium.ttf", 0.16),
    "icon":    ("ArchivoExpanded-Medium.ttf", 0.16),
}
DESC_FONT = "IBMPlexMono-500.ttf"

# The mark's ink sits right of its bounding-box centre (long thin arm at the
# left, heavy M at the right). Measured centroid offset as a fraction of the
# mark's width; applied at 60% so centring reads correct without over-shooting.
OPTICAL_DX = {"primary": 0.073, "compact": 0.057, "icon": 0.057}
OPTICAL_BLEND = 0.6


def _mark(cut, w, reverse=False):
    """Mark path plus its key vertical landmarks, in output units.
    Reversed art uses the knockout skeleton — trimmed strokes, opened aperture."""
    s = M.VARIANTS[cut][0]
    if reverse:
        s = M.knockout(s)
    d = M.build(s, w)
    return d, dict(
        x0=min(s["x_left"], s["cx"] - s["R"]) * w, x1=s["leg_r"] * w,
        y0=(s["cy"] - s["R"]) * w, y1=s["stem_foot"] * w,
        cap=s["cap"] * w, foot=s["leg_foot"] * w,
    )


def lockup(kind="horizontal", cut="primary", w=10.0, descriptor=False, colour=INK, pad=0.0,
           reverse=False):
    L, out = LOCK, []
    d, g = _mark(cut, w, reverse)
    WM_FONT, TRACK = WM_CUT[cut]
    cap_h = L["wordmark_cap"] * w
    wm_w = text_width(ENTITY["wordmark"], WM_FONT, cap_h, TRACK)

    if kind == "monogram":
        x0, y0, x1, y1 = g["x0"], g["y0"], g["x1"], g["y1"]
        out.append(d)

    elif kind == "horizontal":
        # optical centring: on the mark's cap-to-foot band, not its bounding box
        wx = g["x1"] + L["gap_h"] * w
        base = (g["cap"] + g["foot"]) / 2 + cap_h / 2
        out.append(d)
        out.append(text_path(ENTITY["wordmark"], WM_FONT, cap_h, TRACK, wx, base)[0])
        x0, y0, x1, y1 = g["x0"], g["y0"], wx + wm_w, g["y1"]
        if descriptor:
            dc = L["desc_cap"] * w
            rule_y = base + L["desc_gap"] * w
            out.append(f"M {wx} {rule_y} H {wx+wm_w} V {rule_y+w*0.09} H {wx} Z")
            dy = rule_y + L["desc_gap"] * w + dc
            out.append(text_path(ENTITY["descriptor"], DESC_FONT, dc, L["desc_track"], wx, dy)[0])
            y1 = max(y1, dy + dc * 0.1)

    else:  # stacked
        mx = (g["x0"] + g["x1"]) / 2 + (g["x1"] - g["x0"]) * OPTICAL_DX[cut] * OPTICAL_BLEND
        base = g["y1"] + L["gap_v"] * w + cap_h
        wx = mx - wm_w / 2
        out.append(d)
        out.append(text_path(ENTITY["wordmark"], WM_FONT, cap_h, TRACK, wx, base)[0])
        x0, x1 = min(g["x0"], wx), max(g["x1"], wx + wm_w)
        y0, y1 = g["y0"], base
        if descriptor:
            dc = L["desc_cap"] * w
            rule_y = base + L["desc_gap"] * w
            out.append(f"M {wx} {rule_y} H {wx+wm_w} V {rule_y+w*0.09} H {wx} Z")
            dw = text_width(ENTITY["descriptor"], DESC_FONT, dc, L["desc_track"])
            dy = rule_y + L["desc_gap"] * w + dc
            out.append(text_path(ENTITY["descriptor"], DESC_FONT, dc, L["desc_track"], mx - dw / 2, dy)[0])
            y1 = dy + dc * 0.1

    p = pad * w
    vb = f"{x0-p:.3f} {y0-p:.3f} {x1-x0+2*p:.3f} {y1-y0+2*p:.3f}"
    body = " ".join(x for x in out if x)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
            f'width="{x1-x0+2*p:.2f}" height="{y1-y0+2*p:.2f}">'
            f'<path d="{body}" fill="{colour}" fill-rule="nonzero"/></svg>'), (x1 - x0, y1 - y0)


def path_only(kind="horizontal", cut="primary", w=10.0, descriptor=False, reverse=False):
    """Just the path data + viewBox, for inlining into HTML."""
    svg, _ = lockup(kind, cut, w, descriptor, reverse=reverse)
    import re
    return (re.search(r'viewBox="([^"]+)"', svg).group(1),
            re.search(r'<path d="([^"]+)"', svg).group(1))


if __name__ == "__main__":
    combos = [
        ("fm-lockup-horizontal", "horizontal", "primary", False),
        ("fm-lockup-horizontal-descriptor", "horizontal", "primary", True),
        ("fm-lockup-stacked", "stacked", "primary", False),
        ("fm-lockup-stacked-descriptor", "stacked", "primary", True),
        ("fm-lockup-horizontal-compact", "horizontal", "compact", False),
        ("fm-monogram", "monogram", "primary", False),
        ("fm-monogram-compact", "monogram", "compact", False),
        ("fm-monogram-icon", "monogram", "icon", False),
    ]
    for name, kind, cut, desc in combos:
        svg, size = lockup(kind, cut, 10.0, desc)
        open(f"{ROOT}/assets/{name}.svg", "w").write(svg)
        svg_r, _ = lockup(kind, cut, 10.0, desc, colour="#FFFFFF", reverse=True)
        open(f"{ROOT}/assets/{name}-reverse.svg", "w").write(svg_r)
        print(f"{name:38s} {size[0]:7.1f} x {size[1]:6.1f}")
