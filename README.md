# eCapture Documentation

<div align="center">

[English](README.md) | [简体中文](README_CN.md)

[![Website](https://img.shields.io/badge/website-ecapture.cc-blue)](https://ecapture.cc)
[![GitHub](https://img.shields.io/badge/GitHub-gojue/ecapture-black)](https://github.com/gojue/ecapture)
[![License](https://img.shields.io/badge/license-Apache%202.0-green)](LICENSE)

**Comprehensive documentation for eCapture - eBPF-based SSL/TLS capture and system auditing tool**

[View Documentation](https://ecapture.cc) | [Report Issue](https://github.com/gojue/ecapture/issues)

</div>

---

## 📖 About This Project

This repository hosts the **official documentation website** for [eCapture (旁观者)](https://github.com/gojue/ecapture), a powerful eBPF-based network traffic capture and system auditing tool. The documentation provides comprehensive guides on installation, architecture, module development, and usage patterns.

**eCapture** enables capture of SSL/TLS encrypted communications in plaintext **without requiring CA certificates** or application modifications. It also provides system auditing capabilities for shell commands, database queries, and network packets.

### Key Features of eCapture

- ✨ **SSL/TLS Plaintext Capture** - Intercept encrypted data from OpenSSL, BoringSSL, GnuTLS, NSS/NSPR, and Go crypto/tls
- 🔒 **No CA Certificates Required** - Transparent capture without certificate installation
- 🐚 **System Auditing** - Monitor Bash/Zsh commands and MySQL/PostgreSQL SQL queries
- 📦 **Multiple Output Formats** - Text, PCAP-NG, Keylog (SSLKEYLOGFILE), and Protobuf streams
- 🚀 **eBPF Technology** - Kernel-level hooking with minimal performance overhead
- 🔧 **CO-RE Support** - Compile Once, Run Everywhere on compatible kernels

### Platform Support

| Architecture          | Minimum Kernel | Status |
|-----------------------|----------------|--------|
| x86_64 (amd64)        | Linux 4.18+ | ✅ Fully Supported |
| aarch64 (arm64)       | Linux 5.5+ | ✅ Fully Supported |
| Android (amd64/arm64) | Android 12+ | ✅ Supported (BoringSSL) |
| Windows / macOS       | N/A | ❌ Not Supported |

---

## 📚 Documentation Structure

The documentation is organized into the following sections:

### 1. Introducing eCapture
- [Introduction](src/en/1-introducing-ecapture/index.md) - System purpose and capabilities
- [Introduction and Core Capabilities](src/en/1-introducing-ecapture/1.1-introduction-and-core-capabilities.md) - Core features
- [Supported Platforms and Versions](src/en/1-introducing-ecapture/1.2-supported-platforms-and-versions.md) - Platform support

### 2. Getting Started
- [Installation and Prerequisites](src/en/2-getting-started/2.1-installation-and-prerequisites.md) - Installation guide
- [Minimum Privileges](src/en/2-getting-started/2.2-minimum-privileges.md) - Privilege configuration
- [Quick Start](src/en/2-getting-started/2.3-quick-start-run-the-first-example-in-5-minutes.md) - Run the first example in 5 minutes
- [Output Formats](src/en/2-getting-started/2.4-output-formats-text--pcap--keylog.md) - Text, PCAP, and KeyLog output

### 3. Probe Reference
- [Probe Reference Overview](src/en/3-probe-reference/index.md) - Module registry
- **TLS/SSL Probes**
  - [TLS/SSL Plaintext Capture](src/en/3-probe-reference/3.1-tlsssl-plaintext-capture-openssl--boringssl.md) - OpenSSL/BoringSSL
  - [GoTLS Capture](src/en/3-probe-reference/3.2-gotls-capture.md) - Go crypto/tls
  - [GnuTLS Capture](src/en/3-probe-reference/3.3-gnutls-capture.md) - GnuTLS support
  - [NSS/NSPR Capture](src/en/3-probe-reference/3.4-nss--nspr-capture.md) - Firefox/Chrome NSS
- **System Audit Probes**
  - [Shell Auditing](src/en/3-probe-reference/3.6-shell-auditing-bash--zsh.md) - Bash/Zsh monitoring
  - [Database Traffic Capture](src/en/3-probe-reference/3.5-database-traffic-capture-mysql--postgresql.md) - MySQL/PostgreSQL queries

### 4. Integration and Deployment
- [Integration Overview](src/en/4-integration-and-deployment/index.md) - Deployment and integration guide
- [Remote Event Streaming](src/en/4-integration-and-deployment/4.1-remote-event-streaming-ecaptureq-websocket.md) - WebSocket/TCP streaming
- [Remote Dynamic Configuration API](src/en/4-integration-and-deployment/4.2-remote-dynamic-configuration-api.md) - Remote configuration
- [Logging and Output Configuration](src/en/4-integration-and-deployment/4.3-logging-and-output-configuration.md) - Logging configuration
- [Performance Overhead and Benchmarks](src/en/4-integration-and-deployment/4.4-performance-overhead-and-benchmarks.md) - Performance data

### 5. Architecture
- [Architecture Overview](src/en/7-architecture/index.md) - System architecture design
- [Three-layer Architecture](src/en/7-architecture/7.1-three-layer-architecture.md) - Three-layer system design
- [Probe Framework and Extension Mechanism](src/en/7-architecture/7.2-probe-framework-and-extension-mechanism.md) - Probe framework
- [Event Processing Pipeline](src/en/7-architecture/7.3-event-processing-pipeline.md) - Event data flow

### 6. Developer Guide
- [Developer Guide Overview](src/en/8-developer-guide/index.md) - Developer documentation
- [Compilation and Build](src/en/8-developer-guide/8.1-compilation-and-build.md) - Compilation and build process
- [How to Add a New Probe](src/en/8-developer-guide/8.2-how-to-add-a-new-probe.md) - Extend eCapture with new probes
- [Testing Strategy and CI/CD](src/en/8-developer-guide/8.3-testing-strategy-and-cicd.md) - Testing and CI/CD pipeline

### 7. FAQ and Troubleshooting
- [FAQ Overview](src/en/9-faq-and-troubleshooting/index.md) - Solutions to frequent problems
- [Detection and Defense](src/en/9-faq-and-troubleshooting/9.1-detection-and-defense.md) - Detection and defense strategies
- [Glossary](src/en/9-faq-and-troubleshooting/9.2-glossary.md) - Key terms and concepts

---

## 🚀 Quick Start

### View Documentation Locally

```bash
# Clone the repository
git clone https://github.com/gojue/ecapture.cc.git
cd ecapture.cc

# Install dependencies
pnpm install

# Start development server
pnpm docs:dev

# Build static site
pnpm docs:build
```

### Deploy to Production

The documentation is automatically deployed to [https://ecapture.cc](https://ecapture.cc) via [Vercel](https://vercel.com/) when changes are pushed to the main branch.

---

## 🔄 Updating Docs from Wiki

The documentation content is generated from [Devin AI Wiki](https://app.devin.ai/org/gojue/wiki/gojue/ecapture?branch=master). Follow these steps to refresh the docs with the latest wiki content:

### Step 1 — Refresh the Wiki

Open the Devin AI Wiki page and trigger a refresh to ensure the wiki reflects the latest source code:

👉 [https://app.devin.ai/org/gojue/wiki/gojue/ecapture?branch=master](https://app.devin.ai/org/gojue/wiki/gojue/ecapture?branch=master)

### Step 2 — Download the Latest `wiki.json`

Download the full multi-language wiki and overwrite `scripts/wiki.json`:

```bash
curl -o scripts/wiki.json \
  "https://app.devin.ai/api/wiki/get_full_multi_language_wiki?repo_name=gojue%2Fecapture&branch_name=master"
```

### Step 3–6 — One-click Update & Preview

A helper script `scripts/update_docs.sh` automates Steps 3–6 in one command:

```bash
# Generate docs and start the preview server
bash scripts/update_docs.sh

# Generate docs only, without starting the preview server
bash scripts/update_docs.sh --no-dev
```

Or run each step manually:

**Step 3** — Clear the doc cache:
```bash
rm -rf docs/en docs/zh
```

**Step 4** — Generate docs from wiki:
```bash
node scripts/generate_docs.js
```

**Step 5** — Migrate docs to `src/`:
```bash
node scripts/migrate_docs.js
```

**Step 6** — Preview locally:
```bash
pnpm run dev
```

Open your browser and verify the rendered documentation looks correct.

### Step 7 — Commit and Push

Once everything looks good, commit the changes:

```bash
git add .
git commit -m "docs: update from latest wiki"
git push
```

---

## 🤝 Contributing

We welcome contributions to improve the documentation! Here's how you can help:

1. **Report Issues** - Found a typo or incorrect information? [Open an issue](https://github.com/gojue/ecapture/issues)
2. **Submit Pull Requests** - Improve existing docs or add new content
3. **Translate** - Help translate documentation to other languages
4. **Share Feedback** - Suggest improvements to structure and content

### Documentation Guidelines

- Write clear, concise content with practical examples
- Include diagrams and code samples where appropriate
- Follow the existing structure and formatting
- Test all code examples before submitting
- Add source references from the [main repository](https://github.com/gojue/ecapture)

---

## 🔗 Related Links

- **Main Project**: [github.com/gojue/ecapture](https://github.com/gojue/ecapture)
- **Documentation Site**: [ecapture.cc](https://ecapture.cc)
- **Issue Tracker**: [GitHub Issues](https://github.com/gojue/ecapture/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gojue/ecapture/discussions)

---

## 📝 License

Apache License 2.0

Copyright (c) 2022-present, CFC4N (https://www.cnxct.com)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

---

## 👥 Contributors

Special thanks to all documentation contributors:

- [@CFC4N](https://github.com/CFC4N) - Project Lead & Core Developer
- [@Marandi269](https://github.com/Marandi269) - Documentation Contributor
- [@liushengxue](https://github.com/liushengxue) - Documentation Contributor

---

<div align="center">

**[⬆ Back to Top](#ecapture-documentation)**

Made with ❤️ by the eCapture Team

</div>

