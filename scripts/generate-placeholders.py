#!/usr/bin/env python3
"""Generate local mock product, gallery, hero and texture assets for OBL Fishing.

These files are intentionally named as mocks so they can be replaced with
real photography without changing component code.
"""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
APP = ROOT / "app"

SLATE = (84, 96, 132)
SLATE_DARK = (44, 52, 72)
INK = (17, 17, 17)
OLIVE = (122, 122, 108)
GOLD = (204, 180, 60)
GOLD_SOFT = (212, 196, 106)
PAPER = (245, 243, 237)
CREAM = (236, 228, 196)


def lerp(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    t = max(0.0, min(1.0, t))
    return (
        int(a[0] + (b[0] - a[0]) * t),
        int(a[1] + (b[1] - a[1]) * t),
        int(a[2] + (b[2] - a[2]) * t),
    )


def gradient(size: tuple[int, int], c1: tuple[int, int, int], c2: tuple[int, int, int], diagonal: bool = True) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    denom = float(w + h if diagonal else max(h - 1, 1))
    for y in range(h):
        for x in range(w):
            t = (x + y) / denom if diagonal else y / denom
            px[x, y] = lerp(c1, c2, t)
    return img


def add_noise(img: Image.Image, sigma: float = 28.0, opacity: float = 0.18) -> Image.Image:
    noise = Image.effect_noise(img.size, sigma).convert("RGB")
    return Image.blend(img.convert("RGB"), noise, opacity)


def vignette(img: Image.Image, strength: float = 0.45) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGB", img.size, INK)
    mask = Image.new("L", img.size, 0)
    m = mask.load()
    cx, cy = w / 2, h / 2
    max_d = math.hypot(cx, cy)
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / max_d
            m[x, y] = int(min(255, 255 * (d ** 2) * strength * 1.6))
    return Image.composite(overlay, img, mask)


def ellipses(img: Image.Image, color: tuple[int, int, int], count: int, seed: int) -> Image.Image:
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")
    w, h = img.size
    rng = (seed * 997) % 10000
    def rnd(i: int, a: int, b: int) -> int:
        return a + ((rng * (i + 3) * 131) % (b - a + 1))

    for i in range(count):
        x = rnd(i, -w // 8, w)
        y = rnd(i + 9, -h // 8, h)
        rw = rnd(i + 21, w // 6, w // 2)
        rh = rnd(i + 33, h // 8, h // 3)
        alpha = rnd(i + 44, 18, 70)
        draw.ellipse([x, y, x + rw, y + rh], fill=(*color, alpha))
    base = img.convert("RGBA")
    return Image.alpha_composite(base, layer).convert("RGB")


def save_jpeg(img: Image.Image, path: Path, quality: int = 84) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img = ImageEnhance.Contrast(img).enhance(1.06)
    img = ImageEnhance.Color(img).enhance(0.92)
    img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def atmosphere(
    size: tuple[int, int],
    top: tuple[int, int, int],
    bottom: tuple[int, int, int],
    accent: tuple[int, int, int],
    seed: int,
) -> Image.Image:
    small = (max(1, size[0] // 4), max(1, size[1] // 4))
    img = gradient(small, top, bottom, diagonal=True)
    img = ellipses(img, accent, 7, seed)
    img = ellipses(img, SLATE_DARK, 4, seed + 17)
    img = add_noise(img, 22, 0.16)
    img = vignette(img, 0.42)
    img = img.filter(ImageFilter.GaussianBlur(radius=1.2))
    img = img.resize(size, Image.Resampling.LANCZOS)
    img = add_noise(img, 10, 0.06)
    return img


def write_svg(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def product_svg(
    initials: str,
    name: str,
    c1: str,
    c2: str,
    accent: str,
    ink: str = "#111111",
    paper: str = "#F5F3ED",
) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="{name}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{c1}"/>
      <stop offset="0.55" stop-color="#7A7A6C"/>
      <stop offset="1" stop-color="{c2}"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1200" fill="{ink}"/>
  <rect width="900" height="1200" fill="url(#bg)"/>
  <circle cx="310" cy="470" r="250" fill="{accent}" fill-opacity="0.28"/>
  <circle cx="560" cy="620" r="190" fill="{paper}" fill-opacity="0.12"/>
  <circle cx="640" cy="360" r="120" fill="{ink}" fill-opacity="0.18"/>
  <circle cx="430" cy="540" r="86" fill="none" stroke="{paper}" stroke-opacity="0.35" stroke-width="2"/>
  <circle cx="430" cy="540" r="48" fill="{accent}" fill-opacity="0.8"/>
  <text x="64" y="160" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="6" fill="{paper}" fill-opacity="0.7">OBL FISHING</text>
  <text x="60" y="980" font-family="Georgia, 'Times New Roman', serif" font-size="148" font-weight="700" fill="{paper}" fill-opacity="0.92">{initials}</text>
  <text x="64" y="1048" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="{paper}">{name}</text>
  <text x="64" y="1090" font-family="ui-sans-serif, system-ui, sans-serif" font-size="16" letter-spacing="3" fill="{paper}" fill-opacity="0.55">IMAGINE MOCK • DE ÎNLOCUIT</text>
</svg>
'''


def product_svg_alt(initials: str, name: str, c1: str, c2: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="{name}">
  <defs>
    <linearGradient id="bg2" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{c1}"/>
      <stop offset="1" stop-color="{c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg2)"/>
  <circle cx="900" cy="220" r="260" fill="#F5F3ED" fill-opacity="0.08"/>
  <circle cx="280" cy="520" r="210" fill="#CCB43C" fill-opacity="0.22"/>
  <circle cx="420" cy="400" r="70" fill="#CCB43C"/>
  <text x="72" y="120" font-family="Georgia, serif" font-size="20" letter-spacing="7" fill="#F5F3ED" fill-opacity="0.65">DETALIU PRODUS</text>
  <text x="70" y="700" font-family="Georgia, serif" font-size="96" fill="#F5F3ED">{initials}</text>
  <text x="74" y="748" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18" fill="#F5F3ED" fill-opacity="0.7">{name}</text>
</svg>
'''


def grain_png(path: Path) -> None:
    img = Image.effect_noise((160, 160), 48).convert("L")
    img.save(path, "PNG")


def scale_svg(path: Path) -> None:
    write_svg(
        path,
        '''<svg xmlns="http://www.w3.org/2000/svg" width="48" height="28" viewBox="0 0 48 28">
  <path d="M0 14 Q8 0 16 14 Q24 28 32 14 Q40 0 48 14" fill="none" stroke="#111111" stroke-width="1"/>
</svg>
''',
    )


def branded_mark(size: int, path: Path, source: Path) -> None:
    logo = Image.open(source).convert("RGBA")
    logo.thumbnail((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - logo.width) // 2
    y = (size - logo.height) // 2
    canvas.paste(logo, (x, y), logo)
    canvas.save(path, "PNG")


def og_image(path: Path, logo_path: Path) -> None:
    img = atmosphere((1200, 630), SLATE_DARK, GOLD, GOLD_SOFT, seed=11)
    img = ImageEnhance.Brightness(img).enhance(0.82)
    draw = ImageDraw.Draw(img)
    try:
        font_lg = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 72)
        font_sm = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except OSError:
        font_lg = ImageFont.load_default()
        font_sm = font_lg
    draw.text((72, 360), "OBL Fishing", font=font_lg, fill=PAPER)
    draw.text((74, 450), "Boilies și accesorii pentru pescuit", font=font_sm, fill=PAPER)
    logo = Image.open(logo_path).convert("RGBA")
    logo.thumbnail((210, 210), Image.Resampling.LANCZOS)
    img_rgba = img.convert("RGBA")
    img_rgba.paste(logo, (72, 72), logo)
    path.parent.mkdir(parents=True, exist_ok=True)
    img_rgba.convert("RGB").save(path, "PNG", optimize=True)


def main() -> None:
    logo = PUBLIC / "brand" / "obl-fishing-logo.png"
    assert logo.exists(), "Logo missing"

    products = [
        ("squid-strawberry", "SS", "Squid & Strawberry", "#3F4A5C", "#CCB43C", "#D8C342"),
        ("scopex-banana", "SB", "Scopex Banana", "#546084", "#C0A848", "#E7D96B"),
        ("fishmeal-special", "FS", "Fishmeal Special", "#2C3448", "#7A7A6C", "#CCB43C"),
        ("squid-hookbait", "SH", "Squid Hookbait", "#1A1C16", "#546084", "#CCB43C"),
        ("scopex-wafter", "SW", "Scopex Wafter", "#3A4560", "#A89432", "#F5F3ED"),
        ("popup-citrus", "PC", "Pop-Up Citrus", "#4A4030", "#CCB43C", "#F4E287"),
        ("pva-bags", "PB", "PVA Bags", "#78786C", "#546084", "#F5F3ED"),
        ("bait-floss", "BF", "Bait Floss", "#3F4A5C", "#C0A848", "#F5F3ED"),
        ("rig-kit", "RK", "Rig Kit", "#111111", "#546084", "#CCB43C"),
    ]

    mock_dir = PUBLIC / "products" / "mock"
    for slug, initials, name, c1, c2, accent in products:
        write_svg(mock_dir / f"{slug}-01.svg", product_svg(initials, name, c1, c2, accent))
        write_svg(mock_dir / f"{slug}-02.svg", product_svg_alt(initials, name, c1, c2))

    gallery = [
        ((1600, 1060), SLATE_DARK, SLATE, GOLD, 1),
        ((900, 1200), INK, SLATE_DARK, GOLD_SOFT, 2),
        ((1400, 900), OLIVE, SLATE, GOLD, 3),
        ((1100, 1400), SLATE, GOLD, PAPER, 4),
        ((1600, 900), INK, OLIVE, GOLD_SOFT, 5),
        ((1000, 1000), SLATE_DARK, GOLD, CREAM, 6),
        ((1500, 1100), INK, SLATE, OLIVE, 7),
        ((900, 1100), GOLD, SLATE_DARK, PAPER, 8),
    ]
    gal_dir = PUBLIC / "gallery" / "mock"
    for i, (size, top, bottom, accent, seed) in enumerate(gallery, start=1):
        img = atmosphere(size, top, bottom, accent, seed)
        save_jpeg(img, gal_dir / f"capture-{i:02d}.jpg", quality=82)

    hero = atmosphere((1920, 1280), SLATE_DARK, SLATE, GOLD, seed=21)
    save_jpeg(hero, PUBLIC / "placeholders" / "hero-atmosphere.jpg", 85)

    hero2 = atmosphere((1400, 1600), INK, SLATE, GOLD_SOFT, seed=28)
    save_jpeg(hero2, PUBLIC / "placeholders" / "hero-portrait.jpg", 85)

    grain_png(PUBLIC / "placeholders" / "grain.png")
    scale_svg(PUBLIC / "placeholders" / "scale.svg")

    branded_mark(512, APP / "icon.png", logo)
    branded_mark(180, APP / "apple-icon.png", logo)
    og_image(APP / "opengraph-image.png", logo)

    print("Placeholder assets generated.")


if __name__ == "__main__":
    main()
