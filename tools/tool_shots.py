"""Take the workbench card pictures: a screenshot of each interactive tool in its starting state.

Serve the site (python -m http.server 8765 from the repo root), then:
    python tools/tool_shots.py
Needs Microsoft Edge or Chrome (headless) and Pillow. Writes assets/img/workbench/<tool>.webp (480 x 360).
"""
import os, re, subprocess, sys, tempfile
from PIL import Image

BROWSERS = [r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe", r"C:\Program Files\Google\Chrome\Application\chrome.exe"]
browser = next((b for b in BROWSERS if os.path.exists(b)), None)
if not browser:
    sys.exit("No Edge or Chrome found")
names = re.findall(r"^\s{2}(\w+): \"", re.search(r"const DOCK_TOOLS = \{(.*?)\n\};", open("src/app.jsx", encoding="utf8").read(), re.S).group(1), re.M)
os.makedirs("assets/img/workbench", exist_ok=True)
base = "http://localhost:8765/index.html#/tool/"
for n in (sys.argv[1:] or names):
    tmp = os.path.join(tempfile.gettempdir(), f"shot_{n}.png")
    subprocess.run([browser, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=700,900", "--virtual-time-budget=6000", f"--screenshot={tmp}", base + n],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=90)
    im = Image.open(tmp).convert("RGB")
    im = im.crop((0, 0, 700, 525)).resize((480, 360), Image.LANCZOS)          # top of the tool, 4:3
    im.save(f"assets/img/workbench/{n}.webp", "WEBP", quality=82)
    print(n, os.path.getsize(f"assets/img/workbench/{n}.webp") // 1024, "KB")
