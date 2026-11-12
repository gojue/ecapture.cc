---
title: FAQ
description: Troubleshoot source connections, empty lists, missing fields, retention and exports.
lang: en-US
---

# FAQ

Start with the source status and the active filter chips. A connected event channel and a non-empty message list are separate checks.

## Login fails or returns to the login page {#login}

Confirm that the build includes authentication and loads valid `auth` settings through `--sources`; released v1.0.0 has no built-in login. Use the plaintext password, not its hash. If login immediately returns to the login page, check cookies, base-path and `secureCookie`: explicitly use `false` for local HTTP testing and keep `true` for HTTPS deployment. `401` can mean invalid credentials or an expired session; `429` means wait before retrying. See [Web Authentication](/q/en/authentication/#troubleshooting) for configuration, password changes and status-code troubleshooting.

## The source will not connect {#connection}

Confirm that eCapture was started with **`--ecaptureq`**, and that its listener is still running. Use the event endpoint, not the HTTP page address or `--eventaddr`. Read the source's error/retry log and check the host, port, routing and firewall rules. If you chose an SSH tunnel, also check that it is still connected.

For Web, test reachability from the **Web service host**. `127.0.0.1` in the source form means that host, not your browser computer. Use a reachable destination address rather than `0.0.0.0`. A `wss` URL needs an actual TLS endpoint. Follow [Data Sources](/q/en/data-sources/#addresses).

## It is connected, but there are no records {#no-records}

1. Switch from Mock to **Live** and resume refresh if paused.
2. Choose **Clear all** above the list.
3. Generate new target-program traffic after the probe has attached.
4. Confirm the correct module, library/executable and network interface, and use the complete-message mode where required.
5. Check source logs and eCapture's own logs.

A connected WebSocket means the channel works, not that a target was captured. Messages missed before attachment or during disconnection are not replayed. A protocol viewer does not enable unsupported upstream capture automatically.

## Filtering leaves an empty list {#filters}

Process, protocol, host, category, stars and search combine. Remove one chip at a time, clear the process next to its heading, or **Clear all** including the search term. A protocol button can disappear because the remaining scope has no records of that family. Clearing filters preserves captured data.

If the selected record was evicted, refresh the list; removing a filter cannot restore it. Try the deterministic [Mock exercise](/q/en/interface/#practice) to check the workflow.

The new source also excludes live records matching `hiddenDomains` before storage; defaults include GitHub-related domains. **Clear all** cannot reveal those discarded records. See [hidden-domain configuration](/q/en/data-sources/#configuration).

## What does “Unpaired” mean? {#unpaired}

The current record has no associated counterpart/final response. A request or response may not have been captured, the connection may have closed, identity may be incomplete, or the counterpart may already be outside retention. It **does not tell you that the server is still working, timed out or failed**, and it is not specific to POST.

Messages are scoped to their source, reconnect generation and connection identity; HTTP/2 and HTTP/3 also need Stream ID. A late response cannot resurrect an evicted request. Do not infer a pair merely because two rows are adjacent.

## Process, duration or TLS information is missing {#metadata}

Missing values stay unknown. Older collectors or modes may omit PID/command, timestamps may lack enough precision for duration, and the TLS handshake may not have been captured. PID 0 or `decryptor` is not the actual application identity. eCaptureQ does not fill gaps from the Web host's processes or from HTTP Host.

The published eCapture **v2.10.0** lacks the newer official process-argument and TLS fields; use a collector containing the compatible metadata changes if those fields are needed. See [protocol compatibility](/q/en/protocols/#tls). TLS version, cipher suite, SNI, ALPN and JA3/JA4 describe handshake metadata; this is not a promise of session-key display.

## HTTP body decompression or an image fails {#body}

Check `Content-Encoding` and whether the record is truncated. **Original compressed** keeps the captured bytes; **Decoded** (decompressed) is a view of those bytes. Corrupt input, an unsupported algorithm, the 2 MiB per-layer output limit or the 5-second processing deadline can prevent decompression. The UI shows a reason and preserves the original representation; use Hex if needed.

Images use captured bytes and are never reloaded from the original URL. An incomplete image therefore stays incomplete. HTTP decompression is separate from TLS decryption, which eCapture performs upstream. See [body representations](/q/en/interface/#http).

## Does Pause stop capture? {#pause}

No. **Pause refresh** stops UI record updates only. Configured sources continue receiving in the background and records can still be evicted. Resume to fetch current results. Mock/Live chooses the displayed dataset; sources can also remain connected while Mock is visible.

To stop the collector itself, manage that collector independently. Registering a launch command in eCaptureQ never executes or stops it.

## How long are records retained? {#retention}

The defaults are **65,536 records** and **192 MiB of counted record JSON**. The oldest records are evicted when either limit is reached. The byte count is not the application's total process memory (RSS). The command-line options `--max-records` and `--max-memory-mib` adjust these bounds.

Live pages contain at most 200 summaries; details load on demand. A record may disappear before its detail or export request. `evicted` counts records removed by retention; `dropped` counts invalid/oversized records rejected by the UI service. Neither is a kernel or collector packet-loss counter. A star does not protect a record.

The new source raises the per-payload truncation cap to **256 MiB**, from 256 KiB in v1.0.0. Incoming WebSocket messages still have a separate cap: **8 MiB** by default, adjustable to 1–64 MiB with `--max-frame-mib`. Records also remain subject to the retention budget above. Body decompression still has a **2 MiB** per-layer limit. Raising the payload cap does not bypass these limits; see [version scope](/q/en/install/#version).

## What survives a restart? {#restart}

Live records and operational logs are in memory and disappear when the app/service exits. Sources added without `--sources` also disappear. A writable source manifest preserves connection settings, not captured content; see [saving sources](/q/en/data-sources/#save).

Browser refresh does not restart the Web service, so its live cache remains while that service runs. Page-local stars are cleared. Separately launched Desktop/Web instances have independent sessions and caches; they do not restore or merge each other's data. Export important records before leaving.

## Where are stars and exports? {#export}

Use the star in a record's detail heading, then **Starred** on the left. Stars are limited to the current page session and reset on page reload or data-mode switch. They neither persist a record nor block eviction.

**Export page JSON** in Live mode saves the filtered records on that page, not all result pages. **Export JSON** in Mock saves its filtered list. If export reports that a record is gone, refresh and retry. Desktop uses a save dialog (64 MiB export / 4 MiB clipboard limits); Web uses browser download/clipboard capabilities. If browser copying is unavailable, use export. Inspect real data for sensitive content before sharing.

## Why does my download look different from the screenshots? {#version}

The screenshots show **v1.0.0** with synthetic data. Older alpha.2 downloads have the earlier layout and `ecaptureq-server` executable. The documented bilingual controls, pane layout and `ecaptureq-web` program are based on v1.0.0. For other releases, check their release notes. Window width, selected filters and light/dark theme also affect what is visible. See [installation and version scope](/q/en/install/#version).

A source version string or tag is not proof of a published binary. The [official release page](https://github.com/gojue/ecaptureQ/releases) is the download source of truth. The older Tauri implementation's SQL filters, integrated launcher and configuration format are not compatibility requirements for this rewrite.
