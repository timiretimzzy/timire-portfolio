"""
Generate the site's illustration plates.

Each plate is a small greyscale scene rendered with plain numpy (no 3D
library), then ordered-dithered with a Bayer matrix into two colours, in the
manner of 1980s computer graphics. Output is a tiny 2-colour PNG shown at 2x
with `image-rendering: pixelated`.

These are illustrations. None of them depicts a real interface, product,
person or event, and the site labels them as illustrations.

Run:  python3 scripts/plates/generate.py
Out:  public/images/illustrations/*.png
"""
from pathlib import Path

import numpy as np
from PIL import Image

W, H = 240, 150
OUT = Path(__file__).resolve().parents[2] / "public" / "images" / "illustrations"

PAPER = (244, 240, 232)
INK = (17, 17, 17)
SIGNAL = (255, 91, 35)
CREAM = (232, 223, 200)

BAYER8 = np.array(
    [
        [0, 32, 8, 40, 2, 34, 10, 42],
        [48, 16, 56, 24, 50, 18, 58, 26],
        [12, 44, 4, 36, 14, 46, 6, 38],
        [60, 28, 52, 20, 62, 30, 54, 22],
        [3, 35, 11, 43, 1, 33, 9, 41],
        [51, 19, 59, 27, 49, 17, 57, 25],
        [15, 47, 7, 39, 13, 45, 5, 37],
        [63, 31, 55, 23, 61, 29, 53, 21],
    ]
) / 64.0


def grid():
    y, x = np.mgrid[0:H, 0:W].astype(float)
    return x, y


def dither(lum, light=PAPER, dark=INK):
    """lum in [0,1], 1 = light. Returns a 2-colour palette image."""
    t = np.tile(BAYER8, (H // 8 + 1, W // 8 + 1))[:H, :W]
    on = lum > t
    img = Image.new("P", (W, H))
    img.putpalette(list(dark) + list(light) + [0] * (256 * 3 - 6))
    img.putdata(on.astype(np.uint8).ravel().tolist())
    return img


def save(img, name):
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(OUT / name, optimize=True)
    print("wrote", OUT / name)


def floor(lum, horizon=0.68):
    """A shaded floor plane below the horizon, darker towards the viewer."""
    x, y = grid()
    yy = y / H
    mask = yy > horizon
    lum[mask] = np.clip(0.92 - (yy[mask] - horizon) * 1.2, 0.35, 1)
    return lum


# ---------------------------------------------------------------- cricket ball
def cricket_ball():
    x, y = grid()
    lum = np.ones((H, W))
    lum = floor(lum, 0.74)
    cx, cy, r = 120, 74, 52
    # shadow on the floor
    sh = ((x - cx - 18) / 60) ** 2 + ((y - 128) / 9) ** 2 < 1
    lum[sh] = 0.12
    dx, dy = (x - cx) / r, (y - cy) / r
    d2 = dx * dx + dy * dy
    inside = d2 < 1
    dz = np.sqrt(np.clip(1 - d2, 0, 1))
    L = np.array([-0.55, -0.6, 0.58])
    L = L / np.linalg.norm(L)
    lam = np.clip(dx * L[0] + dy * L[1] + dz * L[2], 0, 1)
    spec = np.clip(dx * 0.0 + dy * 0.0 + dz, 0, 1)
    shade = 0.12 + 0.62 * lam + 0.12 * (lam**18)
    # seam: a great circle tilted, two rows of stitches either side
    nx, ny, nz = 0.82, -0.25, 0.52
    n = np.array([nx, ny, nz]) / np.linalg.norm([nx, ny, nz])
    dist = dx * n[0] + dy * n[1] + dz * n[2]
    seam = np.abs(dist) < 0.035
    shade = np.where(seam, shade * 0.25, shade)
    # stitches: periodic marks along the seam
    ang = np.arctan2(dy, dx)
    stitch = (np.abs(np.abs(dist) - 0.085) < 0.022) & (np.sin(ang * 46) > 0.2)
    shade = np.where(stitch, shade * 0.35, shade)
    lum = np.where(inside, shade, lum)
    _ = spec
    save(dither(lum), "cricket-ball.png")


# ---------------------------------------------------------------- road signs
def road_signs():
    x, y = grid()
    lum = np.ones((H, W))
    lum = floor(lum, 0.8)

    def post(px):
        m = (np.abs(x - px) < 2.2) & (y > 70) & (y < 132)
        lum[m] = 0.25

    # 1. give-way triangle (point down)
    post(46)
    cx, top, s = 46, 22, 58
    a = (y - top) / (s * 0.87)
    tri = (a >= 0) & (a <= 1) & (np.abs(x - cx) <= (1 - a) * s / 2)
    a2 = (y - top - 7) / ((s - 22) * 0.87)
    inner = (a2 >= 0) & (a2 <= 1) & (np.abs(x - cx) <= (1 - a2) * (s - 22) / 2)
    lum[tri] = 0.18
    lum[inner] = 0.97

    # 2. no-entry disc
    post(120)
    d = np.hypot(x - 120, y - 48)
    lum[d < 29] = 0.42
    lum[(np.abs(y - 48) < 6) & (np.abs(x - 120) < 19)] = 0.98
    lum[(d > 27) & (d < 29.5)] = 0.1

    # 3. stop octagon
    post(194)
    ox, oy, R = 194, 48, 29
    ang = np.arctan2(y - oy, x - ox)
    rr = np.hypot(x - ox, y - oy)
    k = np.cos(np.pi / 8) / np.cos(((ang + np.pi / 8) % (np.pi / 4)) - np.pi / 8)
    lum[rr < R * k] = 0.3
    lum[(rr < R * k) & (rr > (R - 3) * k)] = 0.95
    # letters as blocky bars, not text
    for i, bx in enumerate([180, 188, 196, 204]):
        lum[(np.abs(y - oy) < 6) & (x >= bx) & (x < bx + 5)] = 0.95 if i % 2 == 0 else 0.85
    save(dither(lum), "zivvvo-signs.png")


# ---------------------------------------------------------------- member card
def member_card():
    x, y = grid()
    lum = np.ones((H, W))
    lum = floor(lum, 0.72)
    # card as a slightly skewed parallelogram
    u = (x - 40 - (y - 20) * 0.28) / 150
    v = (y - 20) / 92
    card = (u >= 0) & (u <= 1) & (v >= 0) & (v <= 1)
    # drop shadow
    us = (x - 46 - (y - 26) * 0.28) / 150
    vs = (y - 26) / 92
    shadow = (us >= 0) & (us <= 1) & (vs >= 0) & (vs <= 1)
    lum[shadow] = 0.4
    shade = 1.0 - 0.22 * u
    lum[card] = shade[card]
    # magnetic stripe
    lum[card & (v > 0.62) & (v < 0.78)] = 0.12
    # punched slot
    lum[card & (np.abs(u - 0.5) < 0.09) & (np.abs(v - 0.12) < 0.035)] = 0.05
    # photo box and lines (blank: an unissued card)
    lum[card & (u > 0.07) & (u < 0.27) & (v > 0.24) & (v < 0.52)] = 0.55
    for lv in (0.28, 0.38, 0.48):
        lum[card & (u > 0.34) & (u < 0.86) & (np.abs(v - lv) < 0.012)] = 0.3
    save(dither(lum), "clubstack-card.png")


# ---------------------------------------------------------------- STACKED cover
def stacked_cover():
    x, y = grid()
    lum = np.ones((H, W))
    # diagonal speed lines in the background
    lum[((x + y * 0.6) % 22) < 3] = 0.78
    lum = floor(lum, 0.86)
    base_y = 130
    for i in range(9):
        w = 74 - i * 2
        h = 12
        offs = 104 + i * 3.2 + 7 * np.sin(i * 1.7) - w / 2
        top = base_y - (i + 1) * h
        face = (x >= offs) & (x < offs + w) & (y >= top) & (y < top + h - 2)
        topf = (x >= offs + 4) & (x < offs + w + 4) & (y >= top - 4) & (y < top)
        side = (x >= offs + w) & (x < offs + w + 4) & (y >= top - 2) & (y < top + h - 2)
        lum[topf] = 0.82
        lum[face] = 0.5 - 0.03 * (i % 3)
        lum[side] = 0.15
    save(dither(lum, light=SIGNAL, dark=INK), "stacked-cover.png")


# ---------------------------------------------------------------- roulette cover
def roulette_cover():
    x, y = grid()
    lum = np.ones((H, W))
    cx, cy = 120, 75
    # view from above with slight ellipse
    dx, dy = (x - cx), (y - cy) * 1.25
    r = np.hypot(dx, dy)
    ang = np.arctan2(dy, dx)
    pockets = (np.floor((ang + np.pi) / (2 * np.pi) * 37) % 2) == 0
    lum[r < 86] = 0.25
    lum[(r < 80) & (r > 58)] = np.where(pockets, 0.12, 0.88)[(r < 80) & (r > 58)]
    lum[(r < 58) & (r > 54)] = 0.05
    lum[r < 54] = (0.5 + 0.35 * np.cos(ang - 2.2))[r < 54]
    # turret spokes
    spokes = (np.abs(np.sin(ang * 2)) < 0.08) & (r < 40)
    lum[spokes] = 0.95
    lum[r < 8] = 0.98
    # the ball
    bd = np.hypot(x - 177, (y - 52) * 1.25)
    lum[bd < 4.5] = 1.0
    # motion streaks
    lum[(r > 88) & (r < 92) & (ang > 0.2) & (ang < 1.6)] = 0.2
    lum[(r > 95) & (r < 97) & (ang > 0.5) & (ang < 1.3)] = 0.3
    save(dither(lum, light=SIGNAL, dark=INK), "roulette-cover.png")


# ---------------------------------------------------------------- TypeRace cover
def typerace_cover():
    x, y = grid()
    lum = np.ones((H, W))
    # a row of keyboard keys along the bottom, in perspective-ish rows
    for row, (top, h, shade) in enumerate([(104, 14, 0.55), (120, 16, 0.42)]):
        kw = 20 + row * 2
        for i in range(-1, W // kw + 2):
            x0 = i * kw + (row * kw // 2)
            key = (x >= x0 + 2) & (x < x0 + kw - 2) & (y >= top) & (y < top + h)
            lum[key] = shade
            cap = (x >= x0 + 4) & (x < x0 + kw - 4) & (y >= top + 2) & (y < top + 6)
            lum[cap] = 0.85
    lum[y >= 138] = 0.2
    # speed lines behind the car
    for ly in (52, 60, 70, 78, 88):
        lum[(np.abs(y - ly) < 1) & (x < 92) & (((x + ly * 3) % 23) < 15)] = 0.15
    # the car: low wedge body, cockpit, two wheels
    body = (y >= 64) & (y < 90) & (x >= 92) & (x < 206) & (y > 90 - (x - 92) * 0.32)
    lum[body] = (0.35 + 0.25 * ((x - 92) / 114))[body]
    lum[(y >= 84) & (y < 92) & (x >= 88) & (x < 210)] = 0.1
    cockpit = ((x - 150) / 22) ** 2 + ((y - 66) / 9) ** 2 < 1
    lum[cockpit & (y < 70)] = 0.92
    lum[(x >= 196) & (x < 214) & (y >= 58) & (y < 64)] = 0.1  # rear wing
    for wx in (114, 186):
        d = np.hypot(x - wx, y - 92)
        lum[d < 12] = 0.05
        lum[d < 5] = 0.8
    save(dither(lum, light=SIGNAL, dark=INK), "typerace-cover.png")


if __name__ == "__main__":
    cricket_ball()
    road_signs()
    member_card()
    stacked_cover()
    roulette_cover()
    typerace_cover()
