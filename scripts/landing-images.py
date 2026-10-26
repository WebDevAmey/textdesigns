"""Generate the landing page's ASCII source image and its static stills.

Run: python3 scripts/landing-images.py
Outputs public/landing/ascii-source.png (fed to the canvas renderer) and
ascii-still.webp / footer-still.webp (shown when motion is reduced or on small screens).
"""
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).resolve().parent.parent / "public" / "landing"
OUT.mkdir(parents=True, exist_ok=True)
BOLD = "/System/Library/Fonts/Helvetica.ttc"
MONO = "/System/Library/Fonts/Menlo.ttc"


def source(w=1600, h=1000):
    """A wave of large letterforms: rows of type whose brightness follows a slow sine field."""
    img = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(img)
    words = ["type", "moves", "blur", "wave", "ember", "scramble", "gooey", "glitch"]
    y, row = -40, 0
    while y < h:
        size = 150 - (row % 3) * 30
        font = ImageFont.truetype(BOLD, size, index=1)
        x = -((row * 137) % 400)
        i = row
        while x < w:
            word = words[i % len(words)]
            box = d.textbbox((0, 0), word, font=font)
            cx = x + (box[2] - box[0]) / 2
            wave = 0.5 + 0.5 * math.sin(cx / 260 + row * 0.9) * math.cos(y / 340)
            d.text((x, y), word, fill=int(40 + wave * 215), font=font)
            x += box[2] - box[0] + size * 0.35
            i += 3
        y += int(size * 0.92)
        row += 1
    img = img.filter(ImageFilter.GaussianBlur(1.2))
    img.save(OUT / "ascii-source.png", optimize=True)
    return img


def still(src, name, chars=" .:-=+*#%@", cell=12, w=1440, h=900, alpha=0.42):
    """Render the source as ASCII once, for when the live canvas is skipped."""
    font = ImageFont.truetype(MONO, cell - 2)
    cols, rows = w // (cell * 0.6), h // cell
    small = src.resize((int(cols), int(rows)))
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(out)
    for r in range(int(rows)):
        for c in range(int(cols)):
            lum = small.getpixel((c, r)) / 255
            ch = chars[min(len(chars) - 1, int(lum * len(chars)))]
            if ch != " ":
                v = int(140 + lum * 100)
                d.text((c * cell * 0.6, r * cell), ch, fill=(v, v - 4, v - 12, int(255 * alpha)), font=font)
    out.save(OUT / name, "WEBP", quality=70)


src = source()
still(src, "ascii-still.webp")
still(src, "footer-still.webp", chars=" ..::", alpha=0.3)
print("done", [p.name for p in OUT.iterdir()])
