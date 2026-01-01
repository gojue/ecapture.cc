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

| Architecture | Minimum Kernel | Status |
|--------------|----------------|--------|
| x86_64 (amd64) | Linux 4.18+ | ✅ Fully Supported |
| aarch64 (arm64) | Linux 5.5+ | ✅ Fully Supported |
| Android ARM64 | Android 12+ | ✅ Supported (BoringSSL) |
| Windows / macOS | N/A | ❌ Not Supported |

---

## 📚 Documentation Structure

The documentation is organized into the following sections:

### 1. Overview
- [Introduction](src/en/1-overview/index.md) - System purpose and capabilities
- [Installation & Quick Start](src/en/1-overview/1.1-installation-and-quick-start.md) - Get started quickly
- [Command Line Interface](src/en/1-overview/1.2-command-line-interface.md) - CLI reference
- [Dependencies & Requirements](src/en/1-overview/1.3-dependencies-and-system-requirements.md) - System prerequisites

### 2. Architecture
- [Architecture Overview](src/en/2-architecture/index.md) - Five-layer system design
- [eBPF Engine](src/en/2-architecture/2.1-ebpf-engine.md) - eBPF program management
- [Event Processing Pipeline](src/en/2-architecture/2.2-event-processing-pipeline.md) - Data flow and processing
- [Configuration System](src/en/2-architecture/2.3-configuration-system.md) - Configuration management
- [Module System & Lifecycle](src/en/2-architecture/2.4-module-system-and-lifecycle.md) - Module architecture
- [Version Detection](src/en/2-architecture/2.5-version-detection-and-bytecode-selection.md) - Dynamic bytecode selection
- [Connection Tracking](src/en/2-architecture/2.6-network-connection-tracking.md) - Network flow management

### 3. Capture Modules
- [Modules Overview](src/en/3-capture-modules/index.md) - Module registry
- **TLS/SSL Modules**
  - [OpenSSL Module](src/en/3-capture-modules/3.1.1-openssl-module.md) - OpenSSL/BoringSSL/LibreSSL
  - [Go TLS Module](src/en/3-capture-modules/3.1.2-go-tls-module.md) - Go crypto/tls
  - [GnuTLS & NSS Modules](src/en/3-capture-modules/3.1.3-gnutls-and-nss-modules.md) - GnuTLS and Firefox/Chrome NSS
  - [Master Secret Extraction](src/en/3-capture-modules/3.1.4-master-secret-extraction.md) - Key extraction mechanics
- **System Audit Modules**
  - [Shell Command Auditing](src/en/3-capture-modules/3.2.1-shell-command-auditing.md) - Bash/Zsh monitoring
  - [Database Query Auditing](src/en/3-capture-modules/3.2.2-database-query-auditing.md) - MySQL/PostgreSQL queries
- [Network Packet Capture (TC)](src/en/3-capture-modules/3.3-network-packet-capture-with-tc.md) - TC eBPF programs

### 4. Output Formats
- [Text Output Mode](src/en/4-output-formats/4.1-text-output-mode.md) - Console/file output
- [PCAP Integration](src/en/4-output-formats/4.2-pcap-integration.md) - Wireshark-compatible format
- [TLS Key Logging](src/en/4-output-formats/4.3-tls-key-logging.md) - SSLKEYLOGFILE format
- [Protobuf & External Integration](src/en/4-output-formats/4.4-protobuf-and-external-integration.md) - WebSocket/TCP streaming

### 5. Development Guide
- [Build System](src/en/5-development-guide/5.1-build-system.md) - Compilation and build process
- **eBPF Program Development**
  - [Program Structure](src/en/5-development-guide/5.2.1-ebpf-program-structure.md) - eBPF code organization
  - [Structure Offset Calculation](src/en/5-development-guide/5.2.2-structure-offset-calculation.md) - Memory layout handling
- [Adding New Modules](src/en/5-development-guide/5.3-adding-new-modules.md) - Extend eCapture
- [Event Processing & Parsers](src/en/5-development-guide/5.4-event-processing-and-parsers.md) - Custom parsers

### 6. Troubleshooting & FAQ
- [Common Issues](src/en/6-troubleshooting-and-faq/index.md) - Solutions to frequent problems

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

