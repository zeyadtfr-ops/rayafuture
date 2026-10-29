#!/usr/bin/env python3
"""Download additional Unsplash images so each article category has a
distinct cover photo. We already have 14 images; this adds more for
better visual variety across the 20 published articles.
"""
import os
import urllib.request
import ssl

OUT_DIR = "/home/z/my-project/public/images"
os.makedirs(OUT_DIR, exist_ok=True)

# Additional images — one per topic/category for variety
NEW_IMAGES = {
    # School / academic year start
    "news-school-start.jpg": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    # Student interview / portrait
    "news-student-interview.jpg": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    # Achievements / awards ceremony
    "news-achievements.jpg": "https://images.unsplash.com/photo-1568411772682-2c0f2c4e8c5e?w=800&q=80",
    # Design thinking workshop
    "news-workshop.jpg": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    # Reading / books
    "news-reading.jpg": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    # Tree planting / environment
    "news-tree-planting.jpg": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80",
    # Study / books + laptop
    "news-study.jpg": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    # Football / soccer
    "news-football.jpg": "https://images.unsplash.com/photo-1551958219-acbc608c637f?w=800&q=80",
    # Cultural competition
    "news-cultural.jpg": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    # Kickboxing / martial arts
    "news-kickboxing.jpg": "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&q=80",
    # Art / painting
    "news-art.jpg": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    # Science fair / exhibition
    "news-science-fair.jpg": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    # Poetry evening
    "news-poetry.jpg": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    # Programming course
    "news-programming.jpg": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    # Writing competition
    "news-writing.jpg": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    # Volunteering / community
    "news-volunteer.jpg": "https://images.unsplash.com/photo-1559027615-cd4628902dc4?w=800&q=80",
    # Environmental / sustainability
    "news-environment.jpg": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    # Science lab
    "news-science-club.jpg": "https://images.unsplash.com/photo-1576072968784-52bb19e362fd?w=800&q=80",
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

print(f"Downloading {len(NEW_IMAGES)} additional images...")
created = 0
skipped = 0
failed = 0

for name, url in NEW_IMAGES.items():
    out_path = os.path.join(OUT_DIR, name)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        skipped += 1
        print(f"  ⊙ {name} (already exists, {os.path.getsize(out_path)//1024} KB)")
        continue
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
            data = r.read()
        with open(out_path, "wb") as f:
            f.write(data)
        size_kb = os.path.getsize(out_path) // 1024
        print(f"  ✓ {name} ({size_kb} KB)")
        created += 1
    except Exception as e:
        print(f"  ✗ {name}: {e}")
        failed += 1

print(f"\nDone: {created} created, {skipped} skipped, {failed} failed")
print(f"\nAll images now in {OUT_DIR}:")
all_imgs = sorted(os.listdir(OUT_DIR))
print(f"  Total: {len(all_imgs)} files")
for img in all_imgs:
    size = os.path.getsize(os.path.join(OUT_DIR, img)) // 1024
    print(f"    {img} ({size} KB)")
