# eCapture website

[English](README.md) · [简体中文](README_CN.md)

This repository builds [ecapture.cc](https://ecapture.cc), the official website and user documentation for [eCapture](https://github.com/gojue/ecapture). The eCapture CLI, eBPF probes, tests and release artifacts live in the **separate** `gojue/ecapture` repository. This site uses VitePress, Vue 3 and TypeScript.

## eCapture today

The website covers the `tls` probe for OpenSSL and BoringSSL, `gotls` for Go programs using `crypto/tls`, and `gnutls` for GnuTLS applications. All three can reconstruct messages from packets and TLS secrets without a custom CA.

The Wiki covers **eCapture v2.12.0**. Text mode defaults to the pcapng source. Repeat `--output` to select destinations for structured records, or use `--pcapfile` and `--keylogfile` for native artifacts. **eCaptureQ v1.2.0** connects to `--stream-listen` with the `ecapture.v2` WebSocket subprotocol. [Collector migration notes](https://github.com/gojue/ecapture/releases/tag/v2.12.0) · [eCaptureQ release notes](https://github.com/gojue/ecaptureQ/releases/tag/v1.2.0)

| Runtime | Architecture | Minimum kernel |
| --- | --- | --- |
| Linux | x86_64 / amd64 | 4.18+ |
| Linux | AArch64 / arm64 | 5.5+ |
| Linux | LoongArch64 / loong64 | 6.6+ |
| Android | x86_64 / amd64 | 4.18+ |
| Android | AArch64 / arm64 | 5.5+ |

Run as root or grant the Linux capabilities required by the capture mode. The default text mode and native pcapng mode both attach a TC probe to a network interface and require `CAP_NET_ADMIN`. [Capabilities by kernel and mode](src/en/1-getting-started/1.1-requirements-and-installation.md#kernel-features-and-privileges)

Linux LoongArch64 has release archives and Debian packages, with native OpenSSL and GoTLS end-to-end tests. [Release assets](https://github.com/gojue/ecapture/releases) · [LoongArch64 build and test coverage](https://github.com/gojue/ecapture/blob/v2.12.0/docs/loong64-support.md)

## Where to edit

| Area | Source |
| --- | --- |
| Homepages | `src/index.md`, `src/zh/index.md`, and `.vitepress/theme/components/` |
| Navigation, theme, SEO | `.vitepress/config.mts`, `.vitepress/theme/`, `.vitepress/navigation.json` |
| English and Chinese guide chapters | `src/en/`, `src/zh/` |
| eCaptureQ user guides and Decryptor SDK developer guides | `src/q/{en,zh}/`, `src/decryptor/{en,zh}/` |
| Wiki import | `scripts/wiki.json`, `scripts/generate_docs.js`, `scripts/migrate_docs.js` |
| Shared images | `src/public/assets/` |

The six bilingual Wiki chapters are generated from `scripts/wiki.json`. Edit the snapshot and the published Markdown together so the changes survive the next import. The migration restores the collector overviews and download pages, the Chinese homepage and `src/zh/usage/`. The English homepage, eCaptureQ guides and Decryptor SDK guides are maintained separately.

To import a **verified, current** Wiki snapshot, run `bash scripts/update_docs.sh --no-dev`, review the source and navigation diff, then build the site. The checked-in snapshot may lag the current published chapters; inspect its page plan before running the destructive migration.

## Local development

Use Node.js 22 or newer and pnpm:

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run serve
```

`pnpm run build` writes `dist/` and checks internal links. Use `pnpm run check:mermaid` to validate diagrams and `pnpm run check:q` after the build to validate product pages. Vercel uses the `dist/` output declared in `vercel.json`. Netlify reads `netlify.toml`.

## Documentation search

The site uses VitePress local search. Its English and Chinese indexes are generated during the build, so no search service, API key, or Vercel environment variables are needed. Search results are available once the site is rebuilt and deployed. The current page language determines which index is searched.

`@vue/theme` is pinned and patched in `patches/` to show VitePress local search in its navigation bar.

For website changes, check both homepages and the affected viewport sizes. For eCapture runtime claims, verify against the [upstream source](https://github.com/gojue/ecapture), its [README](https://github.com/gojue/ecapture/blob/master/README.md), [CHANGELOG](https://github.com/gojue/ecapture/blob/master/CHANGELOG.md) and current release; the imported Wiki may lag.

## Issues and licenses

Report website issues in [this repository](https://github.com/gojue/ecapture.cc/issues); report CLI or probe issues in [gojue/ecapture](https://github.com/gojue/ecapture/issues).

This website repository uses the [MIT License](LICENSE). The separate eCapture program uses [Apache-2.0](https://github.com/gojue/ecapture/blob/master/LICENSE).
