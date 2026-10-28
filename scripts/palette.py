"""Palette migration between the two FEN1 colour schemes.

    python scripts/palette.py blue    # petrol teal -> blue
    python scripts/palette.py teal    # blue -> petrol teal

Rewrites hex colours and rgba() triples in src/ (hex matching is case-insensitive and keeps the original case).
The mapping is one-to-one, so running it in either direction is lossless.
"""
import os
import re
import sys

# blue  ->  teal
BLUE_TO_TEAL = {
    # surfaces
    "F2F7FF": "F5F7F8", "E3EEFC": "E8EEF0", "F7FAFF": "FAFBFB", "D9E7FA": "DCE6E9",
    "C9DCF5": "CDDADE", "BFD3F0": "C2D1D6", "E3EDFB": "E4EEF0", "CFE4FF": "CDE6EA", "DCE8FB": "DCEDF0",
    # accent
    "1B4FD6": "0E6B7A", "2563EB": "147D8C", "3B82F6": "1E93A5", "5CC8FF": "5BB8C4",
    "2F6BF0": "12808F", "102F9E": "0A4652", "B8D4FB": "B5D5DA",
    # ink and lines
    "0B1530": "11181C", "16264A": "1C2A30", "4A5B7A": "5B6870", "7686A6": "83909A",
    "D0DCF0": "DDE3E6", "B0C0DD": "BDC8CD", "B3C4E0": "B9C6CB", "C5D6F0": "CAD8DC",
}
RGBA_BLUE_TO_TEAL = [
    ("27, 79, 214", "14, 107, 122"), ("11, 27, 80", "17, 24, 28"), ("92, 200, 255", "91, 184, 196"),
    ("59, 130, 246", "30, 147, 165"), ("150, 180, 230", "170, 196, 202"), ("125, 211, 252", "120, 196, 206"),
    ("205, 222, 250", "205, 222, 226"), ("227, 238, 252", "232, 238, 240"), ("5, 15, 60", "8, 14, 18"),
    ("242, 247, 255", "245, 247, 248"),
]


def main(direction: str) -> None:
    if direction == "teal":
        hexmap = BLUE_TO_TEAL
        rgba = RGBA_BLUE_TO_TEAL
    elif direction == "blue":
        hexmap = {v: k for k, v in BLUE_TO_TEAL.items()}
        rgba = [(b, a) for a, b in RGBA_BLUE_TO_TEAL]
    else:
        sys.exit(__doc__)

    def sub_hex(m):
        new = hexmap.get(m.group(1).upper())
        if new is None:
            return m.group(0)
        return "#" + (new.lower() if m.group(1).islower() else new)

    changed = 0
    for root, _, files in os.walk("src"):
        for f in files:
            if not f.endswith((".ts", ".tsx", ".css", ".svg")):
                continue
            path = os.path.join(root, f)
            text = open(path, encoding="utf8").read()
            out = re.sub(r"#([0-9A-Fa-f]{6})\b", sub_hex, text)
            for a, b in rgba:
                out = out.replace("rgba(" + a + ",", "rgba(" + b + ",")
            if out != text:
                open(path, "w", encoding="utf8").write(out)
                changed += 1
    print(f"{direction}: {changed} files changed")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "")
