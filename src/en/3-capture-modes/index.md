# Capture Modes

For `tls`, `gotls` and `gnutls`, `--model` (`-m`) chooses what the collector produces. Start with the question you want the capture to answer. You can inspect the same HTTPS request live, record only its TLS secrets, or save its packet history for Wireshark.

| Question | Mode | What you can verify |
| --- | --- | --- |
| What request did the application send? | [Text](3.2-text-mode.md) | Find the decoded path, headers or body in a `TEXT` event. |
| Can I decrypt a trace recorded elsewhere? | [Keylog](3.3-keylog-mode.md) | Load the NSS key log and the matching packets into Wireshark. |
| Which packets carried the request? | [pcapng](3.4-pcapng-mode.md) | Follow the decrypted stream in a single file containing packets and secrets. |

## Save and deliver results

`--output` controls terminal, file and TCP destinations for runtime logs and capture events. In native keylog and pcapng modes, use `--keylogfile` or `--pcapfile` to name the required local file. The local `--output` file then contains runtime logs only. In packet-based text mode you may also request either native file while continuing to receive decoded `TEXT` events. [Output contract](https://github.com/gojue/ecapture/blob/v2.12.0/docs/event-forward-api.md)

- [Choosing text, keylog or pcapng](3.1-choosing-text-keylog-or-pcapng.md) compares prerequisites and filenames.
- [Output destinations and subscriptions](3.5-event-destinations-and-rotation.md) covers Protobuf v2, remote receivers and migration from the v2.8 flags.
- [Wireshark decryption workflows](3.6-wireshark-decryption-workflows.md) shows how to check that the recorded packets and secrets belong to the same test connection.
