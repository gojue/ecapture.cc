---
title: Download
description: Read the latest and historical official eCaptureQ releases from the API and download Desktop or Web.
lang: en-US
---

<script setup>
import { nextTick, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import ReleaseDownloads from '../../../../.vitepress/theme/components/ReleaseDownloads.vue'
const router = useRouter()
onMounted(async () => {
  await nextTick()
  const hash = window.location.hash
  if (['#version', '#desktop', '#macos', '#web', '#next'].includes(hash)) {
    router.go('/q/en/install/' + hash)
  }
})
</script>

# eCaptureQ Download

Choose **Desktop** to open an app, or **Web** to run the service on a host and access it from a browser. See [Installation](/q/en/install/) for dependencies and startup instructions. For capture probes, use [eCapture Download](/en/download/).

This page reads **up to the 5 most recent stable releases** from the release API; it shows fewer when fewer are available. Find older and prerelease builds on [GitHub Releases](https://github.com/gojue/ecaptureQ/releases). The documentation and screenshot baseline is explained in [version scope](/q/en/install/#version).

Downloads use official GitHub release assets. Verify each package against the checksum file from the same release.

<span id="packages"></span>

<ReleaseDownloads product="ecaptureQ" />
