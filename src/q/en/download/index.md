---
title: Download
description: Read the latest and historical official eCaptureQ releases from the API and download Desktop or Web.
lang: en-US
---

<script setup>
import { nextTick, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import ReleaseDownloads from '../../../../.vitepress/theme/components/ReleaseDownloads.vue'
import DownloadIntro from '@theme/components/DownloadIntro.vue'
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

<DownloadIntro product="ecaptureQ" locale="en">

**eCaptureQ is a graphical analysis application.** Connect eCapture data sources to filter, search and correlate messages, then inspect requests, responses and details in a three-pane interface.

Choose **Desktop** to open an app, or **Web** to use a browser. Both can export native KEYLOG and PCAPNG streams received from the collector. Install eCapture separately on the capture host. [Install eCaptureQ](/q/en/install/) · [Download eCapture](/en/download/)

</DownloadIntro>

This page reads **up to the 5 most recent stable releases** from the release API; it shows fewer when fewer are available. Find older and prerelease builds on [GitHub Releases](https://github.com/gojue/ecaptureQ/releases). The documentation and screenshot baseline is explained in [version scope](/q/en/install/#version).

Downloads use official GitHub release assets. Verify each package against the checksum file from the same release.

<span id="packages"></span>

<ReleaseDownloads product="ecaptureQ" />
