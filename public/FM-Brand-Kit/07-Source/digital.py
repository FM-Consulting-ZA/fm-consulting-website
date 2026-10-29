#!/usr/bin/env python3
"""Digital identity: avatars, covers, favicons, email signature, call background."""
import os, sys, io, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B, mark as M
import cairosvg
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = f"{ROOT}/assets/digital"
os.makedirs(OUT, exist_ok=True)
E = B.ENTITY


def svg_png(svg, path, w=None, h=None, bg=None):
    cairosvg.svg2png(bytestring=svg.encode(), write_to=path,
                     output_width=w, output_height=h, background_color=bg)
    return path


def canvas(w, h, ground, items):
    """items = list of (svg_inner, x, y, w, h) in canvas units."""
    body = "".join(
        f'<g transform="translate({x},{y}) scale({sw/vw},{sh/vh})">{inner}</g>'
        for inner, x, y, sw, sh, vw, vh in items)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}"><rect width="{w}" height="{h}" fill="{ground}"/>'
            f'{body}</svg>')


def placed(kind, cut, colour, reverse=False, descriptor=False):
    vb, d = B.path_only(kind, cut, 10.0, descriptor, reverse=reverse)
    x0, y0, vw, vh = [float(v) for v in vb.split()]
    inner = f'<g transform="translate({-x0},{-y0})"><path d="{d}" fill="{colour}" fill-rule="nonzero"/></g>'
    return inner, vw, vh


# ---------------------------------------------------------------- avatars
def avatar(size, ground, ink, reverse, name):
    """Icon cut, optically centred: the box centre is not the visual centre."""
    inner, vw, vh = placed("monogram", "icon", ink, reverse=reverse)
    target = size * 0.46
    sh = target
    sw = target * vw / vh
    dx = sw * B.OPTICAL_DX["icon"] * B.OPTICAL_BLEND
    x = (size - sw) / 2 - dx
    y = (size - sh) / 2 - size * 0.018        # descender pulls the box down; lift it
    svg = canvas(size, size, ground, [(inner, x, y, sw, sh, vw, vh)])
    svg_png(svg, f"{OUT}/{name}-{size}.png", w=size, h=size)


# ---------------------------------------------------------------- cover
def linkedin_cover():
    W, H = 1584, 396
    inner, vw, vh = placed("horizontal", "primary", B.PAPER, reverse=True, descriptor=True)
    sh = 132.0
    sw = sh * vw / vh
    x, y = 120, (H - sh) / 2
    svg = canvas(W, H, B.INK, [(inner, x, y, sw, sh, vw, vh)])
    svg_png(svg, f"{OUT}/fm-linkedin-cover-1584x396.png", w=W, h=H)

    # light variant
    inner2, vw2, vh2 = placed("horizontal", "primary", B.INK, descriptor=True)
    svg2 = canvas(W, H, B.PAPER, [(inner2, x, y, sw, sh, vw2, vh2)])
    svg_png(svg2, f"{OUT}/fm-linkedin-cover-1584x396-light.png", w=W, h=H)


# ---------------------------------------------------------------- call background
def call_background():
    W, H = 1920, 1080
    inner, vw, vh = placed("horizontal", "compact", B.INK)
    sh = 62.0
    sw = sh * vw / vh
    # bottom-left, well clear of where a head sits and of platform chrome
    svg = canvas(W, H, B.PAPER, [(inner, 96, H - 96 - sh, sw, sh, vw, vh)])
    svg_png(svg, f"{OUT}/fm-call-background-light.png", w=W, h=H)
    inner2, vw2, vh2 = placed("horizontal", "compact", B.PAPER, reverse=True)
    svg2 = canvas(W, H, B.INK, [(inner2, 96, H - 96 - sh, sw, sh, vw2, vh2)])
    svg_png(svg2, f"{OUT}/fm-call-background-dark.png", w=W, h=H)


# ---------------------------------------------------------------- favicons
def favicons():
    # 16 px uses the hand-set pixel glyph; everything else uses the icon cut.
    px = M.pixel_svg(M.PIXEL16, colour=B.INK)
    svg_png(px, f"{OUT}/favicon-16.png", w=16, h=16, bg=B.PAPER)
    px_r = M.pixel_svg(M.PIXEL16, colour=B.PAPER)

    for s in (32, 48, 180, 192, 512):
        inner, vw, vh = placed("monogram", "icon", B.PAPER, reverse=True)
        sh = s * 0.50
        sw = sh * vw / vh
        dx = sw * B.OPTICAL_DX["icon"] * B.OPTICAL_BLEND
        svg = canvas(s, s, B.INK, [(inner, (s - sw) / 2 - dx, (s - sh) / 2 - s * 0.018,
                                    sw, sh, vw, vh)])
        svg_png(svg, f"{OUT}/favicon-{s}.png", w=s, h=s)

    ico = Image.open(f"{OUT}/favicon-512.png").convert("RGBA")
    ico.save(f"{OUT}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    # standalone SVG favicon (scales, stays crisp)
    inner, vw, vh = placed("monogram", "icon", B.INK)
    open(f"{OUT}/favicon.svg", "w").write(
        canvas(vw, vh, "none", [(inner, 0, 0, vw, vh, vw, vh)]))


# ---------------------------------------------------------------- email signature
def _b64(path):
    return "data:image/png;base64," + base64.b64encode(open(path, "rb").read()).decode()


def email_signature():
    inner, vw, vh = placed("horizontal", "compact", B.INK)
    h = 132
    w = int(round(h * vw / vh))
    svg = canvas(w, h, "none", [(inner, 0, 0, w, h, vw, vh)])
    svg_png(svg, f"{OUT}/fm-signature-logo@3x.png", w=w * 1, h=h * 1)
    disp_w = int(w / 3)

    mono = "'IBM Plex Mono','SFMono-Regular',Menlo,Consolas,monospace"
    sans = "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif"

    def build(with_logo):
        logo_cell = (
            f'<tr><td style="padding:0 0 12px 0">'
            f'<img src="{_b64(f"{OUT}/fm-signature-logo@3x.png")}" width="{disp_w}" '
            f'height="{h//3}" alt="FM Consulting" style="display:block;border:0"></td></tr>'
        ) if with_logo else (
            f'<tr><td style="padding:0 0 10px 0;font-family:{sans};font-size:13px;'
            f'font-weight:600;letter-spacing:2.4px;color:{B.INK}">FM&nbsp;CONSULTING</td></tr>'
        )
        return f"""<table cellpadding="0" cellspacing="0" border="0" role="presentation"
 style="border-collapse:collapse;font-family:{sans};color:{B.INK}">
  {logo_cell}
  <tr><td style="padding:0 0 2px 0;font-family:{sans};font-size:14px;font-weight:500;
      letter-spacing:-.1px;color:{B.INK}">{E['person']}</td></tr>
  <tr><td style="padding:0 0 10px 0;font-family:{mono};font-size:10.5px;letter-spacing:1.1px;
      text-transform:uppercase;color:{B.GRAPHITE}">{E['role']}</td></tr>
  <tr><td style="padding:0 0 10px 0"><table cellpadding="0" cellspacing="0" border="0"
      role="presentation" style="border-collapse:collapse"><tr>
      <td style="width:260px;height:1px;background:{B.SILVER};line-height:1px;font-size:0">&nbsp;</td>
      </tr></table></td></tr>
  <tr><td style="font-family:{mono};font-size:11.5px;line-height:1.9;color:{B.INK}">
      <a href="mailto:{E['email']}" style="color:{B.INK};text-decoration:none">{E['email']}</a><br>
      {E['phone']}<br>
      <a href="https://{E['web']}" style="color:{B.GRAPHITE};text-decoration:none">{E['web']}</a>
      &nbsp;&nbsp;·&nbsp;&nbsp;<span style="color:{B.GRAPHITE}">{E['city']}</span>
  </td></tr>
</table>"""

    open(f"{ROOT}/assets/digital/fm-email-signature.html", "w").write(build(True))
    open(f"{ROOT}/assets/digital/fm-email-signature-typeonly.html", "w").write(build(False))


if __name__ == "__main__":
    for s in (400, 800, 1000):
        avatar(s, B.INK, B.PAPER, True, "fm-avatar-dark")
        avatar(s, B.PAPER, B.INK, False, "fm-avatar-light")
    print("avatars")
    linkedin_cover(); print("cover")
    call_background(); print("call background")
    favicons(); print("favicons")
    email_signature(); print("signature")
