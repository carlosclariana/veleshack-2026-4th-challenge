"""Rebuild delivery/PANEL_PREVIEW.html from the live panel.

The preview is the same page, opened directly on the archived run so it can be
shown without Docker. Run this after every change to arena/static/index.html.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "arena" / "static" / "index.html"
TARGET = ROOT / "delivery" / "PANEL_PREVIEW.html"
HOOK = "tick();\n</script>"

html = SOURCE.read_text(encoding="utf-8")
if html.count(HOOK) != 1:
    raise SystemExit("panel start-up call not found; update HOOK in this script")
TARGET.write_text(html.replace(HOOK, "$('replay').click();" + HOOK), encoding="utf-8", newline="\n")
print(f"wrote {TARGET.relative_to(ROOT)}")
