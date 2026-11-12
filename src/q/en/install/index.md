---
title: Installation
description: Install eCaptureQ Desktop or start the Web service, with dependencies and first-run steps.
lang: en-US
---

# Installation

Choose a package for your operating system and CPU on the [Download page](/q/en/download/). Choose **Desktop** to open a native application, or **Web** to run a service and open its interface in a browser. Both connect to eCapture; neither package contains a capture probe.

## Documentation version and scope {#version}

Package examples and existing synthetic-data screenshots use **eCaptureQ v1.0.0** as their baseline. Web startup commands below use the new authentication implementation's CLI names; see [CLI migration](#cli) for older packages. The Download page reads published releases from the API and may include newer versions. **`1.0.0` in the commands below is an example: substitute the version and filename you actually downloaded.** Read that release's notes before installing another version.

The baseline release was published on 8 November 2026 with 15 application packages and one `SHA256SUMS`; verify them on the [official v1.0.0 release page](https://github.com/gojue/ecaptureQ/releases/tag/v1.0.0). Some process/TLS fields require newer **collector** capabilities; see [protocol compatibility](/q/en/protocols/#tls).

As of **13 November 2026**, the latest official stable release is still v1.0.0. Login, configuration and refresh changes were verified against main commit [`1bb574d`](https://github.com/gojue/ecaptureQ/commit/1bb574da5e1fb98650a3ae604956d9f3ac2329cc); **these features are not included in the v1.0.0 release packages**. Build that source or use a subsequent release containing the changes. The source still says `1.0.0` in `VERSION`, so check the source commit in `BUILD-INFO.json` and the binary's `--help`. See the [matching compilation guide](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/docs/compilation.md).

Older alpha.2 downloads use `desktop` / `server` filenames and the executable `ecaptureq-server`; the v1.0.0 commands below do not apply to those packages. For source builds, use the [official compilation guide](https://github.com/gojue/ecaptureQ/blob/v1.0.0/docs/compilation.md).

## CLI migration {#cli}

| Purpose | Released v1.0.0 | New source |
| --- | --- | --- |
| eCaptureQ Web HTTP listener | `--addr` | `--listen` |
| eCaptureQ collector endpoint; repeatable | `--ecaptureq` | `--data-source` |
| Generate a Web password hash | Unavailable | `--hash-password` |

The new source rejects the old option names. Update service scripts accordingly. **The collector's own `ecapture --ecaptureq` option is unchanged** and still opens the event listener. Configuration files continue to use `--sources`.

```sh
# New source: separate Web listener and collector endpoint
ecaptureq-web --listen 127.0.0.1:28257 \
  --data-source ws://127.0.0.1:28256/ --mode live

# Equivalent command for released v1.0.0 (no built-in login)
ecaptureq-web --addr 127.0.0.1:28257 \
  --ecaptureq ws://127.0.0.1:28256/ --mode live
```

## Choose a package {#packages}

Desktop files begin with `ecaptureq-`, and Web files begin with `ecaptureq-web-`. `amd64` means x86_64 / x64, and `arm64` means aarch64. macOS packages are universal and contain both Intel and Apple Silicon slices. Verify the downloaded files against `SHA256SUMS` from the same release.

The new source adds **Linux loong64 Web DEB/RPM builds** for LoongArch64. It does not add loong64 Desktop or macOS/Windows loong64 packages. Check the release page for actual downloadable assets; the original 15 v1.0.0 application packages do not include this addition.

These are eCaptureQ client/service platforms. **eCapture itself runs on supported Linux or Android systems**, subject to kernel, CPU, privileges and module requirements. There is no Android or iOS eCaptureQ client support commitment.

## Install Desktop {#desktop}

- **macOS:** open the universal DMG, drag `eCaptureQ.app` to Applications, then launch it. ZIP is an alternative. The build deployment target is macOS 12; that is not a claim that every older machine has been tested.
- **Windows:** extract the ZIP for your CPU and run `eCaptureQ.exe`. Install the official [Microsoft WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) if it is missing.
- **Linux:** install DEB for Ubuntu/Debian or RPM for Fedora. The desktop needs GTK4 and WebKitGTK 6.0; the package manager resolves these dependencies. The release targets Ubuntu 24.04 / Fedora 43 or newer compatible libraries, not old RHEL/CentOS installations.

```sh
# Ubuntu / Debian, amd64 example
sudo apt install ./ecaptureq-1.0.0-linux-amd64.deb

# Fedora, amd64 example
sudo dnf install ./ecaptureq-1.0.0-linux-amd64.rpm
```

Use the `arm64` filename on an ARM64 host. Open **eCaptureQ** from the application menu, or run `ecaptureq` in a graphical session. The application opens in **Mock** mode. No collector or separate Web service is needed for the demo.

### macOS first launch {#macos}

Verify the download against `SHA256SUMS` and inspect `BUILD-INFO.json` in the package. The default macOS build uses **ad-hoc signing and is not notarized**; it does not carry an Apple-verified developer identity. If macOS blocks the first launch, use the application-specific **System Settings → Privacy & Security → Open Anyway** flow after checking the source. See [Apple's instructions](https://support.apple.com/en-us/102445). Managed Macs may restrict this flow.

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

These also refer to the new source above; the existing v1.0.0 screenshots do not show every change:

- **Extended configuration**: a top-level object replaces the source array and can contain `sources`, `auth`, `headerCenter` and `hiddenDomains`. Migrate older files using the [configuration guide](/q/en/data-sources/#configuration).
- **Refresh on changes**: Web and Desktop wait for changes through long polling and reload the current page when records change, reducing idle requests. See [refresh behavior](/q/en/interface/#display).
- **Startup update notification**: the analysis interface checks official GitHub Releases and shows a link when it finds a newer version. It does not install updates; request failures do not interrupt the analysis UI.
- **Larger payload retention**: the source-level per-payload truncation cap rises from 256 KiB to 256 MiB. This does not mean a default instance accepts 256 MiB messages: WebSocket frames, retention and body decompression have separate limits. See [capacity limits](/q/en/faq/#retention).

Sources: [CLI parser](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/internal/cli/options.go), [release builds](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/.github/workflows/build.yml), [update check](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/frontend/update-check.js), and [payload mapping](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/internal/app/mapper.go).

## Upgrade and next steps {#next}

Keep any old configuration and data. The rewritten application does not automatically import the former Tauri application's settings or sessions. SQL filtering and an integrated probe launcher are outside this version's scope.

Continue with [Quick Start](/q/en/quick-start/) to connect a collector, or use the [Interface Guide](/q/en/interface/#practice) for an exercise with bundled demo data.
