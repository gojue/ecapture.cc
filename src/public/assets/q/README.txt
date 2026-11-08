# eCaptureQ image provenance

The three PNG screenshots below are unchanged copies from `gojue/ecaptureQ`, commit
`7bfad7c6989266be97fd563bc1f4655a17e4727c` (the checked source commit).
The upstream `docs/images/README.md` records capture on 2026-11-08 during the
shared UI update based on `34e4d7d`. The original dimensions are 1440 × 980;
PNG files are already 165–204 KiB and have not been resized or recompressed.

- `overview.png`: running Web UI, bundled mock session, HTTP/3 request, English,
  light theme.
- `protocol-details.png`: running Web UI, bundled mock session, MQTT PUBLISH,
  English, dark theme.
- `sources.png`: running Web UI, editable source defaults from a local synthetic
  WebSocket endpoint and inert example launch command.

All records are mock or synthetic. These are real screenshots, not generated
interface illustrations. They contain no real captured traffic or credentials.
They do not demonstrate real-probe protocol coverage. Web and Desktop share the
UI, but these screenshots are of the Web edition, not a native desktop window.

The official `v1.0.0` release was published on 2026-11-08 from commit
`65795e1d0820294eb81c0768f5678dbeca8d9a45`, with 15 packages and `SHA256SUMS`.
The difference from the checked screenshot source commit updates version
metadata only (`package.json` and `build/desktop/Info.plist`); the pictured UI
is unchanged. See the product download guide for verified release package names.

Sources:
- https://github.com/gojue/ecaptureQ/blob/7bfad7c6989266be97fd563bc1f4655a17e4727c/docs/images/README.md
- https://github.com/gojue/ecaptureQ/blob/7bfad7c6989266be97fd563bc1f4655a17e4727c/docs/ui-verification.md
- https://github.com/gojue/ecaptureQ/releases/tag/v1.0.0

Copyright 2026 CFC4N. Reused under Apache-2.0; the accompanying `LICENSE` and
`NOTICE` are copied unchanged from eCaptureQ. The website's MIT license does not
replace these notices.

## Conceptual relationship illustration

terminal-to-interface-fine.webp is a generated conceptual illustration, not an application
screenshot. It was created for this website on 2026-11-08 with the built-in
OpenAI image generation tool, using no real captures or third-party references.
Its fine gray lines and light surfaces follow this website’s original
capture-flow illustration, used as a style reference. The current revision
shows terminal text capture output on the left and one
graphical analysis interface, with a captured-image preview, on the right.
It does not distinguish Desktop and Web editions or imply stdin/log-file import. Its arrows show message flow, not who initiates a
network connection. Localized labels are rendered as HTML by QRelationship.vue.

The 1752 x 897 transparent image is encoded as WebP (quality 90). It is separate
from the Apache-2.0 screenshot material above and distributed with this website
under its MIT license. The full generation and refinement prompts are maintained
in maintenance/ecaptureq-illustration-prompt.txt in the website repository.
