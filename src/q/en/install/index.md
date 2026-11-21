---
title: Installation
description: Install eCaptureQ Desktop or start the Web service, with dependencies and first-run steps.
lang: en-US
---

# Installation

Choose a package for your operating system and CPU on the [Download page](/q/en/download/). Choose **Desktop** to open a native application, or **Web** to run a service and open its interface in a browser. Both connect to eCapture; neither package contains a capture probe.

## Documentation version and scope {#version}

These instructions cover **eCaptureQ v1.2.0**, released on 21 November 2026. The live examples use **eCapture v2.12.0** on the capture host. Match the package filename to your download. The screenshots are from v1.0.0 and use synthetic data. [Official v1.2.0 release](https://github.com/gojue/ecaptureQ/releases/tag/v1.2.0)

The release includes 17 application packages and a shared `SHA256SUMS`. Get the matching documentation and configuration example from the tagged repository. [Configuration example](https://github.com/gojue/ecaptureQ/blob/v1.2.0/config/sources.example.json) · [Compilation guide](https://github.com/gojue/ecaptureQ/blob/v1.2.0/docs/compilation.md)

## CLI migration {#cli}

| eCaptureQ option | v1.0.0 | v1.1.0 and v1.2.0 |
| --- | --- | --- |
| eCaptureQ Web HTTP listener | `--addr` | `--listen` |
| eCaptureQ collector endpoint; repeatable | `--ecaptureq` | `--data-source` |
| Generate a Web password hash | Unavailable | `--hash-password` |

On the **collector**, eCapture v2.12.0 replaces `--ecaptureq` with `--stream-listen`. Upgrade the collector and eCaptureQ together. Q v1.2.0 requires the `ecapture.v2` WebSocket subprotocol. Q v1.0.0 and v1.1.0 use the previous protocol. On the **analysis host**, Q v1.2.0 still uses `--data-source` for the collector URL and `--listen` for the Web UI.

```sh
# eCaptureQ v1.2.0 on the analysis host
ecaptureq-web --listen 127.0.0.1:28257 \
  --data-source ws://127.0.0.1:28256/ --mode live
```

## Choose a package {#packages}

Desktop files begin with `ecaptureq-`, and Web files begin with `ecaptureq-web-`. `amd64` means x86_64 / x64, and `arm64` means aarch64. macOS packages are universal and contain both Intel and Apple Silicon slices. Verify the downloaded files against `SHA256SUMS` from the same release.

On Linux, amd64 and arm64 have Desktop and Web DEB/RPM packages. LoongArch64 (`loong64`) has Web DEB/RPM packages starting with v1.1.0.

These are eCaptureQ client/service platforms. **eCapture itself runs on supported Linux or Android systems**, subject to kernel, CPU, privileges and module requirements. There is no Android or iOS eCaptureQ client support commitment.

## Install Desktop {#desktop}

- **macOS:** open the universal DMG, drag `eCaptureQ.app` to Applications, then launch it. ZIP is an alternative. The build deployment target is macOS 12; that is not a claim that every older machine has been tested.
- **Windows:** extract the ZIP for your CPU and run `eCaptureQ.exe`. Install the official [Microsoft WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) if it is missing.
- **Linux:** install DEB for Ubuntu/Debian or RPM for Fedora. The desktop needs GTK4 and WebKitGTK 6.0; the package manager resolves these dependencies. The release targets Ubuntu 24.04 / Fedora 43 or newer compatible libraries, not old RHEL/CentOS installations.

```sh
# Ubuntu / Debian, amd64 example
sudo apt install ./ecaptureq-1.2.0-linux-amd64.deb

# Fedora, amd64 example
sudo dnf install ./ecaptureq-1.2.0-linux-amd64.rpm
```

Use the `arm64` filename on an ARM64 host. Open **eCaptureQ** from the application menu, or run `ecaptureq` in a graphical session. The application opens in **Mock** mode. No collector or separate Web service is needed for the demo.

### macOS first launch {#macos}

Verify the download against `SHA256SUMS` and inspect `eCaptureQ.app/Contents/Resources/Distribution/BUILD-INFO.json`. The default macOS build uses **ad-hoc signing and is not notarized**; it does not carry an Apple-verified developer identity. If macOS blocks the first launch, use the application-specific **System Settings → Privacy & Security → Open Anyway** flow after checking the source. See [Apple's instructions](https://support.apple.com/en-us/102445). Managed Macs may restrict this flow.

## Run Web {#web}

Choose the `ecaptureq-web-` package. It needs no GTK/WebKit or graphical desktop. Install a Linux DEB/RPM with `apt install ./filename.deb` or `dnf install ./filename.rpm`, or extract the macOS/Windows ZIP. Linux installation does not auto-start a service or overwrite user configuration.

```sh
# Linux, after installing the Web package
ecaptureq-web --listen 127.0.0.1:28257

# macOS, in the extracted ZIP directory
./ecaptureq-web --listen 127.0.0.1:28257
```

```powershell
# Windows PowerShell, in the extracted ZIP directory
.\ecaptureq-web.exe --listen 127.0.0.1:28257
```

Open [http://127.0.0.1:28257/](http://127.0.0.1:28257/) in a browser on the same machine. The process must stay running; opening the page does not launch it automatically.

The local commands above do not load `auth` and do not require login. Follow [Web Authentication](/q/en/authentication/) to generate a hash, configure `--sources` and sign in. The newer example configuration contains public initial credentials that should be replaced; local HTTP and deployed HTTPS also require different `secureCookie` settings.

For a remote service, use the [remote Web access guide](/q/en/data-sources/#web-access). The Web service connects to collectors from **its own host**, not from the browser's host.

## Other additions {#updates}

v1.2.0 adds native KEYLOG and PCAPNG export, automatic collector metadata, and source editing, reconnection and removal. See [native files](/q/en/interface/#native) and [source management](/q/en/data-sources/#add). The following changes shipped in v1.1.0.

- **Extended configuration**: a top-level object replaces the source array and can contain `sources`, `auth`, `headerCenter` and `hiddenDomains`. Migrate older files using the [configuration guide](/q/en/data-sources/#configuration).
- **Refresh on changes**: Web and Desktop wait for changes through long polling and reload the current page when records change, reducing idle requests. See [refresh behavior](/q/en/interface/#display).
- **Startup update notification**: the analysis interface checks official GitHub Releases and shows a link when it finds a newer version. It does not install updates; request failures do not interrupt the analysis UI.
- **Larger payload retention**: the source-level per-payload truncation cap rises from 256 KiB to 256 MiB. This does not mean a default instance accepts 256 MiB messages: WebSocket frames, retention and body decompression have separate limits. See [capacity limits](/q/en/faq/#retention).

Sources: [CLI parser](https://github.com/gojue/ecaptureQ/blob/v1.2.0/internal/cli/options.go), [release builds](https://github.com/gojue/ecaptureQ/blob/v1.2.0/.github/workflows/build.yml), [update check](https://github.com/gojue/ecaptureQ/blob/v1.2.0/frontend/update-check.js), and [payload mapping](https://github.com/gojue/ecaptureQ/blob/v1.2.0/internal/app/mapper.go).

## Upgrade and next steps {#next}

Keep any old configuration and data. The rewritten application does not automatically import the former Tauri application's settings or sessions. SQL filtering and an integrated probe launcher are outside this version's scope.

Continue with [Quick Start](/q/en/quick-start/) to connect a collector, or use the [Interface Guide](/q/en/interface/#practice) for an exercise with bundled demo data.
