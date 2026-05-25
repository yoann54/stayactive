"""Generate Chrome Web Store assets and extension icons for StayActive.

Run from this folder: `python3 generate_assets.py`
Outputs into ./assets/  and ../  (for the extension icons referenced by manifest)
"""
from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")
EXT_ROOT = os.path.abspath(os.path.join(HERE, ".."))
os.makedirs(ASSETS, exist_ok=True)

ACCENT = (46, 204, 113)
ACCENT_DARK = (31, 138, 76)
BG_DARK = (22, 24, 29)
BG_LIGHT = (244, 245, 247)
FG = (15, 17, 21)
FG_SOFT = (91, 98, 112)
WHITE = (255, 255, 255)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates_bold = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    candidates_regular = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for path in candidates_bold if bold else candidates_regular:
        if os.path.exists(path):
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def draw_logo(size: int) -> Image.Image:
    """Concentric circles logo on a rounded square."""
    pad = size // 8
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    radius = size // 5
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=ACCENT_DARK)

    inset = pad + 2
    d.ellipse((inset, inset, size - inset, size - inset), outline=WHITE,
              width=max(2, size // 22))

    inner = size // 4
    cx = cy = size // 2
    d.ellipse((cx - inner // 2, cy - inner // 2, cx + inner // 2, cy + inner // 2),
              fill=WHITE)
    return img


def soft_shadow(img: Image.Image, offset=(0, 6), blur=14, opacity=70) -> Image.Image:
    shadow = Image.new("RGBA", (img.width + 60, img.height + 60), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.bitmap((30 + offset[0], 30 + offset[1]),
              img.split()[-1], fill=(0, 0, 0, opacity))
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    shadow.paste(img, (30, 30), img)
    return shadow


def generate_extension_icons() -> None:
    """Sizes referenced by manifest. Also creates icon.png at 128."""
    sizes = [16, 32, 48, 128]
    for s in sizes:
        logo = draw_logo(s)
        path = os.path.join(ASSETS, f"icon-{s}.png")
        logo.save(path, "PNG")
        print(f"wrote {path}")
    # Backwards-compatible single icon used by current manifest
    draw_logo(128).save(os.path.join(EXT_ROOT, "icon.png"), "PNG")
    print(f"wrote {os.path.join(EXT_ROOT, 'icon.png')}")


def generate_store_icon() -> None:
    logo = draw_logo(128)
    logo.save(os.path.join(ASSETS, "icon-128.png"), "PNG")


def _measure(draw: ImageDraw.ImageDraw, text: str, fnt) -> tuple[int, int]:
    l, t, r, b = draw.textbbox((0, 0), text, font=fnt)
    return r - l, b - t


def generate_promo_small() -> None:
    """440x280 small promo tile."""
    W, H = 440, 280
    img = Image.new("RGB", (W, H), BG_DARK)
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        r = int(BG_DARK[0] * (1 - t) + 30 * t)
        g = int(BG_DARK[1] * (1 - t) + 70 * t)
        b = int(BG_DARK[2] * (1 - t) + 50 * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))

    logo = draw_logo(96)
    img.paste(logo, (32, (H - 96) // 2), logo)

    title_font = font(40, bold=True)
    tagline_font = font(16)
    tw, th = _measure(d, "StayActive", title_font)
    d.text((150, 90), "StayActive", fill=WHITE, font=title_font)
    d.text((150, 90 + th + 10), "Keep every tab awake.",
           fill=(200, 220, 210), font=tagline_font)

    img.save(os.path.join(ASSETS, "promo-440x280.png"), "PNG")


def generate_promo_marquee() -> None:
    """1400x560 marquee promo tile."""
    W, H = 1400, 560
    img = Image.new("RGB", (W, H), BG_DARK)
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        r = int(BG_DARK[0] * (1 - t) + 25 * t)
        g = int(BG_DARK[1] * (1 - t) + 75 * t)
        b = int(BG_DARK[2] * (1 - t) + 55 * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))

    pulse = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pulse)
    for radius, alpha in [(380, 22), (260, 36), (160, 60)]:
        pd.ellipse((1050 - radius, H // 2 - radius, 1050 + radius, H // 2 + radius),
                   fill=(46, 204, 113, alpha))
    pulse = pulse.filter(ImageFilter.GaussianBlur(20))
    img.paste(pulse, (0, 0), pulse)

    logo = draw_logo(220)
    img.paste(logo, (980, H // 2 - 110), logo)

    title_font = font(96, bold=True)
    sub_font = font(34)
    small_font = font(22)
    d.text((90, 180), "StayActive", fill=WHITE, font=title_font)
    d.text((90, 300),
           "Stop sites from pausing when you switch tabs.",
           fill=(220, 235, 225), font=sub_font)
    d.text((90, 360),
           "One toggle. No tracking. Fully open source.",
           fill=(160, 180, 175), font=small_font)

    img.save(os.path.join(ASSETS, "promo-1400x560.png"), "PNG")


def generate_screenshot() -> None:
    """1280x800 screenshot showing the popup over a faked browser."""
    W, H = 1280, 800
    img = Image.new("RGB", (W, H), (236, 238, 242))
    d = ImageDraw.Draw(img)

    # Browser chrome
    d.rectangle((0, 0, W, 90), fill=(248, 249, 251))
    d.line((0, 90, W, 90), fill=(220, 222, 228))
    # Three dots
    for i, color in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse((24 + i * 22, 28, 40 + i * 22, 44), fill=color)
    # Tabs
    d.rounded_rectangle((130, 50, 360, 90), radius=8, fill=(255, 255, 255))
    d.text((150, 62), "YouTube — Watching ad", fill=(60, 64, 72), font=font(13))
    d.rounded_rectangle((370, 56, 540, 86), radius=8, fill=(232, 234, 240))
    d.text((388, 64), "Other tab (focused)", fill=(110, 116, 125), font=font(12))
    # URL bar
    d.rounded_rectangle((130, 100, W - 100, 134), radius=18, fill=(255, 255, 255),
                        outline=(220, 222, 228))
    d.text((148, 110), "https://example.com/watch?v=abc",
           fill=(70, 76, 86), font=font(13))

    # Faux video card
    d.rounded_rectangle((130, 170, W - 100, 720), radius=14, fill=WHITE,
                        outline=(220, 222, 228))
    d.rectangle((150, 190, W - 120, 560), fill=(20, 22, 28))
    play_cx, play_cy = (150 + W - 120) // 2, (190 + 560) // 2
    d.ellipse((play_cx - 50, play_cy - 50, play_cx + 50, play_cy + 50),
              fill=(255, 255, 255, 220))
    d.polygon([(play_cx - 18, play_cy - 26), (play_cx - 18, play_cy + 26),
               (play_cx + 22, play_cy)], fill=(20, 22, 28))
    d.text((150, 580), "Ad is playing — even though this tab is in the background.",
           fill=(40, 44, 52), font=font(22, bold=True))
    d.text((150, 620),
           "StayActive keeps document.hidden = false and silences visibilitychange.",
           fill=FG_SOFT, font=font(16))

    # Popup card mock (top right)
    popup_w, popup_h = 320, 200
    px, py = W - popup_w - 60, 170
    popup = Image.new("RGBA", (popup_w, popup_h), (0, 0, 0, 0))
    pd = ImageDraw.Draw(popup)
    pd.rounded_rectangle((0, 0, popup_w, popup_h), radius=16, fill=(255, 255, 255))
    pd.rounded_rectangle((16, 16, 56, 56), radius=12, fill=(46, 204, 113, 30))
    pd.ellipse((24, 24, 48, 48), outline=ACCENT_DARK, width=2)
    pd.ellipse((30, 30, 42, 42), fill=ACCENT_DARK)
    pd.text((68, 20), "StayActive", fill=FG, font=font(16, bold=True))
    pd.text((68, 40), "Always-on focus", fill=FG_SOFT, font=font(11))

    pd.rounded_rectangle((16, 78, popup_w - 16, 150), radius=12,
                         fill=(244, 245, 247), outline=(230, 232, 236))
    pd.ellipse((30, 106, 46, 122), fill=ACCENT)
    pd.text((58, 96), "Active", fill=FG, font=font(13, bold=True))
    pd.text((58, 116), "Tab visibility is being masked.",
            fill=FG_SOFT, font=font(11))
    pd.rounded_rectangle((popup_w - 60, 102, popup_w - 22, 122), radius=10,
                         fill=ACCENT)
    pd.ellipse((popup_w - 41, 104, popup_w - 24, 120), fill=WHITE)

    pd.text((16, 165), "Reload the page if a site still detects the switch.",
            fill=FG_SOFT, font=font(10))

    popup = soft_shadow(popup)
    img.paste(popup, (px - 30, py - 30), popup)

    img.save(os.path.join(ASSETS, "screenshot-1280x800.png"), "PNG")


def main() -> None:
    generate_extension_icons()
    generate_store_icon()
    generate_promo_small()
    generate_promo_marquee()
    generate_screenshot()
    print("done")


if __name__ == "__main__":
    main()
