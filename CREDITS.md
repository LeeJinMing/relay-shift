# Asset credits and AI disclosure

| Material | Origin and preparation |
|---|---|
| Loading depot, canal junction, night terminal | Original OpenAI ImageGen output created for Relay Shift on 2026-11-24. The original is `art-source/routes.png`. Three panels were cropped, resized and encoded to WebP with Pillow. The store cover reuses the loading depot artwork. |
| Parcel cart | Original OpenAI ImageGen output in `art-source/cart.png`, using the route sheet as its reference. Trimmed using its alpha channel and exported on a transparent 240 × 180 canvas. |
| Conveyor tiles, rotating belt, barriers, gates, cart motion, workbench, indicators and lettering layout | Drawn by browser layout and CSS. OpenAI Codex assisted with the design, code, interface copy, store copy and testing. |
| Sound effects | Original oscillator frequencies, envelopes and cue sequences are specified in `sound.mjs` with Codex assistance. Web Audio synthesizes shifts, dispatch, diversion, blocked, failure, delivery and sound-on cues. No sample library, music, voice or generative-audio model was used. |
| Barlow Condensed ExtraBold Italic | Unmodified font by the Barlow Project Authors. The original copyright notice and SIL Open Font License 1.1 are included in both distributions. Other interface type uses system fonts. [Font project](https://github.com/jpt/barlow) · [Font file](https://github.com/google/fonts/blob/main/ofl/barlowcondensed/BarlowCondensed-ExtraBoldItalic.ttf) · [Included license](licenses/Barlow-Condensed-OFL.txt) |
| Game rules and original levels | Carried forward from the entrant’s public repository at commit `24e1684b79158ef0a6edf56a12d7cef779c109ad`. Codex assisted with the original concept, implementation and route design. [Original repository](https://github.com/LeeJinMing/relay-shift) |

The original repository at this commit has no project-wide license file. This package adds the font’s license and records the provenance of the new art. It does not grant a new project-wide license. OpenAI’s applicable service terms govern the generated outputs; no stock imagery or third-party character material was supplied as an image reference. [OpenAI terms](https://openai.com/policies/terms-of-use/) · [OpenAI business terms](https://openai.com/policies/business-terms/)

The GitHub source distribution includes the original image outputs, prompts, deterministic image-preparation script and checksums under `art-source/`. The smaller browser build includes the finished game assets and this credit record.

