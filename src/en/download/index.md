---
footer: false
title: eCapture Download
description: Download published eCapture releases from GitHub.
---

<script setup>
import ReleaseDownloads from '../../../.vitepress/theme/components/ReleaseDownloads.vue'
import DownloadIntro from '@theme/components/DownloadIntro.vue'
</script>

# eCapture Download

<DownloadIntro product="ecapture" locale="en">

**eCapture is a command-line capture tool.** Run it on a supported Linux or Android machine to capture TLS plaintext with eBPF. View captured results and operational logs directly in your terminal, or write output to files for later analysis.

Choose a build for your system and architecture, then follow [Getting Started](/en/1-getting-started/). For a graphical Desktop or Web interface to search and inspect messages, use [eCaptureQ Download](/q/en/download/).

</DownloadIntro>

This page reads **up to the 5 most recent stable releases** from the release API. Find older and prerelease builds on [GitHub Releases](https://github.com/gojue/ecapture/releases). Downloads use official GitHub release assets; verify each package against the checksum file from the same release.

## Docker image {#docker}

The official v2.12.0 Docker image is built for **linux/amd64** and **linux/arm64**. On **linux/loong64**, choose the release tarball or Debian package below. [Docker Hub — gojue/ecapture](https://hub.docker.com/r/gojue/ecapture) · [Image build platforms](https://github.com/gojue/ecapture/blob/v2.12.0/.github/workflows/release.yml#L194)

The container uses the host kernel and needs permission to load probes and observe the selected interface. [Docker setup instructions](https://github.com/gojue/ecapture/blob/v2.12.0/README.md#docker-image)

<ReleaseDownloads />
