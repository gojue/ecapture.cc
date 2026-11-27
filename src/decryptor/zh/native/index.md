---
title: C 与 C++ 集成
description: 链接 v1.4.4 原生 SDK，用离线样例验证 JSON 输出，并处理 C 接口返回的错误。
lang: zh-CN
---

# C 与 C++ 集成

如果要在自己的程序中读取已保存的抓包，并将解码事件的元数据写成 JSON，可以链接预编译库。发布包包含生成的 C 头文件、静态库和动态库。使用包内静态库编译以下示例只需 C 工具链，无需安装 Go。

## 选择二进制包 {#package}

按**运行应用的机器**选择 v1.4.4 发布包，并下载同名的 `.tar.gz.sha256` 校验文件。运行程序的主机与采集流量的主机可以使用不同架构。

| 运行平台 | 文件名 |
| --- | --- |
| Linux x86-64 | `ecapture_decryptor-v1.4.4-linux-amd64.tar.gz` |
| Linux arm64 | `ecapture_decryptor-v1.4.4-linux-arm64.tar.gz` |
| macOS Apple 芯片 | `ecapture_decryptor-v1.4.4-darwin-arm64.tar.gz` |

以下示例在 Apple 芯片的 Mac 上执行，工作目录为文件下载位置。Linux 用户请替换包名，使用 `sha256sum -c` 校验。[官方发布包与校验文件](https://github.com/gojue/ecapture_decryptor/releases/tag/v1.4.4)

```sh
decryptor_sdk=ecapture_decryptor-v1.4.4-darwin-arm64
shasum -a 256 -c "$decryptor_sdk.tar.gz.sha256" &&
  tar -xzf "$decryptor_sdk.tar.gz"
```

## 解码一个测试抓包 {#example}

在解压目录旁创建 `decode.c`，内容如下。运行时传入抓包路径和一个**新的**输出文件名，SDK 会创建 JSON 文件或清空同名文件。测试抓包内嵌了 TLS 密钥，因此 `DecryptPcapToFile` 的第二个参数传 `NULL`。使用独立 NSS 密钥日志时，在该位置传入日志路径。

```c
#include <stdio.h>
#include "libecapture_decryptor.h"

int main(int argc, char **argv) {
    if (argc != 3) {
        fprintf(stderr, "usage: %s capture.pcapng result.json\n", argv[0]);
        return 1;
    }
    char error[512] = {0};
    char format[] = "json";
    int status = DecryptPcapToFile(argv[1], NULL, argv[2], format, error, sizeof error);
    if (status != 0) {
        fprintf(stderr, "decode failed (%d): %s\n", status, error);
    }
    return status;
}
```

按平台选择一条链接命令，将 `decryptor_sdk` 设为解压目录。静态库和动态库位于同一目录，用路径直接指定静态库即可选中它。C++ 程序可引用同一份头文件。[上游构建参数](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/examples/c_demo/Makefile)

```sh
# macOS
cc -I"$decryptor_sdk/include" decode.c "$decryptor_sdk/lib/libecapture_decryptor.a" \
  -lpthread -framework CoreFoundation -framework Security -o decode

# Linux
cc -I"$decryptor_sdk/include" decode.c "$decryptor_sdk/lib/libecapture_decryptor.a" \
  -lpthread -lresolv -o decode
```

将上游的 HTTP/1.0 回环测试抓包保存到当前目录，执行下方命令。生成的 JSON 数组包含一条请求和一条响应，可以核对 `protocol`、`direction` 和 `dataLength` 字段。C 封装使用 Go 结构体的标准 JSON 编码，会省略 `Data` 正文字节。需要读取 HTTP 消息原文时，可按 [Go 快速开始](/decryptor/zh/quick-start/) 读取 `packet.Data`。[下载测试抓包](https://raw.githubusercontent.com/gojue/ecapture_decryptor/v1.4.4/test/testdata/http10_ecapture_dsb.pcapng)

```sh
./decode http10_ecapture_dsb.pcapng result.json
```

## 输入、输出与错误处理 {#contracts}

| 入口 | v1.4.4 的行为 |
| --- | --- |
| `DecryptPcapToFile` | 接收抓包路径、可选的密钥日志路径和格式字符串 `"json"`。先在内存中收集事件，再写入一个 JSON 数组。返回零表示调用完成；失败时读取调用方提供的错误缓冲区。 |
| `DecryptPcapStreamToFile` | 从标准输入读取抓包，直到 EOF 后才写出 JSON 数组。`maxPackets` 为正数时，限制用于输出的解码事件数；为零时保留全部事件。仅使用内嵌密钥时，输入应为 pcapng。 |
| `GetVersion` / `FreeString` | 版本字符串由库分配，用完后通过 `FreeString` 释放。 |

本版按网卡名启动的接口 `DecryptLiveTrafficToFile` 会返回会话句柄，但其后台任务会报告需要集成 pcap 设备采集。处理有限长度的输入时，可从已有生产端向标准输入传送抓包。需要边读边处理事件时，使用 [Go 流式回调](/decryptor/zh/streaming/)。[C 封装实现](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/capi/main.go) · [事件 JSON 字段](https://github.com/gojue/ecapture_decryptor/blob/v1.4.4/types/packet.go)
