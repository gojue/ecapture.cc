# eCaptureQ product area maintenance

Hand-maintained documentation outside the generated `docs/` tree. Product facts
and validation were checked on 2026-11-08. Collector and eCaptureQ application
repositories are references; website changes belong in `gojue/ecapture.cc`.

## Ownership and paths

- `/q` and `/q/` provide the default English entry. A page-local head script
  normalizes the slash before hydration, then enters `/q/en/` with query and
  fragment preserved. Static English content/language links remain available
  without JavaScript. No global base change or external proxy rule is needed.
- `src/q/en/` and `src/q/zh/` contain eight paired pages: overview, quick start,
  data sources, interface, protocols, download, installation and FAQ. Keep slugs
  and explicit heading IDs paired for article/section language switching.
- `.vitepress/productNavigation.ts` owns the product menu and sidebars, composed
  with the generated collector navigation by `.vitepress/config.mts`. It also
  normalizes the collector download labels. Do not hand-edit generated JSON.
- `src/index.md` and `src/zh/index.md` retain the collector homepages and include
  `EcaptureQIntro.vue`. Shared components/styles use the existing theme tree.
- `src/public/assets/q/` owns local images, licenses and provenance. Read its
  `README.txt` before replacing a screenshot. The separate concept illustration
  is generated; prompts are in `ecaptureq-illustration-prompt.txt`.

The Wiki migration's explicit deletion list excludes `src/q/`, `src/public/`
and the manual navigation module. It preserves the hand-maintained Chinese
homepage/download page and English download page. Do not run Wiki synchronization
merely to update Q. Review this boundary if migration cleanup changes.

## Source and release baseline

The site baseline is `cecf68d79b05667bef68bd2d813fa02d8f3c4b18`. Product behavior
and screenshots were checked against Q commit
`7bfad7c6989266be97fd563bc1f4655a17e4727c`. The published v1.0.0 release and remote
main resolved to `65795e1d0820294eb81c0768f5678dbeca8d9a45`; only version metadata
changed between these commits, so the pictured UI is unchanged. No open Q PRs
were present at verification. The reference collector worktree's unrelated local
changes were not used to establish published behavior.

Q v1.0.0 was published on 2026-11-08 with 15 packages and SHA256SUMS. Installation
instructions/screenshots retain this explicit baseline; download lists come from
live API data and may include newer releases. Example versioned filenames must
be replaced with the actual downloaded package names. Historical alpha.2 used
`desktop`/`server` names and `ecaptureq-server`; do not apply its instructions to
the v1.0.0 `ecaptureq-web` binary.

Published collector claims were checked against v2.10.0 (2026-11-07). Its newer
remote master `f6c0df58575ca3027ef5baf74c4488c94a263169` adds metadata that cannot
be promised from the older release. A library dependency used by Q does not
upgrade an independently deployed collector.

## Product facts and evidence

Use the source matching the described version; screenshots and mock protocol
examples do not prove probe coverage. The product pages reference the shared Web
and Desktop UI; the three PNG screenshots show the actual Web edition with synthetic data. The
separate generated relationship illustration explains the product roles; it is
not a screenshot. Its prompts are in `ecaptureq-illustration-prompt.txt`.

- [eCaptureQ reference](https://github.com/gojue/ecaptureQ/blob/7bfad7c6989266be97fd563bc1f4655a17e4727c/docs/reference.md): source ownership, CLI, connection direction, saved source manifests, retention, decoding and missing-value semantics.
- [Published v1.0.0 instructions](https://github.com/gojue/ecaptureQ/blob/v1.0.0/README.md): actual package names, binary names and installation requirements.
- [UI implementation](https://github.com/gojue/ecaptureQ/blob/7bfad7c6989266be97fd563bc1f4655a17e4727c/frontend/app.js): filters, record fields and export. In particular, real-time paged export includes the current page's filtered records, not every matching page.
- [Store implementation](https://github.com/gojue/ecaptureQ/blob/7bfad7c6989266be97fd563bc1f4655a17e4727c/internal/app/live.go): 16-source maximum, 65,536 records / 192 MiB counted record JSON defaults, 200 summaries per page, bounded retention and reconnect generations.
- [Screenshot provenance](https://github.com/gojue/ecaptureQ/blob/7bfad7c6989266be97fd563bc1f4655a17e4727c/docs/images/README.md): unedited 1440 × 980 running Web UI captures; bundled mock or local synthetic source data; English light/dark views from the shared UI update.
- [Protocol publication status](https://github.com/gojue/ecaptureQ/blob/7bfad7c6989266be97fd563bc1f4655a17e4727c/docs/upstream-status.md): the official protobuf dependency includes fields 18–20, unlike collector v2.10.0. Building against that dependency does not upgrade an independently running collector.
- [Collector v2.10.0 flags](https://github.com/gojue/ecapture/blob/v2.10.0/cli/cmd/output_flags.go) and [README](https://github.com/gojue/ecapture/blob/v2.10.0/README.md): text + pcapng, HTTP/1.x/2, conditional GoTLS HTTP/3, explicit Redis/MQTT parsers and raw QUIC. `--ecaptureq` opens the typed event listener; `--eventaddr` is a different output interface.
- [Official metadata publication](https://github.com/gojue/ecapture/commit/f6c0df58575ca3027ef5baf74c4488c94a263169): process argv/truncation and TLS metadata forwarding with Decryptor v1.4.3. Do not promise these fields from the older v2.10.0 release.

Keep the distinctions explicit: capture/decryption/reassembly belong to the
collector; eCaptureQ consumes application messages and correlates them. HTTP body
decompression is a display operation. Unpaired does not imply timeout, failure
or a still-running server request. TLS negotiation metadata and JA3/JA4 are not
session keys. Missing observations stay unknown; MySQL query events do not
prove successful execution or contain a full result set. Preview images use
captured bytes and never refetch the original URL.

## Downloads, CDN and compatibility

Collector downloads remain at `/en/download/` and `/zh/download/`; Q downloads
use `/q/en/download/` and `/q/zh/download/`. Q setup instructions live at the
corresponding `/install/` paths. Old download installation hashes redirect after
hydration to the installation article; `#packages` remains a download anchor.

`githubReleases.ts` and `ReleaseDownloads.vue` serve both repositories. Chinese
metadata tries the existing CDN then GitHub; English uses GitHub. They select
at most five actual stable published releases (latest plus up to four historical
versions), sorted by published_at. Drafts, prerelease flags, SemVer prerelease
tags and invalid publication dates are excluded before limiting. The Q API had
listed alpha.2 before v1.0.0 while marking alpha.2 prerelease=false; never assume
API order or that flag alone identifies the latest stable release.

Attachment names and official URLs come from API data, are checked against the
expected repository, and are not synthesized from a fixed version. Latest Q
attachments are grouped into Desktop, Web, Checksums and Other. Historical
entries preserve their actual filenames and link to their release instructions.
The homepage/overview Q badge and collector homepage badge use their own API
metadata; a failed request leaves the download link usable without a version.

`downloads.ts` owns the CDN origin. Chinese attachment rows provide both CDN
and GitHub links; English rows use GitHub. The configured Q mirror prefix is:

```text
https://image.cnxct.com/gojue/ecaptureQ/releases/download/<tag>/<asset>
```

The site owner requested this mapping before the Q mirror was fully configured.
At final verification, the Q mirror metadata endpoint returned HTTP 400 and
GitHub returned 200; browser fallback succeeded. Previously sampled Q binary
mirror paths returned 404. Keep the official alternatives. Activating the CDN
is a separate owner task; this change does not configure an online service.

`DocOutline.vue` merges explicit runtime `data-ec-outline` headings with compiled
Markdown headings, excluding headings inside release notes. It restores delayed
hash targets, opens historical details, preserves corresponding language hashes
and cleans up observers/listeners on navigation. Download pages expose the
existing inline outline below the desktop aside breakpoint. Release note HTML
is escaped and links sanitized. Download rows suppress theme pseudo-markers;
ordinary article lists retain native indented markers and nested levels.

## Validation and reproduction

Use Node.js 22+ and the pinned pnpm version. No dependency or lockfile update is
needed. From the website repository:

```sh
pnpm run build
pnpm run check:q
pnpm run serve --host 127.0.0.1 --port 4174
```

Restart the production preview after rebuilding so its asset index matches the
new files. `check:q` checks eight paired pages, stable navigation, local images,
shared IDs, language/title metadata and 17 production routes/local destinations.
It also rejects fixed release-asset snapshots in dynamic download documents.
The normal strict build dead-link gate remains enabled. If adding Mermaid,
extend the existing Mermaid check roots to include `src/q`.

Completed with Node.js v24.14.1 and pnpm 9.13.2:

- Final `pnpm run build` passed in 10.22s; `pnpm run check:q` and
  `git diff --check` passed. Script syntax checks passed. No Wiki sync ran.
- Existing `pnpm run check:mermaid` passed: 144 diagrams in 67 Markdown files.
  This change adds no Mermaid diagrams.
- Controlled API and real Vue SFC/jsdom tests covered fallback, date ordering,
  stable filtering, limits/fewer releases, wrong-product URLs, cancellation,
  retry, asset groups and dynamic outline lifecycle. No observer feedback loop.
- Production Chromium checks covered `/q` and `/q/` entry, both site/product
  homepages, all product articles, existing collector downloads and representative
  collector documents. Article/section switching, unknown anchors, direct links
  and refresh were checked. A direct `/q` hydration mismatch was fixed and
  rechecked without warnings.
- Product search was checked in English (`Redis`) and Chinese (`未配对`), including
  result navigation. Product locales use their product search indexes; existing
  collector locales retain their current indexes.
- Header placement, desktop menu hover/keyboard/Escape, mobile menu and sidebars,
  code copy, local image enlargement, buttons, light/dark themes and responsive
  reading were checked. Final mobile navigation includes Download and Installation.
- Final download checks observed Q v1.0.0 plus four historical stable releases,
  collector v2.10.0 plus four historical releases, separate homepage badges,
  no download pseudo-bullets, normal installation list indentation, historical
  TOC expansion/focus, EN/ZH hash switching and old installation hash redirects.
  The 390px page width matched its viewport; final console warning/error log
  was empty. Screenshots are review artifacts, outside the published source tree.

Limits: responsive checks used viewport emulation, not physical devices. Other
browser engines/native Q installs were not exercised. No actual probe, captured
traffic, external capture service, binary installation or online deployment was
run. Commands were verified against source and published documentation. CDN
binary availability still depends on the owner's mirror configuration.
