---
title: eCaptureQ — Overview
description: Connect eCapture sources and inspect application messages in a searchable three-pane workspace for desktop or Web.
lang: en-US
head:
  - - link
    - rel: canonical
      href: https://ecapture.cc/q/en/
---

<script setup>
import QRelationship from '@theme/components/QRelationship.vue'
import ReleaseBadge from '@theme/components/ReleaseBadge.vue'
</script>

# eCaptureQ

Turn the network messages captured by eCapture into a **searchable, correlated view you can inspect**. Connect one or more sources, filter by process or protocol, and explore messages in a three-pane workspace.

<div class="q-page-actions">
  <a class="ec-button primary" href="/q/en/quick-start/">Quick start →</a>
  <a class="ec-button" href="/q/en/download/">Download <ReleaseBadge /></a>
</div>

[English](/q/en/) · [简体中文](/q/zh/)

## Capture with eCapture, explore with Q {#relationship}

**eCapture** runs on the capture machine and handles collection and TLS decryption. **eCaptureQ** connects to its `--ecaptureq` WebSocket interface, correlates application messages and displays them. The two products run independently.

<QRelationship locale="en" />

Use the left pane to narrow your search, the middle pane to select a record, and the right pane to inspect its details. Requests, responses, process and TLS information appear when supplied by the source.

## Choose Desktop or Web {#editions}

Both editions share the same analysis interface, support multiple sources, and run on Windows, Linux and macOS. Choose where you want to run Q; eCapture still needs a supported Linux or Android capture environment.

| | eCaptureQ Desktop | eCaptureQ Web |
| --- | --- | --- |
| How you use it | Open an installed app on your workstation | Start the service, then open its page in a browser |
| Who connects to eCapture | The desktop application's machine | The Web service's machine |
| Get it | [Install Desktop](/q/en/install/#desktop) | [Run Web](/q/en/install/#web) |

**First time?** Try [Mock mode](/q/en/quick-start/#demo) without a collector, or follow [Quick Start](/q/en/quick-start/) to connect your first live source. That guide walks through the commands, addresses and success checks.

## Keep going {#next}

- [Data Sources](/q/en/data-sources/) — connect collectors on the same machine, a LAN or a public endpoint.
- [Interface Guide](/q/en/interface/) — learn the three panes and try a filtering exercise.
- [Protocols & Details](/q/en/protocols/) — see what each protocol can show.
- [FAQ](/q/en/faq/) — troubleshoot connections, missing records and unpaired messages.

[Official releases](https://github.com/gojue/ecaptureQ/releases) · [Source code](https://github.com/gojue/ecaptureQ)
