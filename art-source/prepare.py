"""Rebuild the four game illustrations from the two original generation outputs."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps

BASE = Path(__file__).resolve().parent
ASSETS = BASE.parent / "assets"
images = []
def save(im, filename, original, role, crop=None):
    output = ASSETS / filename
    im.save(output, "WEBP", quality=89, method=6)
    images.append({"file": "assets/"+filename, "source": "art-source/"+original,
                   "source_sha256": hashlib.sha256((BASE/original).read_bytes()).hexdigest(),
                   "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
                   "size": im.size, "crop": crop, "role": role})

with Image.open(BASE / "routes.png") as sheet:
    for name, lo, hi, role in [("depot",0,523,"Dawn loading depot"),
                               ("junction",525,1033,"Canal junction"),
                               ("terminal",1036,1536,"Night sorting terminal")]:
        crop = (0, lo, sheet.width, hi)
        art = ImageOps.fit(sheet.crop(crop).convert("RGB"), (960,470), method=Image.Resampling.LANCZOS)
        save(art,name+".webp","routes.png",role,crop)
with Image.open(BASE / "cart.png") as sheet:
    alpha = sheet.getchannel("A")
    bbox = alpha.point(lambda a: 255 if a > 115 else 0).getbbox()
    left, top, right, bottom = bbox
    crop = (max(0,left-3), max(0,top-3), min(sheet.width,right+3), min(sheet.height,bottom+3))
    cart = sheet.crop(crop)
    cart.thumbnail((236,174),Image.Resampling.LANCZOS)
    piece = Image.new("RGBA",(240,180))
    piece.alpha_composite(cart,((240-cart.width)//2,(180-cart.height)//2))
    save(piece,"cart.webp","cart.png","Playable parcel cart and game icon",crop)
(BASE/"image-manifest.json").write_text(json.dumps(images,indent=2)+"\n",encoding="utf-8")

