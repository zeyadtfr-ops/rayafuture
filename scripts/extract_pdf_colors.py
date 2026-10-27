"""
Extract visual colors and structure from Raya_Future_Magazine_Concept_2026.pdf
Renders pages as PNGs so we can visually inspect color palette, then samples
dominant colors from each page using PIL.
"""
import fitz  # PyMuPDF
from PIL import Image
from collections import Counter
import os

PDF_PATH = "/home/z/my-project/upload/Raya_Future_Magazine_Concept_2026.pdf"
OUT_DIR = "/home/z/my-project/download/pdf_pages"
os.makedirs(OUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)
print(f"Total pages: {len(doc)}")

# Render each page
page_paths = []
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0))  # 2x zoom for clarity
    out = f"{OUT_DIR}/page_{i+1:02d}.png"
    pix.save(out)
    page_paths.append(out)
    print(f"Saved: {out}")

print("\n" + "="*60)
print("Extracting dominant colors from each page...")
print("="*60)

def hex_of(rgb):
    return f"#{rgb[0]:02X}{rgb[1]:02X}{rgb[2]:02X}"

# Sample dominant colors per page (skip near-white/near-black background noise)
for path in page_paths:
    img = Image.open(path).convert("RGB")
    # Resize for speed
    img_small = img.resize((150, 200))
    pixels = list(img_small.getdata())
    
    # Filter out pure white & near-white (background)
    filtered = [p for p in pixels if not (p[0] > 240 and p[1] > 240 and p[2] > 240)]
    if not filtered:
        continue
    
    counter = Counter(filtered)
    print(f"\n--- {os.path.basename(path)} ---")
    print(f"Top colors (filtered white bg):")
    for color, count in counter.most_common(8):
        pct = (count / len(filtered)) * 100
        if pct > 1.5:  # only show significant colors
            print(f"  {hex_of(color)}  rgb{color}  {pct:.1f}%")

print("\nDone.")
