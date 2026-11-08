# PFP runtime asset subset — provenance

Canonical source (SSOT): `source/jimeshIO/frontend/assets/pfp/` — the DEV-162 PFP pack.
This folder is a freshly generated SUBSET of that pack, copied so the browser-webrtc-hub
dashboard container (bind-mounted this whole `public/` directory) can serve them at
`/pfp/*` without a cross-container proxy.

Loaded at runtime by `public/js/pfp.js` using 'manifest.json' for pool logic.

If the canonical pack grows, regenerate (copy chosen names) here rather than editing the
SVGs in place — the SVGs here must stay byte-identical with the canonical ones.
