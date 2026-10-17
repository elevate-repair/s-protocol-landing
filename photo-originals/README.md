# photo-originals/

The 17 owner-approved photos: the **source files** for every photo on the site. This
folder is not published. Cloudflare Pages serves only `site/` (see `wrangler.toml`), and
no page links to these files.

```bash
npm --prefix scripts/images ci              # once: installs sharp in scripts/images/
node scripts/images/build-images.mjs        # → site/images/photos/ + site/images/images.generated.json
node scripts/build-site.mjs --strict        # → site/ (fails if any photo slot is still pending)
```

`scripts/images/photos.json` holds where each photo appears (24 slots, 36 placements
counting the pages that reuse a slot), the desktop and mobile crops, the width ladders and
the alt text. Crops are stored as fractions of the full frame, so they work at any
resolution of the same picture.

## What these files are (checked 2026-10-16)

Uploaded on 2026-10-16 to `site/assets/new photo/` and, byte-identical, to the repository
root (commits `6c605f4`, `c1bcbc9`). Moved here, and the root copies were deleted. Every
file decodes cleanly, is sRGB with no rotation, and shows the approved picture: each
matches its selection preview (correlation 0.91–1.00), and the content matches its alt
text. But **each is a half-size copy**: exactly 50% of the width and height of the
verified original, so 25% of its pixels. They are re-encoded JPEGs (quality ≈ 80 for the
Pexels photos, ≈ 89 for the two Unsplash photos). None is the full-resolution original.

| ID | File | This file (px) | Verified original (px) | Photographer · license |
|---|---|---|---|---|
| HERO-01 | `hero-01.jpg` | 2736 × 1824 | 5472 × 3648 | [Kathleen Austin Kuhn · Pexels](https://www.pexels.com/photo/technician-inspecting-outdoor-hvac-unit-32497161/) |
| OFFICE-01 | `office-01.jpg` | 1920 × 1080 | 3840 × 2160 | [Vitaly Gariev · Pexels](https://www.pexels.com/photo/woman-working-and-talking-on-phone-at-office-22046242/) |
| OFFICE-02 | `office-02.jpg` | 1813 × 2719 | 3625 × 5437 | [Kaboompics (Karolina Grabowska) · Pexels](https://www.pexels.com/photo/thoughtful-businesswoman-talking-on-smartphone-and-taking-notes-4476631/) |
| MOBILE-01 | `mobile-01.jpg` | 3072 × 1728 | 6144 × 3456 | [Artem Podrez · Pexels](https://www.pexels.com/photo/man-sitting-inside-the-vehicle-while-using-his-smartphone-5025642/) |
| SINV-01 | `sinv-01.jpg` | 2008 × 3008 | 4016 × 6016 | [Anete Lusina · Pexels](https://www.pexels.com/photo/man-hammering-nail-into-wall-during-housework-4792525/) |
| SOLO-02 | `solo-02.jpg` | 1839 × 2758 | 3677 × 5515 | [Tima Miroshnichenko · Pexels](https://www.pexels.com/photo/woman-holding-a-white-vacuum-6196239/) |
| CREW-01 | `crew-01.jpg` | 1888 × 3360 | 3776 × 6720 | [TROY ALLEN · Unsplash](https://unsplash.com/photos/construction-workers-building-a-wooden-deck-outdoors-Dbn68nqrA14) |
| CTA-01 | `cta-01.jpg` | 4128 × 2752 | 8256 × 5504 | [Ryan Stephens · Pexels](https://www.pexels.com/photo/roof-repair-and-construction-in-fort-worth-33404981/) |
| IND-APPL-01 | `ind-appl-01.jpg` | 2500 × 1667 | 5000 × 3333 | [Curtis Adams · Pexels](https://www.pexels.com/photo/front-load-washing-machine-beside-white-window-blinds-3935334/) |
| IND-APPL-02 | `ind-appl-02.jpg` | 2500 × 1667 | 5000 × 3333 | [Curtis Adams · Pexels](https://www.pexels.com/photo/empty-modern-kitchen-area-3958962/) |
| IND-HVAC-01 | `ind-hvac-01.jpg` | 2513 × 2000 | 5025 × 4000 | [José Andrés Pacheco Cortes · Pexels](https://www.pexels.com/photo/man-drilling-an-aircon-casing-5463581/) |
| IND-PLMB-01 | `ind-plmb-01.jpg` | 2736 × 1824 | 5472 × 3648 | [Kathleen Austin Kuhn · Pexels](https://www.pexels.com/photo/senior-man-conducting-bathroom-inspection-with-device-32497162/) |
| IND-ELEC-01 | `ind-elec-01.jpg` | 1800 × 1198 | 3600 × 2395 | [Kathleen Austin Kuhn · Pexels](https://www.pexels.com/photo/electrician-inspecting-residential-fuse-box-area-32497160/) |
| IND-HNDY-01 | `ind-hndy-01.jpg` | 2183 × 3274 | 4365 × 6548 | [Daniel & Hannah Snipes · Pexels](https://www.pexels.com/photo/skilled-roofer-climbing-ladder-for-repair-38346734/) |
| IND-GC-01 | `ind-gc-01.jpg` | 2895 × 1930 | 5790 × 3860 | [Josh Olalde · Unsplash](https://unsplash.com/photos/a-man-in-a-hard-hat-and-safety-gear-working-on-a-wooden-structure-EWoU3snzadU) |
| IND-CLEAN-01 | `ind-clean-01.jpg` | 1885 × 2827 | 3769 × 5653 | [Tima Miroshnichenko · Pexels](https://www.pexels.com/photo/back-view-of-workers-walking-towards-a-house-6196685/) |
| IND-LAND-01 | `ind-land-01.jpg` | 2000 × 3000 | 4000 × 6000 | [Luis Negron · Pexels](https://www.pexels.com/photo/a-person-mowing-the-lawn-grass-13630739/) |

## Is half size enough?

For today's layouts, almost everywhere. The site uses 47 crops of these files.

- **42 of 47 crops meet the original requirement** (a crop at least 2400 px wide for
  hero and full-width desktop slots, 1200 px elsewhere). The other five fall short:

  | Photo | Slot | Crop | Requirement | Widest render (needs 2×) |
  |---|---|---|---|---|
  | SOLO-02 | S Invoice hero, desktop (≥ 1024 px) | 1839 px | 2400 px | 460 px (920 px) |
  | HERO-01 | Home hero, desktop (≥ 1024 px) | 1314 px | 2400 px | 460 px (920 px) |
  | IND-ELEC-01 | Home "Electrical" card, phones and tablets (< 1024 px) | 958 px | 1200 px | 470 px (940 px) |
  | IND-ELEC-01 | S Protocol technician-app panel, ≥ 768 px | 958 px | 1200 px | 460 px (920 px) |
  | IND-HVAC-01 | Home "HVAC" card, desktop (≥ 1024 px) | 1140 px | 1200 px | 282 px (564 px) |

- **46 of 47 crops are sharp on 2× (Retina) screens**: at least twice as wide as the
  slot ever renders between 320 and 1920 px. The exception is SOLO-02's mobile crop: the
  S Invoice hero on 768–1023 px screens has 1839 px for a slot up to 959 px wide, which
  is about 4% short of 2×.

Nothing was upscaled, and nothing was generated or retouched with AI.

**Replace with the full-resolution originals, in this order:** SOLO-02, IND-ELEC-01,
IND-HVAC-01, HERO-01. The other 13 meet every target as they are. Originals would still
give every photo more headroom.

## Replacing a file with its original

1. Open the photo's page from the table and download the original size (Pexels: Free
   download → Original; Unsplash: Download → Original size).
2. Save it here under the file name in the table, replacing the half-size copy.
3. Run `node scripts/images/build-images.mjs --only SOLO-02` (any IDs, comma-separated),
   then `node scripts/build-site.mjs --strict`, and commit `photo-originals/`,
   `site/images/` and `site/`.

Nothing else changes, because the crops are fractions of the frame. The script refuses a
file with a different aspect ratio (a different photo or a cropped copy). Once all 17
are originals, `node scripts/images/build-images.mjs --require-originals --strict-resolution`
confirms it.

## Removed during the photo integration (2026-10-16)

- The 17 duplicate JPGs at the repository root (identical to the files here).
- `site/assets/new photo/`, moved here. A rebuild of `site/` would have deleted it.
- 31 small selection previews uploaded to `site/assets/brand/` (commit `3b62ce9`, 190–960 px
  wide). These were thumbnails of every candidate photo: the 17 approved, 9 alternates,
  2 paid-stock options and 3 rejected. No page used them, and `site/assets/brand/` is
  regenerated from `src/brand/` on every build. The 10 logo and brand files there are
  unchanged. The previews remain in the Git history.
