---
title: FAQ
description: Troubleshoot source connections, empty lists, missing fields, retention and exports.
lang: en-US
---

# FAQ

Start with the source status and the active filter chips. A connected event channel and a non-empty message list are separate checks.

## Login fails or returns to the login page {#login}

Use eCaptureQ Web v1.1.0 or later with valid `auth` settings loaded through `--sources`. Use the plaintext password, not its hash. If login immediately returns to the login page, check cookies, base-path and `secureCookie`: explicitly use `false` for local HTTP testing and keep `true` for HTTPS deployment. `401` can mean invalid credentials or an expired session; `429` means wait before retrying. See [Web Authentication](/q/en/authentication/#troubleshooting) for configuration, password changes and status-code troubleshooting.

## The source will not connect {#connection}

Check that eCapture v2.12.0 is running with **`--stream-listen`** and that Q uses the same URL path. Q v1.2.0 requires the `ecapture.v2` handshake. If a proxy sits between them, verify it forwards WebSocket upgrades and the subprotocol. The source card shows connection and retry errors.

For Web, test reachability from the **Web service host**. `127.0.0.1` in the source form means that host, not your browser computer. Use a reachable destination address rather than `0.0.0.0`. A `wss` URL needs an actual TLS endpoint. Follow [Data Sources](/q/en/data-sources/#addresses).

## It is connected, but there are no records {#no-records}

1. Switch from Mock to **Live** and resume refresh if paused.
2. Choose **Clear all** above the list.
3. Generate new target-program traffic after the probe has attached.
4. Confirm the correct module, library/executable and network interface, and use the complete-message mode where required.
5. Check the collector mode in the source card. In keylog or pcapng mode, received files appear under [Native files](/q/en/interface/#native). For a text source, inspect its logs and the collector logs.

A connected WebSocket means the channel works, not that a target was captured. Messages missed before attachment or during disconnection are not replayed. A protocol viewer does not enable unsupported upstream capture automatically.

## Filtering leaves an empty list {#filters}

Process, protocol, host, category, stars and search combine. Remove one chip at a time, clear the process next to its heading, or **Clear all** including the search term. A protocol button can disappear because the remaining scope has no records of that family. Clearing filters preserves captured data.

If the selected record was evicted, refresh the list; removing a filter cannot restore it. Try the deterministic [Mock exercise](/q/en/interface/#practice) to check the workflow.

Q excludes live records with a host matching `hiddenDomains` before storage; defaults include GitHub-related domains. **Clear all** cannot reveal those discarded records. See [hidden-domain configuration](/q/en/data-sources/#configuration).

## What does “Unpaired” mean? {#unpaired}

The **Unpaired** filter selects records marked `pending`. For an HTTP request or Redis command, Q is still missing a matching reply. It may have missed the reply during capture or lacked the identifiers to pair it. A standalone HTTP response with a status code can appear outside this filter. To determine how the server handled the request, check the captured reply or server logs.

Messages are scoped to their source, reconnect generation and connection identity; HTTP/2 and HTTP/3 also need Stream ID. A late response cannot resurrect an evicted request. Do not infer a pair merely because two rows are adjacent.

## Process, duration or TLS information is missing {#metadata}

Missing values stay unknown. Older collectors or modes may omit PID/command, timestamps may lack enough precision for duration, and the TLS handshake may not have been captured. PID 0 together with the placeholder name `decryptor` identifies an unattributed event. eCaptureQ does not fill gaps from the Web host's processes or from HTTP Host.

With eCapture v2.12.0, TEXT events can carry captured process arguments and observed TLS handshake fields. Their presence depends on the capture path and the traffic. [Protocol compatibility](/q/en/protocols/#tls)

## HTTP body decompression or an image fails {#body}

Check `Content-Encoding` and whether the record is truncated. **Original compressed** keeps the captured bytes; **Decoded** (decompressed) is a view of those bytes. Corrupt input, an unsupported algorithm, the 2 MiB per-layer output limit or the 5-second processing deadline can prevent decompression. The UI shows a reason and preserves the original representation; use Hex if needed.

Images use captured bytes and are never reloaded from the original URL. An incomplete image therefore stays incomplete. HTTP decompression is separate from TLS decryption, which eCapture performs upstream. See [body representations](/q/en/interface/#http).

## Does Pause stop capture? {#pause}

No. **Pause refresh** stops UI record updates only. Configured sources continue receiving in the background and records can still be evicted. Resume to fetch current results. Mock/Live chooses the displayed dataset; sources can also remain connected while Mock is visible.

Stop or restart the collector on its own host. The arguments shown in Q are a snapshot reported by that collector.

## How long are records retained? {#retention}

The defaults are **65,536 records** and **192 MiB of counted record JSON**. The oldest records are evicted when either limit is reached. The byte count is not the application's total process memory (RSS). The command-line options `--max-records` and `--max-memory-mib` adjust these bounds.

A Live page contains up to 200 summaries. Details load on demand, so a record may disappear before you open or export it. `evicted` counts records removed to make room. `dropped` counts records that cannot be stored, including a record whose JSON alone exceeds the memory budget. A malformed Protobuf message or oversized WebSocket message increments the source’s `malformed` counter and ends that connection. These counters describe Q’s receiver and cache. [Receiver and store implementation](https://github.com/gojue/ecaptureQ/blob/v1.2.0/internal/app/live.go)

v1.1.0 raised the per-payload truncation cap to **256 MiB**, from 256 KiB in v1.0.0. Incoming WebSocket messages still have a separate cap: **8 MiB** by default, adjustable to 1–64 MiB with `--max-frame-mib`. Records also remain subject to the retention budget above. Body decompression still has a **2 MiB** per-layer limit. Raising the payload cap does not bypass these limits; see [version scope](/q/en/install/#version).

## What survives a restart? {#restart}

Live records and operational logs are in memory and disappear when the app/service exits. Sources added without `--sources` also disappear. A writable source manifest preserves connection settings, not captured content; see [saving sources](/q/en/data-sources/#save).

Browser refresh does not restart the Web service, so its live cache remains while that service runs. Page-local stars are cleared. Separately launched Desktop/Web instances have independent sessions and caches; they do not restore or merge each other's data. Export important records before leaving. Native file sessions also use temporary storage that is cleaned up at normal shutdown. Save a copy first. [Native files](/q/en/interface/#native)

## Where are stars and exports? {#export}

Use the star in a record's detail heading, then **Starred** on the left. Stars are limited to the current page session and reset on page reload or data-mode switch. They neither persist a record nor block eviction.

**Export page JSON** in Live mode saves the filtered records on that page, not all result pages. **Export JSON** in Mock saves its filtered list. If export reports that a record is gone, refresh and retry. Desktop uses a save dialog (64 MiB JSON export / 4 MiB clipboard limits); Web uses browser download/clipboard capabilities. If browser copying is unavailable, use export. Inspect real data for sensitive content before sharing.

## Why does my download look different from the screenshots? {#version}

The screenshots show v1.0.0 with synthetic data. In v1.2.0 the source form is simpler, capture settings come from the collector, and received native files appear in the source panel. [Installation and version scope](/q/en/install/#version)

A source version string or tag is not proof of a published binary. The [official release page](https://github.com/gojue/ecaptureQ/releases) is the download source of truth. The older Tauri implementation's SQL filters, integrated launcher and configuration format are not compatibility requirements for this rewrite.
