---
title: Installation
description: Install eCaptureQ Desktop or start the Web service, with dependencies and first-run steps.
lang: en-US
---

# Installation

Choose a package for your operating system and CPU on the [Download page](/q/en/download/). Choose **Desktop** to open a native application, or **Web** to run a service and open its interface in a browser. Both connect to eCapture; neither package contains a capture probe.

## Documentation version and scope {#version}

This guide and its synthetic-data screenshots use **eCaptureQ v1.0.0** as their baseline. The Download page reads published releases from the API and may include newer versions. **`1.0.0` in the commands below is an example: substitute the version and filename you actually downloaded.** Read that release's notes before installing another version.

The baseline release was published on 8 November 2026 with 15 application packages and one `SHA256SUMS`; verify them on the [official v1.0.0 release page](https://github.com/gojue/ecaptureQ/releases/tag/v1.0.0). Some process/TLS fields require newer **collector** capabilities; see [protocol compatibility](/q/en/protocols/#tls).

Older alpha.2 downloads use `desktop` / `server` filenames and the executable `ecaptureq-server`; the v1.0.0 commands below do not apply to those packages. For source builds, use the [official compilation guide](https://github.com/gojue/ecaptureQ/blob/v1.0.0/docs/compilation.md).

## Choose a package {#packages}

Desktop files begin with `ecaptureq-`, and Web files begin with `ecaptureq-web-`. `amd64` means x86_64 / x64, and `arm64` means aarch64. macOS packages are universal and contain both Intel and Apple Silicon slices. Verify the downloaded files against `SHA256SUMS` from the same release.

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
ecaptureq-web --addr 127.0.0.1:28257

# macOS, in the extracted ZIP directory
./ecaptureq-web --addr 127.0.0.1:28257
```

```powershell
# Windows PowerShell, in the extracted ZIP directory
.\ecaptureq-web.exe --addr 127.0.0.1:28257
```

Open [http://127.0.0.1:28257/](http://127.0.0.1:28257/) in a browser on the same machine. The process must stay running; opening the page does not launch it automatically.

For a remote service, use the [remote Web access guide](/q/en/data-sources/#web-access). The Web service connects to collectors from **its own host**, not from the browser's host.

## Upgrade and next steps {#next}

Keep any old configuration and data. The rewritten application does not automatically import the former Tauri application's settings or sessions. SQL filtering and an integrated probe launcher are outside this version's scope.

Continue with [Quick Start](/q/en/quick-start/) to connect a collector, or use the [Interface Guide](/q/en/interface/#practice) for an exercise with bundled demo data.
