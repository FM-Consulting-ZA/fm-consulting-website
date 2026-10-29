#!/usr/bin/env python3
"""Core stationery: business card, letterhead, continuation, comp slip, envelope."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B, printkit as P

E = B.ENTITY
OUT = f"{os.path.dirname(os.path.abspath(__file__))}/out"
os.makedirs(OUT, exist_ok=True)

CSS = f"""
.abs{{position:absolute}}
.name{{font-weight:500;font-size:8.6pt;letter-spacing:-.005em;line-height:1.15}}
.role{{font-family:'Plex Mono',monospace;font-size:5.8pt;letter-spacing:.09em;
      text-transform:uppercase;color:{B.GRAPHITE};line-height:1.4;margin-top:1.2mm}}
.contact{{font-family:'Plex Mono',monospace;font-size:6pt;line-height:1.72;
      letter-spacing:.01em;color:{B.INK}}}
.contact .dim{{color:{B.GRAPHITE}}}
.foot{{font-family:'Plex Mono',monospace;font-size:5.6pt;line-height:1.55;
      letter-spacing:.02em;color:{B.GRAPHITE}}}
.eyebrow{{font-family:'Plex Mono',monospace;font-size:6.2pt;letter-spacing:.26em;
      text-transform:uppercase;color:{B.GRAPHITE}}}
"""


def d(x, y, extra=""):
    return f'class="abs" style="left:{x}mm;top:{y}mm;{extra}"'


# ---------------------------------------------------------------- card 85x55
def business_card():
    W, H = 85, 55
    # FRONT — ink field, knockout monogram, nothing else.
    mh = 17.0
    mw = P.logo_width("monogram", "compact", mh)
    dx = mw * B.OPTICAL_DX["compact"] * B.OPTICAL_BLEND      # optical, not box, centring
    front = (f'<div {d((W-mw)/2-dx, (H-mh)/2-0.8)}>'
             f'{P.logo("monogram","compact",mh,colour=B.PAPER,reverse=True)}</div>')

    # BACK — paper, information set on the same left margin as everything else.
    m = 7.0
    lock_h = 8.0
    rule_y = 35.0
    blk_y = 38.6
    back = (
        f'<div {d(m, m)}>{P.logo("horizontal","compact",lock_h)}</div>'
        f'<div {d(m, rule_y, f"width:{W-2*m}mm")}><div class="rule"></div></div>'
        f'<div {d(m, blk_y)}>'
        f'  <div class="name">{E["person"]}</div>'
        f'  <div class="role">{E["role"]}</div>'
        f'</div>'
        f'<div {d(m, blk_y, f"width:{W-2*m}mm;text-align:right")}>'
        f'  <div class="contact">{E["email"]}<br>{E["phone"]}<br>'
        f'  <span class="dim">{E["web"]}</span></div>'
        f'</div>'
    )
    pages = [P.page(W, H, front, ground=B.INK), P.page(W, H, back)]
    P.render(P.document(pages, CSS), f"{OUT}/fm-business-card.pdf",
             f"{OUT}/preview-business-card.png")


# ---------------------------------------------------------------- A4 letterhead
def letterhead(continuation=False):
    W, H = 210, 297
    m = 18.0
    right = W - m
    if continuation:
        head = (f'<div {d(m, 15)}>{P.logo("monogram","compact",9.0)}</div>'
                f'<div {d(m, 15, f"width:{W-2*m}mm;text-align:right")}>'
                f'<span class="eyebrow">PAGE&nbsp;&nbsp;02</span></div>'
                f'<div {d(m, 30, f"width:{W-2*m}mm")}><div class="rule"></div></div>')
        foot = ""
    else:
        lw = P.logo_width("horizontal", "primary", 12.0)
        head = (f'<div {d(m, 15)}>{P.logo("horizontal","primary",12.0)}</div>'
                f'<div {d(m, 19.4, f"width:{W-2*m}mm;text-align:right")}>'
                f'<span class="eyebrow">{E["descriptor"]}</span></div>'
                f'<div {d(m, 34, f"width:{W-2*m}mm")}><div class="rule"></div></div>')
        col = (W - 2 * m) / 3
        foot = (
            f'<div {d(m, 268, f"width:{W-2*m}mm")}><div class="rule"></div></div>'
            f'<div {d(m, 271.5, f"width:{col}mm")}><div class="foot">'
            f'{E["legal"]}<br>{E["reg"]}<br>{E["vat"]}</div></div>'
            f'<div {d(m+col, 271.5, f"width:{col}mm;text-align:center")}><div class="foot">'
            f'{E["street"]}<br>{E["area"]}<br>{E["country"]}</div></div>'
            f'<div {d(m+2*col, 271.5, f"width:{col}mm;text-align:right")}><div class="foot">'
            f'{E["email"]}<br>{E["phone"]}<br>{E["web"]}</div></div>'
        )
    body = head + foot
    pages = [P.page(W, H, body, marks=False)]
    name = "fm-letterhead-continuation" if continuation else "fm-letterhead"
    P.render(P.document(pages, CSS), f"{OUT}/{name}.pdf", f"{OUT}/preview-{name}.png")


# ---------------------------------------------------------------- comp slip
def compliments():
    W, H = 210, 99
    m = 18.0
    body = (
        f'<div {d(m, 14)}>{P.logo("horizontal","primary",11.0)}</div>'
        f'<div {d(m, 44, f"width:{W-2*m}mm")}>'
        f'<div style="font-weight:300;font-size:19pt;letter-spacing:-.02em">With compliments</div></div>'
        f'<div {d(m, 74, f"width:{W-2*m}mm")}><div class="rule"></div></div>'
        f'<div {d(m, 77.5, f"width:{W-2*m}mm")}><div class="foot">'
        f'{E["legal"]} &nbsp;·&nbsp; {E["area"]} &nbsp;·&nbsp; {E["email"]} &nbsp;·&nbsp; {E["web"]}'
        f'</div></div>'
    )
    P.render(P.document([P.page(W, H, body)], CSS),
             f"{OUT}/fm-compliments-slip.pdf", f"{OUT}/preview-compliments-slip.png")


# ---------------------------------------------------------------- DL envelope
def envelope():
    W, H = 220, 110
    m = 14.0
    body = (
        f'<div {d(m, 12)}>{P.logo("horizontal","compact",7.5)}</div>'
        f'<div {d(m, 25)}><div class="foot" style="font-size:6pt">'
        f'{E["street"]}<br>{E["area"]}<br>{E["country"]}</div></div>'
    )
    P.render(P.document([P.page(W, H, body, marks=False)], CSS),
             f"{OUT}/fm-envelope-dl.pdf", f"{OUT}/preview-envelope-dl.png")


if __name__ == "__main__":
    business_card(); print("card")
    letterhead(); print("letterhead")
    letterhead(continuation=True); print("continuation")
    compliments(); print("comp slip")
    envelope(); print("envelope")
