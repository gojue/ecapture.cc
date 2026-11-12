---
title: Web 登录认证
description: 为 eCaptureQ Web 配置用户名、密码哈希、HTTPS Cookie，了解登录、退出、会话过期及故障排查。
lang: zh-CN
---

# Web 登录认证

eCaptureQ Web 可通过配置文件启用用户名与密码登录，保护分析页面及记录、来源管理、状态、长轮询等 API。桌面版不启用此认证。

## 版本与保护范围 {#scope}

本文核对于 **2026 年 11 月 13 日**，依据主分支提交 [`1bb574d`](https://github.com/gojue/ecaptureQ/commit/1bb574da5e1fb98650a3ae604956d9f3ac2329cc)。当日最新正式版仍为 **v1.0.0**，不包含本页登录功能；请使用包含认证实现的源码构建或后续发布包。先运行 `ecaptureq-web --help`，确认有 `--hash-password`、`--listen`；构建方法见[对应源码编译指南](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/docs/compilation.md)。参数变化见[安装与升级](/q/zh/install/#cli)。

- 只有通过 `--sources` 加载配置，且其中 `auth` 是认证对象时，才启用登录。省略 `auth` 或设为 `null` 会关闭认证；`auth: {}` 是无效配置，Web 会拒绝启动。
- 这是一个配置账号的共享访问入口，没有多用户、角色或按来源授权。登录者都能查看保留记录并管理来源。
- 认证保护**浏览器到 Web 服务**这段访问，不为 eCapture 的 `--ecaptureq` 采集端 WebSocket 增加认证或加密。后者仍按[数据源连接](/q/zh/data-sources/#public)配置受保护链路。
- 无人登录、退出登录或会话过期都不会停止后台接收；记录仍按缓存上限保留和淘汰。

## 生成自己的密码哈希 {#password}

在 Web 服务主机运行：

```sh
ecaptureq-web --hash-password
```

macOS ZIP 使用 `./ecaptureq-web --hash-password`，Windows PowerShell 使用 `.\ecaptureq-web.exe --hash-password`。按提示输入并确认密码，交互输入不回显；密码长度为 **8–1024 字节**。将输出的整行哈希复制到下面的 `auth.passwordHash`，不要把明文密码作为命令行参数。

哈希为带随机盐的 PBKDF2-HMAC-SHA256（600,000 次迭代），配置不接受明文密码。工具也支持标准输入，适合从已有的安全输入渠道生成哈希。

新版包内 `config/sources.example.json` 的公开初始账号为 **`ecapture` / `ecaptureQ`**。这是示例文件的设置，只有加载该文件才生效，程序并非默认开启这个账号。部署前请替换为自己的用户名和密码哈希。

## 本机启用并登录 {#configure}

创建 `sources.local.json`。下面的哈希位置是占位符，**必须替换为上一步的完整输出**；可以将 `auth` 合并到已有的对象格式配置中，保留原来的 `sources`：

```json
{
  "auth": {
    "username": "ecapture",
    "passwordHash": "REPLACE_WITH_GENERATED_HASH",
    "secureCookie": false
  },
  "sources": []
}
```

本例仅用于本机 HTTP 调试，因此显式设置 `secureCookie: false`。Linux/macOS 可用 `chmod 600 sources.local.json` 限制文件权限；Windows 设置等效的文件访问权限。运行 Web 的用户需能读取文件，若要从界面保存新增来源，还需拥有写入权限。

```sh
ecaptureq-web --listen 127.0.0.1:28257 --sources ./sources.local.json
```

1. 保持服务运行，在同机打开 [http://127.0.0.1:28257/](http://127.0.0.1:28257/)，未登录时会进入登录页。
2. 输入配置中的用户名和**生成哈希时输入的明文密码**，而不是哈希字符串。
3. 登录成功后进入分析界面；本例未配置来源，默认可先体验模拟数据。按[快速开始](/q/zh/quick-start/#connect)添加来源、切换实时。
4. 右上角出现「退出登录」。退出后应返回登录页；匿名访问受保护 API 会返回 `401`。

| 字段 | 要求 |
| --- | --- |
| `auth.username` | 1–128 字节，首尾不能有空白 |
| `auth.passwordHash` | `--hash-password` 生成的完整哈希 |
| `auth.secureCookie` | 默认 `true`；HTTPS 使用 `true`，本机纯 HTTP 调试显式设为 `false` |

配置存在但无效时，Web 启动失败，不会退回免密模式。修改认证配置后需重启 Web 服务。

## HTTPS 与子路径部署 {#https}

远程部署使用 HTTPS 反向代理，并将 `auth.secureCookie` 改为 **`true`**（或省略以采用默认值）。应用的 `--listen` 提供 HTTP 监听，TLS 由代理终止；浏览器访问的是 HTTPS 地址，即使代理到本机应用使用 HTTP，也应保持 Secure Cookie。

例如，在已有的 HTTPS 代理后将整个 `/ecaptureq-web/` 转发到本机服务：

```sh
ecaptureq-web --listen 127.0.0.1:28257 \
  --sources ./sources.local.json \
  --base-path /ecaptureq-web/ \
  --exclude-http-path-prefix /ecaptureq-web/
```

浏览器访问 `https://your-host/ecaptureq-web/`，登录页位于同一前缀内。代理需保留该前缀和外部 `Host`，将页面、资源与 API 一并转发；Nginx 的 `proxy_pass http://127.0.0.1:28257` 不要添加会剥离前缀的尾斜杠。可参照[官方 Nginx 示例](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/deploy/nginx.conf.example)配置自己的 TLS 入口。长轮询可能等待 10 秒，代理读取超时需大于此等待时间，示例为 35 秒。

Cookie 使用 `HttpOnly`、`SameSite=Strict`，Path 对应 `--base-path`。应用不会根据请求中的 `X-Forwarded-Proto` 自动修改 Cookie 的 Secure 属性；应显式核对配置和浏览器访问协议。

## 会话、退出与修改密码 {#sessions}

登录会话固定有效 **12 小时**，刷新页面和长轮询都不会续期。过期后 API 返回 `401`，页面停止刷新并转到登录页。单个实例最多保留 **128 个会话**，服务重启后全部失效。

「退出登录」撤销当前会话并结束它的长轮询；共享该 Cookie 的页签也会失去访问权限，其他浏览器的独立会话不受影响。退出不会清空服务的实时缓存，也不会停止采集器。

修改或忘记密码时，在服务主机重新运行 `--hash-password`，替换配置中的 `passwordHash`，然后重启 Web 服务。需要修改用户名时一并更新 `username`。重启会让全部登录会话失效，**也会清空内存中的实时记录和日志**；需要的记录应提前导出。没有网页自助找回密码流程。

## 常见故障 {#troubleshooting}

| 现象 | 检查与处理 |
| --- | --- |
| `flag provided but not defined` | 核对二进制版本及 `--help`；正式 v1.0.0 不支持新认证参数，也使用旧命令行名称 |
| 没有登录页 | 确认启动命令加载了正确的 `--sources` 文件，且 `auth` 未省略、未设为 `null`；Desktop 不显示 Web 登录页 |
| 启动时报认证配置无效 | 替换哈希占位符，不要填明文密码；核对用户名与 JSON 格式，不能用空 `auth` 对象启用认证 |
| 密码错误，返回 `401` | 输入配置用户名及对应明文密码；示例初始密码不适用于已经替换的哈希 |
| 登录后又回到登录页 | 检查 Cookie 是否保存并发送、访问协议是否匹配 `secureCookie`、代理是否保留 base-path；本机 HTTP 调试显式设为 `false`，线上保持 HTTPS 和 `true` |
| 登录返回 `429` | 实例共享登录限速，突发额度最多 5 次，每 12 秒恢复 1 次，最多同时校验 2 次；按 `Retry-After` 等待，避免连续重试 |
| 登录返回 `403` | 检查反向代理的外部 Host 和同源访问；登录/退出请求需要同源及 `X-Ecapture-UI: 1`，内置页面会自动发送 |
| 登录返回 `503` / `session_limit` | 已达会话上限；退出不再使用的会话或等待过期。重启可清空会话，但也会丢失内存记录 |

实现依据：[配置与认证参考](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/docs/reference.md)、[认证中间件](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/internal/auth/handler.go)、[密码与配置校验](https://github.com/gojue/ecaptureQ/blob/1bb574da5e1fb98650a3ae604956d9f3ac2329cc/internal/auth/password.go)。
