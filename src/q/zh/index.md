---
title: eCaptureQ — 产品概览
description: 连接 eCapture 数据源，在桌面版或 Web 版的三栏界面中搜索、关联并查看应用消息。
lang: zh-CN
head:
  - - link
    - rel: canonical
      href: https://ecapture.cc/q/zh/
---

<script setup>
import QRelationship from '@theme/components/QRelationship.vue'
import ReleaseBadge from '@theme/components/ReleaseBadge.vue'
</script>

# eCaptureQ

将 eCapture 采集到的网络消息，转化为**可搜索、可关联、可查看的分析界面**。连接一个或多个数据源，按进程或协议筛选，在三栏界面中查看消息。

## 用 eCapture 采集，用 Q 分析 {#relationship}

**eCapture** 在采集主机上运行，负责采集与 TLS 解密。**eCaptureQ** 连接它的 `--stream-listen` WebSocket 接口，关联并展示应用消息。两个产品独立运行。

<QRelationship locale="zh" />

在左栏缩小查找范围，在中栏选择记录，在右栏查看详情。请求、响应、进程与 TLS 信息以数据源实际提供的内容为准。

## 选择桌面版还是 Web 版？ {#editions}

两种入口共用分析界面，都支持多个来源，可在 Windows、Linux、macOS 运行。按你希望运行 Q 的位置选择；eCapture 仍需要符合条件的 Linux 或 Android 采集环境。

| | eCaptureQ 桌面版 | eCaptureQ Web |
| --- | --- | --- |
| 怎样使用 | 在工作站上打开已安装的应用 | 启动服务，再通过浏览器打开页面 |
| 谁连接 eCapture | 桌面应用所在机器 | Web 服务所在机器 |
| 获取方式 | [安装桌面版](/q/zh/install/#desktop) | [运行 Web 版](/q/zh/install/#web) |

**第一次使用？** 可以先用[模拟模式](/q/zh/quick-start/#demo)熟悉界面，无需采集器；也可以跟随[快速开始](/q/zh/quick-start/)连接第一个实时数据源。具体命令、地址填写与成功判断都在该教程中。

## 新增能力与版本范围 {#updates}

**eCaptureQ v1.2.0** 使用 Protobuf v2 连接 **eCapture v2.12.0**。文本模式下，收到的消息会进入实时列表。采集器采用 keylog 或 pcapng 模式时，可在数据源面板中导出收到的原生文件。自 v1.1.0 起，Web 版也支持按需启用登录。[升级说明](/q/zh/install/#cli) · [原生文件](/q/zh/interface/#native) · [Web 登录认证](/q/zh/authentication/)

## 继续了解 {#next}

- [数据源连接](/q/zh/data-sources/)：了解同机、内网和公网地址的填写方式。
- [界面使用指南](/q/zh/interface/)：熟悉三栏，完成一次筛选练习。
- [协议与消息详情](/q/zh/protocols/)：了解各协议可以查看的内容。
- [常见问题](/q/zh/faq/)：排查连接、无记录与未配对问题。

[官方发布页](https://github.com/gojue/ecaptureQ/releases) · [项目源码](https://github.com/gojue/ecaptureQ)
