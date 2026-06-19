KALLINGAL — ABOUT PAGE PARTNER LOGOS
====================================

The About page ("We offer products & services of") now pulls each partner-brand
logo automatically from an online logo CDN (Google's favicon service) using a
verified domain map in about.component.ts (brandDomains). No image files are
required and no API key is needed.

Resolution order per brand (about.component.ts -> logoSrc()):
  1. Admin "Logo URL" for that brand, if set  (Admin -> Site Content -> About-page brands)
  2. CDN logo mark for the brand's verified domain
  3. The brand name (wordmark tile) — used when neither of the above resolves

Brands without a verified CDN match currently show the wordmark tile:
  JK Tyre, Relstar, Endurance, Glosil, SAI, ARRO, Advik

TO IMPROVE / OVERRIDE A LOGO
----------------------------
Option A (no deploy needed once data is editable): in the admin, set the
  brand's "Logo URL" to any image URL.

Option B (crisp local file): drop a transparent PNG in this folder, e.g.
  jk-tyre.png, then set that brand's "Logo URL" to:
  assets/brand/logos/jk-tyre.png
  (File naming convention: lowercase, spaces -> hyphens.)

Option C (add a CDN brand): add "<slug>: '<domain>'" to the brandDomains map
  in about.component.ts (slug = lowercase, non-alphanumeric -> hyphen).
