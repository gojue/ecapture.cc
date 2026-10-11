# eCapture website

[English](README.md) · [简体中文](README_CN.md)

This repository builds [ecapture.cc](https://ecapture.cc), the official website and user documentation for [eCapture](https://github.com/gojue/ecapture). The eCapture CLI, eBPF probes, tests and release artifacts live in the **separate** `gojue/ecapture` repository. This site uses VitePress, Vue 3 and TypeScript.

## eCapture today

eCapture observes TLS plaintext at library boundaries without a MITM proxy or custom CA. The website highlights the `tls` probe for OpenSSL, LibreSSL and BoringSSL, `gotls` for Go programs, and `gnutls` for GnuTLS libraries.

The upstream v2.8 codebase adds Linux LoongArch64 builds, text/keylog/pcapng capture modes for GnuTLS, and a unified `--eventaddr` destination for captured TLS, GoTLS and GnuTLS events. `--logaddr` carries operational logs separately; [eCaptureQ](https://github.com/gojue/ecaptureq) receives additional typed events. See the [upstream changelog](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md) and [output pipeline guide](https://github.com/gojue/ecapture/blob/master/docs/agent/output-pipeline.md) for the current contracts.

| Runtime | Architecture | Minimum kernel |
| --- | --- | --- |
| Linux | x86_64 / amd64 | 4.18+ |
| Linux | AArch64 / arm64 | 5.5+ |
| Linux | LoongArch64 / loong64 | 6.6+ |
| Android | x86_64 / amd64 | 4.18+ |
| Android | AArch64 / arm64 | 5.5+ |

Android/loong64, Windows and macOS are unsupported. Probe loading requires root or the [documented Linux capabilities](https://github.com/gojue/ecapture/blob/master/docs/minimum-privileges.md). Check the [published release assets](https://github.com/gojue/ecapture/releases) for a LoongArch64 package, or use the [LoongArch64 build guide](https://github.com/gojue/ecapture/blob/master/docs/loong64-support.md). The build path has cross-build and user-mode smoke checks; verify eBPF capture on the target hardware before relying on it in production.

## Where to edit

| Area | Source |
| --- | --- |
| Homepages | `src/index.md`, `src/zh/index.md`, and `.vitepress/theme/components/` |
| Navigation, theme, SEO | `.vitepress/config.mts`, `.vitepress/theme/`, `.vitepress/navigation.json` |
| English and Chinese guide chapters | `src/en/`, `src/zh/` |
| Wiki import | `scripts/wiki.json`, `scripts/generate_docs.js`, `scripts/migrate_docs.js` |
| Shared images | `src/public/assets/` |

Most guide chapters are generated from the periodically updated `scripts/wiki.json`. The import pipeline replaces `src/en/` and `src/zh/`, then restores the hand-maintained Chinese homepage, download pages and `src/zh/usage/`. Do not manually revise generated chapters for website-only changes: a later import will overwrite them. `src/index.md` and `src/zh/index.md` are maintained by this site.

To import a **verified, current** Wiki snapshot, run `bash scripts/update_docs.sh --no-dev`, review the source and navigation diff, then build the site. The checked-in snapshot may lag the current published chapters; inspect its page plan before running the destructive migration.

## Local development

Use Node.js 22 or newer and pnpm:

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run serve
```

`pnpm run build` writes `dist/` and checks internal links. There is no `docs:dev`, `docs:build` or automated test script in this repository. Vercel uses the `dist/` output declared in `vercel.json`; `netlify.toml` contains an alternative build configuration. Deployment triggers are configured by the hosting service, not this repository.

For website changes, check both homepages and the affected viewport sizes. For eCapture runtime claims, verify against the [upstream source](https://github.com/gojue/ecapture), its [README](https://github.com/gojue/ecapture/blob/master/README.md), [CHANGELOG](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md) and current release; the imported Wiki may lag.

## Issues and licenses

Report website issues in [this repository](https://github.com/gojue/ecapture.cc/issues); report CLI or probe issues in [gojue/ecapture](https://github.com/gojue/ecapture/issues).

This website repository uses the [MIT License](LICENSE). The separate eCapture program uses [Apache-2.0](https://github.com/gojue/ecapture/blob/master/LICENSE).
