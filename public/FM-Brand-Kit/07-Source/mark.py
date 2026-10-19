#!/usr/bin/env python3
"""FM mark — parametric construction.

Every dimension is expressed in stroke units (w). Measured off the original
artwork, the mark resolves almost exactly onto a whole-and-half-unit grid;
the variants below regularise it and add two optical sizes.
"""
import math, os

OUT = os.path.dirname(os.path.abspath(__file__))
F = lambda v: f"{v:.4f}"


# ---------------------------------------------------------------- primitives

def ring(cx, cy, R, t, slot):
    """Open ring. The aperture is a vertical slot of width `slot`, centred on
    the spine axis, severing the lower wall. Terminals are cut parallel to the
    spine, so the void reads as the spine's line passing through the head."""
    r = R - t
    h = slot / 2.0
    yo = cy + math.sqrt(R * R - h * h)
    yi = cy + math.sqrt(r * r - h * h)
    return (f"M {F(cx-h)} {F(yo)} A {F(R)} {F(R)} 0 1 1 {F(cx+h)} {F(yo)} "
            f"L {F(cx+h)} {F(yi)} A {F(r)} {F(r)} 0 1 0 {F(cx-h)} {F(yi)} Z")


def rect(x, y, x2, y2):
    return f"M {F(x)} {F(y)} H {F(x2)} V {F(y2)} H {F(x)} Z"


def fillet(x, y, r):
    """Material added at the concave arm/spine corner (x,y). Opens down-left."""
    if r <= 0:
        return ""
    return (f"M {F(x-r)} {F(y)} L {F(x)} {F(y)} L {F(x)} {F(y+r)} "
            f"A {F(r)} {F(r)} 0 0 0 {F(x-r)} {F(y)} Z")


def diagonal(x_top, y_cap, apex_x, apex_y, th):
    """One leg of the vee, `th` = horizontal thickness, springing right."""
    s = (apex_x - x_top) / (apex_y - y_cap)
    return (f"M {F(x_top)} {F(y_cap)} L {F(x_top+th)} {F(y_cap)} "
            f"L {F(apex_x+th)} {F(apex_y)} L {F(apex_x)} {F(apex_y)} Z"), s


def vee(stem_l, leg_r, y_cap, apex_x, apex_y, w, diag_ratio):
    """The M's vee: both diagonals spring from the FULL width of the verticals
    at the cap line — the spine does not sit beside the M, it becomes it."""
    sl = (apex_x - stem_l) / (apex_y - y_cap)
    sr = (leg_r - apex_x) / (apex_y - y_cap)
    tl = w * diag_ratio * math.sqrt(1 + sl * sl)     # horizontal thickness
    tr = w * diag_ratio * math.sqrt(1 + sr * sr)
    # inner vertex: left diagonal's right edge meets right diagonal's left edge
    t = ((leg_r - tr) - (stem_l + tl)) / (sl + sr)
    ix, iy = stem_l + tl + sl * t, y_cap + t
    # outer vertex: outer edges meet
    to = (leg_r - stem_l) / (sl + sr)
    ox, oy = stem_l + sl * to, y_cap + to
    return (f"M {F(stem_l)} {F(y_cap)} L {F(stem_l+tl)} {F(y_cap)} "
            f"L {F(ix)} {F(iy)} L {F(leg_r-tr)} {F(y_cap)} L {F(leg_r)} {F(y_cap)} "
            f"L {F(ox)} {F(oy)} Z")


# ---------------------------------------------------------------- assembly

def build(s, w):
    """s = skeleton in stroke units; w = stroke unit in output units."""
    u = lambda k: s[k] * w
    cap, stem_l, stem_r = u("cap"), u("stem_l"), u("stem_r")
    leg_r, leg_l = u("leg_r"), u("leg_r") - w
    parts = [
        ring(u("cx"), u("cy"), u("R"), u("t"), u("slot")),
        rect(u("x_left"), cap, stem_r, cap + w),                     # arm
        rect(stem_l, cap, stem_r, u("stem_foot")),                   # spine
        rect(leg_l, cap, leg_r, u("leg_foot")),                      # M right leg
        vee(stem_l, leg_r, cap, u("apex_x"), u("apex_y"), w, s["diag"]),
    ]
    if s.get("cb_right"):
        parts.append(rect(u("x_left"), u("cb_top"), u("cb_right"), u("cb_top") + w))
    if s.get("fillet"):
        parts.append(fillet(stem_l, cap + w, u("fillet")))
    return " ".join(p for p in parts if p)


def svg(s, w=10, colour="#0F0F0F", pad=0.0, name=""):
    d = build(s, w)
    x0 = min(s["x_left"], s["cx"] - s["R"]) * w - pad * w
    y0 = (s["cy"] - s["R"]) * w - pad * w
    x1 = s["leg_r"] * w + pad * w
    y1 = s["stem_foot"] * w + pad * w
    return (f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'viewBox="{F(x0)} {F(y0)} {F(x1-x0)} {F(y1-y0)}" '
            f'width="{F(x1-x0)}" height="{F(y1-y0)}">'
            f'{f"<title>{name}</title>" if name else ""}'
            f'<path d="{d}" fill="{colour}" fill-rule="nonzero"/></svg>')


# ---------------------------------------------------------------- skeletons
# All values are multiples of the stroke unit w.

PRIMARY = dict(
    x_left=0.0, stem_l=8.7, stem_r=9.7,
    cx=9.2, cy=1.7, R=1.7, t=0.55, slot=0.55,        # head: aperture = ring weight
    cap=5.4,                                          # head void = 2.0w
    cb_top=10.2, cb_right=6.7,                        # crossbar void = 2.0w
    apex_x=13.5, apex_y=14.4, leg_r=18.3,
    leg_foot=16.0, stem_foot=18.1,
    fillet=0.55, diag=0.96,
)

COMPACT = dict(
    x_left=0.0, stem_l=6.2, stem_r=7.2,
    cx=6.7, cy=1.75, R=1.75, t=0.70, slot=0.70,
    cap=5.0,                                          # head void = 1.5w
    cb_top=9.8, cb_right=5.0,                         # crossbar void = 1.2w
    apex_x=11.0, apex_y=14.0, leg_r=15.8,
    leg_foot=15.6, stem_foot=16.5,
    fillet=0.0, diag=0.97,
)

ICON = dict(
    x_left=0.0, stem_l=4.5, stem_r=5.5,
    cx=5.0, cy=1.85, R=1.85, t=0.85, slot=0.85,
    cap=4.70,                                         # head void = 1.0w
    cb_top=0, cb_right=0,                             # crossbar dropped
    apex_x=8.75, apex_y=11.20, leg_r=13.0,
    leg_foot=12.37, stem_foot=13.45,
    fillet=0.0, diag=0.98,
)

VARIANTS = dict(primary=(PRIMARY, 10), compact=(COMPACT, 10), icon=(ICON, 12))


def knockout(s):
    """Reversed art: strokes trimmed 4%, voids opened 8% to counter halation."""
    k = dict(s)
    k["t"] *= 0.94
    k["slot"] *= 1.30
    k["diag"] *= 0.96
    return k


if __name__ == "__main__":
    for n, (s, w) in VARIANTS.items():
        open(f"{OUT}/fm-{n}.svg", "w").write(svg(s, w, name=f"FM {n}"))
        open(f"{OUT}/fm-{n}-reverse.svg", "w").write(
            svg(knockout(s), w * 0.97, colour="#FFFFFF", name=f"FM {n} reversed"))
        print("wrote", n)


# ---------------------------------------------------------------- 16px glyph
# Hand-set on a 16x16 pixel grid: 2px strokes, 1px ring wall, and a 2px
# aperture directly above the 2px spine — the concept survives intact at
# favicon size, where any scaled vector would go grey.

PIXEL16 = [
    "....++++........",   # head: 1px wall, 6px ring
    "...+....+.......",
    "...+....+.......",
    "...+....+.......",
    "....+..+........",   # aperture = cols 5-6 = the spine, exactly
    "................",   # 1px void
    "+++++++.......++",   # cap line: arm + spine + M springs
    "++++++++.....+++",
    ".....+++.....+++",
    ".....++++...++++",
    ".....++.++.++.++",
    ".....++.++.++.++",
    ".....++..+++..++",   # vee apex, above the M's foot
    ".....++.......++",
    ".....++.........",   # descender
    ".....++.........",
]


def pixel_svg(grid, colour="#0F0F0F"):
    runs = []
    for y, row in enumerate(grid):
        x = 0
        while x < len(row):
            if row[x] == "+":
                x2 = x
                while x2 + 1 < len(row) and row[x2 + 1] == "+":
                    x2 += 1
                runs.append(f"M{x} {y}h{x2-x+1}v1h-{x2-x+1}Z")
                x = x2 + 1
            else:
                x += 1
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" '
            f'width="16" height="16" shape-rendering="crispEdges">'
            f'<path d="{"".join(runs)}" fill="{colour}"/></svg>')
