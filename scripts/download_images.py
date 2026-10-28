#!/usr/bin/env python3
"""Download professional images from Unsplash for the Raya Institute website."""
import os
import urllib.request
import ssl

OUT_DIR = "/home/z/my-project/public/images"
os.makedirs(OUT_DIR, exist_ok=True)

# Unsplash direct download URLs (royalty-free, no API key needed for source.unsplash.com)
# Using specific photo IDs from Unsplash for guaranteed stable URLs
IMAGES = {
    # Hero - University campus / institute building
    "hero-campus.jpg": "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80",
    # News 1 - Economics / Export / International trade (cargo ship)
    "news-economics.jpg": "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=800&q=80",
    # News 2 - Business management / Leadership (business meeting)
    "news-management.jpg": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    # News 3 - Case study / Strategy (corporate building)
    "news-strategy.jpg": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    # News 4 - Accreditation / Certificate (diploma/degree)
    "news-accreditation.jpg": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    # Program ACC - Accounting (calculator/finance)
    "program-acc.jpg": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    # Program FT - Foreign trade / Shipping port
    "program-ft.jpg": "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80",
    # Program BIS - Business Information Systems (students on computers)
    "program-bis.jpg": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    # Gallery 1-6 - Activities, students, library, etc.
    "gallery-1.jpg": "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80",
    "gallery-2.jpg": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&q=80",
    "gallery-3.jpg": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
    "gallery-4.jpg": "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=400&q=80",
    "gallery-5.jpg": "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80",
    "gallery-6.jpg": "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80",
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for name, url in IMAGES.items():
    out_path = os.path.join(OUT_DIR, name)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
            data = r.read()
        with open(out_path, "wb") as f:
            f.write(data)
        size_kb = os.path.getsize(out_path) // 1024
        print(f"✓ {name} ({size_kb} KB)")
    except Exception as e:
        print(f"✗ {name}: {e}")

print("\nDone. Files in:", OUT_DIR)
print(os.listdir(OUT_DIR))
