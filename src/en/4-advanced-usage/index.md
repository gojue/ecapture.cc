# Advanced Usage

The three core TLS modules share a packet-based text source and a common output interface in v2.12.0. When diagnosing a capture, first identify which interface, library or Go binary, and output destination the collector selected.

| Task | Where to start |
| --- | --- |
| The probe starts but a request is missing | Check the selected interface, the start of the TLS connection, protocol decoding and destination in [TLS troubleshooting](4.1-tls-troubleshooting.md). |
| Send decoded events to another application or change a running probe's filters | Choose an outgoing TCP connection or a WebSocket subscription, and use the separate HTTP configuration API in [Integration and deployment](4.2-integration-and-deployment.md). |
| Observe NSS applications, shell commands or database queries | Check the supported platforms and target binaries in [Other modules](4.3-other-modules.md). |
