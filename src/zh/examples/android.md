---
footer: false
---

# Android 12的知乎APP抓包

:::info 案例详情介绍

演示安卓app一般的抓https包步骤。

## 下载

使用ecapture进行安卓app抓包有如下限制：

1. 安卓设备的内核版本只有在5.10版本上才可以进行无任何修改的开箱抓包操作。

2. 如果你的设备是安卓13，应该可以正常使用ecapture。低于13的安卓设备，如果内核是5.10，理论也是可行的。
   因为安卓使用的linux内核的ebpf环境受内核版本号的影响，而工作良好的ebpf接口是在内核5.5版本时才全部使能。
   虽然ecapture最低要求的版本是4.18，但安卓上的4.19与5.4内核提供的ebpf接口并不能完整，不能正常的工作。
   
3. 你可以使用apple m1设备的安卓12模拟器进行测试，因为它提供的就是5.10的内核。
   安卓11及以下都不可行，因为内核版本太低，需要修改打补丁才可以。

4. 如果你不知道你的设备的内核版本，可以打开手机，在关于页面中看到内核信息。
   或者手机连接电脑，执行```adb shell cat /proc/version```或者```adb shell uname -a```进行查看。

5. 如何进行低版本内核修改，可以参考```https://github.com/feicong/android_ebpf``` ，目前仓库正在更新中。

如果满足使用的条件，到 https://github.com/gojue/ecapture/releases 下载最新版本的ecapture，解压后执行下面命令完成安装：

```
adb push ecapture /data/local/tmp/
adb shell chmod 777 /data/local/tmp/ecapture
```

## 启动

ecapture目前已经适配安卓13，执行下面的命令就可以开启全局抓包：

```
$ adb root
# adb shell /data/local/tmp/ecapture tls
Linux version 5.10.66-android12-9-00021-g2c152aa32942-ab8087165 (build-user@build-host) (Android (7284624, based on r416183b) clang version 12.0.5 (https://android.googlesource.com/toolchain/llvm-project c935d99d7cf2016289302412d708641d52d2f7ee), LLD 12.0.5 (/buildbot/src/android/llvm-toolchain/out/llvm-project/lld c935d99d7cf2016289302412d708641d52d2f7ee)) #1 SMP PREEMPT Fri Jan 14 17:35:16 UTC 2022
emulator64_arm64:/ # /data/local/tmp/ecapture tls
2022/07/05 10:15:44 pid info :3510
2022/07/05 10:15:44 start to run EBPFProbeOPENSSL module
2022/07/05 10:15:44 start to run EBPFProbeGNUTLS module
2022/07/05 10:15:44 start to run EBPFProbeNSPR module
2022/07/05 10:15:44 start to run EBPFProbeGoSSL module
2022/07/05 10:15:44 go binary not found
2022/07/05 10:15:44 tls module couldn't find binPath.: stat /apex/com.android.conscrypt/lib64/libnspr4.so: no such file or directory
2022/07/05 10:15:44 tls(gnutls) module couldn't find binPath.: stat /apex/com.android.conscrypt/lib64/libgnutls: no such file or directory
2022/07/05 10:15:44 HOOK type:2, binrayPath:/apex/com.android.conscrypt/lib64/libssl.so
2022/07/05 10:15:44 libPthread so Path:/apex/com.android.runtime/lib64/bionic/libc.so
2022/07/05 10:15:44 target all process.
2022/07/05 10:15:44 target all users.
```

## 捕获

在ecapture抓包的时候，你可以安装目标apk到设备，比如wechat:

```
adb install -r /Users/m1/Downloads/com.zhihu.android_8.23.0_11724.apk
Performing Streamed Install
Success
```

安装完成打开app，就可以看到ecapture的输出内容中有抓包的内容了：

```
2022/07/05 10:42:59 PID:4506, Comm:MQTT Snd: APBR3, TID:5269, Version:TLS_VERSION_UNKNOW, Send 8 bytes to [ADDR_NOT_FOUND], Payload:
��V� ��
2022/07/05 10:42:59 PID:4506, Comm:org/eclipse/pah, TID:5267, Version:TLS_VERSION_UNKNOW, Recived 4 bytes from [ADDR_NOT_FOUND], Payload:
��
2022/07/05 10:43:08 PID:4506, Comm:i.zhihu.com/..., TID:4643, Version:TLS_VERSION_UNKNOW, Send 2305 bytes to [ADDR_NOT_FOUND], Payload:
GET /growth-misc/hubao/process?client_source=yybgg HTTP/1.1
X-B3-Traceid: a10cff3476f7ae78
X-B3-Spanid: a10cff3476f7ae78
User-Agent: com.zhihu.android/Futureve/8.23.0 Mozilla/5.0 (Linux; Android 12; Android SDK built for arm64 Build/SE1A.220203.002.A1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.1000.10 Mobile Safari/537.36
x-api-version: 3.0.93
x-app-version: 8.23.0
x-app-za: OS=Android&Release=12&Model=Android+SDK+built+for+arm64&VersionName=8.23.0&VersionCode=11724&Product=com.zhihu.android&Width=1080&Height=1794&Installer=Market&DeviceType=AndroidPhone&Brand=Android
x-app-bundleid: com.zhihu.android
x-app-flavor: yybgg
x-app-build: release
x-network-type: WiFi
X-ZST-82: 2.0AKDfeq2QMxUMAAAASwUAADIuMIMVxGIAAAAAZ-Sxs4cfb9ADDT4E4v86wqGRtJc=
X-ZST-81: APAffq2QMxWmD83Mx9hZ8g4T1AxCa0ndchEkZQ==
x-udid: APBR3KyQMxVLBaQL4nSFPyCKBQvkske3eM0=
Authorization: Bearer gt2.0AAAAADtYHPQVM5Cs3FHwAAAAAAxNVQJgAgDs52VsD96sLPab3dkidtuPNVwv_A==
X-AB-PB: CpYCQwvzA0ABoQM7CxsAxwk3DLQAdggECnkIvgoyBeQKzgrcBwELQwDlCcQKKQtrCoULcQuYCncHpgTtCtgHQQbrBtcLogN2C0kJqQrgC9wLdAHWCMUJ1Aq5Ap4FzAK1C7cDjQRUCewKjATFCP4Kmwt4B2oBywnWBOULfQu0Ck8DPwmNCfQJKQWUBlUJZQoBCRMLMAbdCjQMRwDdBz8AzAm5C5sH8QnpBKIGJwiYCFIL4QngC30C/QpQA3oIqwlnCI0LaQHICdoIQglGC2ALFgmjC8YJwAtWDIMK1wKMBfYJFgbDCVEFyQmHC/QDOwJJCosF0QmlCsQJoAPKCVcHdAh5C2AJJwcxBuUIMwR+BhEF2ALmCzIDhAkSiwEAAgEBAAAAAQAAAAQBAQAAAgAVAQABAAEAAQAAAAAAAAAAAAEAAwABAAABFQEBAwEEAQEEBgACAAACBAAAAAAAAQABAAEAAAEAAAAAAgACAAAHAAACAwEBAAEEAQIABAECAAEAAAAAAQAAAQIBAQECAAECAAABAwEAAAAAAAEAAAEAAAEAAAAAAgEB
X-MS-ID: DUE184xcbM7Z7qb3q5kzXYNfxtoebvVy0C04RFVFMTg0eGNiTTdaN3FiM3E1a3pYWU5meHRvZWJ2VnkwQzA0c2h1
Host: api.zhihu.com
Connection: Keep-Alive
Accept-Encoding: gzip
Cookie: KLBRSID=4efa8d1879cb42f8c5b48fe9f8d37c16|1657017750|1657017730; _xsrf=zi1QdxAAoO0rf8cSN9mCDoHLOeMcWZI2; z_c0=2|1:0|10:1657017731|4:z_c0|92:Z3QyLjBBQUFBQUR0WUhQUVZNNUNzM0ZId0FBQUFBQXhOVlFKZ0FnRHM1MlZzRDk2c0xQYWIzZGtpZHR1UE5Wd3ZfQT09|f2a0b7093438b105b88e97f59a2eacb15f4e15f04c984e1dd75de2bbba1ae171
X-SUGER: VURJRD1BUEJSM0t5UU14VkxCYVFMNG5TRlB5Q0tCUXZrc2tlM2VNMD07QU5EUk9JRF9JRD1mMjRlOWY0NDdjODFjYTIwO1gtQUQtSVBWND0xNzEuODAuMTg1LjE4
X-AD: canvas_version:v=5.1;setting:cad=0
X-Zse-96: 1.0_zxK6z4DJMd/CTGuOolomwvrBDIEOEFYHifi0m15DV8fMKqkg5Jy/PErNu8qXmAmb
X-Zse-93: 101_1_1.0

2022/07/05 10:43:08 PID:4506, Comm:i.zhihu.com/..., TID:4706, Version:TLS_VERSION_UNKNOW, Send 2483 bytes to [ADDR_NOT_FOUND], Payload:
POST /api/user/prod/user/info/collections/upload HTTP/1.1
X-B3-Traceid: 9dc59e36989c7ec1
X-B3-Spanid: 9dc59e36989c7ec1
X-Zse-93: 101_1_1.0
User-Agent: com.zhihu.android/Futureve/8.23.0 Mozilla/5.0 (Linux; Android 12; Android SDK built for arm64 Build/SE1A.220203.002.A1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.1000.10 Mobile Safari/537.36
x-api-version: 3.0.93
x-app-version: 8.23.0
x-app-za: OS=Android&Release=12&Model=Android+SDK+built+for+arm64&VersionName=8.23.0&VersionCode=11724&Product=com.zhihu.android&Width=1080&Height=1794&Installer=Market&DeviceType=AndroidPhone&Brand=Android
x-app-bundleid: com.zhihu.android
x-app-flavor: yybgg
x-app-build: release
x-network-type: WiFi
X-ZST-82: 2.0AKDfeq2QMxUMAAAASwUAADIuMIMVxGIAAAAAZ-Sxs4cfb9ADDT4E4v86wqGRtJc=
X-ZST-81: APAffq2QMxWmD83Mx9hZ8g4T1AxCa0ndchEkZQ==
x-udid: APBR3KyQMxVLBaQL4nSFPyCKBQvkske3eM0=
Authorization: Bearer gt2.0AAAAADtYHPQVM5Cs3FHwAAAAAAxNVQJgAgDs52VsD96sLPab3dkidtuPNVwv_A==
X-AB-PB: CpYCQwvzA0ABoQM7CxsAxwk3DLQAdggECnkIvgoyBeQKzgrcBwELQwDlCcQKKQtrCoULcQuYCncHpgTtCtgHQQbrBtcLogN2C0kJqQrgC9wLdAHWCMUJ1Aq5Ap4FzAK1C7cDjQRUCewKjATFCP4Kmwt4B2oBywnWBOULfQu0Ck8DPwmNCfQJKQWUBlUJZQoBCRMLMAbdCjQMRwDdBz8AzAm5C5sH8QnpBKIGJwiYCFIL4QngC30C/QpQA3oIqwlnCI0LaQHICdoIQglGC2ALFgmjC8YJwAtWDIMK1wKMBfYJFgbDCVEFyQmHC/QDOwJJCosF0QmlCsQJoAPKCVcHdAh5C2AJJwcxBuUIMwR+BhEF2ALmCzIDhAkSiwEAAgEBAAAAAQAAAAQBAQAAAgAVAQABAAEAAQAAAAAAAAAAAAEAAwABAAABFQEBAwEEAQEEBgACAAACBAAAAAAAAQABAAEAAAEAAAAAAgACAAAHAAACAwEBAAEEAQIABAECAAEAAAAAAQAAAQIBAQECAAECAAABAwEAAAAAAAEAAAEAAAEAAAAAAgEB
X-MS-ID: DUE184xcbM7Z7qb3q5kzXYNfxtoebvVy0C04RFVFMTg0eGNiTTdaN3FiM3E1a3pYWU5meHRvZWJ2VnkwQzA0c2h1
Content-Type: application/json; charset=UTF-8
Content-Length: 192
Host: api.zhihu.com
Connection: Keep-Alive
Accept-Encoding: gzip
Cookie: KLBRSID=4efa8d1879cb42f8c5b48fe9f8d37c16|1657017750|1657017730; _xsrf=zi1QdxAAoO0rf8cSN9mCDoHLOeMcWZI2; z_c0=2|1:0|10:1657017731|4:z_c0|92:Z3QyLjBBQUFBQUR0WUhQUVZNNUNzM0ZId0FBQUFBQXhOVlFKZ0FnRHM1MlZzRDk2c0xQYWIzZGtpZHR1UE5Wd3ZfQT09|f2a0b7093438b105b88e97f59a2eacb15f4e15f04c984e1dd75de2bbba1ae171
X-SUGER: VURJRD1BUEJSM0t5UU14VkxCYVFMNG5TRlB5Q0tCUXZrc2tlM2VNMD07QU5EUk9JRF9JRD1mMjRlOWY0NDdjODFjYTIwO1gtQUQtSVBWND0xNzEuODAuMTg1LjE4
X-AD: canvas_version:v=5.1;setting:cad=0

8mPCggVSdXoz3WBpzltPB9eyHCHC/6Xx8xoiBMmppz0l0+PNxJk+QPVOvYCfwoB4WLsmTu/pSAjMncw7E1c4eohktU8ahXX6NbyCvapvzJP85Ad0pvKVoDol2qR7s7yZQNkS+50idqj0Ce889kmj73jlPD+QXk4Y2WA3veWo/blYPqlj8XdFowsiM1csfFtT
2022/07/05 10:43:08 PID:4638, Comm:TS-processor, TID:4764, Version:TLS_VERSION_UNKNOW, Send 760 bytes to [ADDR_NOT_FOUND], Payload:
POST /api.php?format=json&t=1 HTTP/1.1
Content-Type: application/octet-stream
GT_C_T: 1
GT_C_K: 69d747c4b9f641baf4004be4297e9f3b
GT_C_V: M29IWExpR2dzYVVldWlwZ1BdeWUYFu5XvBp70dDX5xjs8TmifbeSw1DK2gegydQtu/CFWtTCB9tWtYP2tlJksf/9caVUs6Aib+WqjRcy76Ax7OXIVi3nOOW5C5BWA6V8o5euGfj9ETGP0Gyok8+K4w==
GT_T: 1657017788373
GT_C_S: 65uufzR2kJcxWo7FLs3Zao2BwTM=
User-Agent: Dalvik/2.1.0 (Linux; U; Android 12; Android SDK built for arm64 Build/SE1A.220203.002.A1)
Host: sdk-open-phone.getui.com
Connection: Keep-Alive
Accept-Encoding: gzip
Content-Length: 201

%��}�Ђ/���n�������u5,fP�g����_yę�ӎ9�c-���2��������������y�
�cռE��$[үH�������ӷ(��0�ST��f?!�
!�܁��%0���x
zߘ�'U�
�%��!/R'��
��#wEϏ��.�Z�;P��SUs�����>���1�V
2022/07/05 10:43:08 PID:4506, Comm:i.zhihu.com/..., TID:4706, Version:TLS_VERSION_UNKNOW, Recived 695 bytes from [ADDR_NOT_FOUND], Payload:
HTTP/1.1 200 OK
Server: CLOUD ELB 1.0.0
Date: Tue, 05 Jul 2022 10:43:10 GMT
Content-Type: application/json
expires: Thu, 01 Jan 1970 08:00:00 CST
pragma: no-cache
X-Backend-Response: 0.005
Vary: Accept-Encoding
Referrer-Policy: no-referrer-when-downgrade
X-SecNG-Response: 0.016999959945679
X-UDID: APBR3KyQMxVLBaQL4nSFPyCKBQvkske3eM0=
x-lb-timing: 0.030
x-idc-id: 2
Set-Cookie: KLBRSID=4efa8d1879cb42f8c5b48fe9f8d37c16|1657017790|1657017730; Path=/
Cache-Control: private, must-revalidate, no-cache, no-store, max-age=0
Content-Length: 17
X-NWS-LOG-UUID: 12117562707053932629
Connection: keep-alive
X-Cache-Lookup: Cache Miss
x-edge-timing: 0.054
x-cdn-provider: tencent

2022/07/05 10:43:08 PID:4506, Comm:i.zhihu.com/..., TID:4706, Version:TLS_VERSION_UNKNOW, Recived 17 bytes from [ADDR_NOT_FOUND], Payload:
{"success":true}

2022/07/05 10:43:08 PID:4638, Comm:TS-processor, TID:4764, Version:TLS_VERSION_UNKNOW, Recived 266 bytes from [ADDR_NOT_FOUND], Payload:
HTTP/1.1 200 OK
Server: Tengine
Date: Tue, 05 Jul 2022 10:43:10 GMT
Content-Type: text/html;charset=UTF-8
Content-Length: 15
Connection: keep-alive
Content-Language: en-US
GT_ERR: 0
GT_T: 1657017790419
GT_C_S: 5t2nBvQzU80D7xFPlWRj4XgGLLY=

=\Y��D����%�
2022/07/05 10:43:08 PID:4506, Comm:i.zhihu.com/..., TID:4643, Version:TLS_VERSION_UNKNOW, Recived 760 bytes from [ADDR_NOT_FOUND], Payload:
HTTP/1.1 200 OK
Server: CLOUD ELB 1.0.0
Date: Tue, 05 Jul 2022 10:43:10 GMT
Content-Type: application/json; charset=UTF-8
expires: Fri, 02 Jan 2000 00:00:00 GMT
etag: "6cab34bf4cf6c8cb5648f95540d43fbe06da2151"
pragma: no-cache
X-Backend-Response: 0.007
Vary: Accept-Encoding
Referrer-Policy: no-referrer-when-downgrade
X-SecNG-Response: 0.016000032424927
X-UDID: APBR3KyQMxVLBaQL4nSFPyCKBQvkske3eM0=
x-lb-timing: 0.017
x-idc-id: 2
Set-Cookie: KLBRSID=4efa8d1879cb42f8c5b48fe9f8d37c16|1657017790|1657017730; Path=/
Cache-Control: private, must-revalidate, no-cache, no-store, max-age=0
Content-Length: 32
X-NWS-LOG-UUID: 18235938178439109656
Connection: keep-alive
X-Cache-Lookup: Cache Miss
x-edge-timing: 0.094
x-cdn-provider: tencent

2022/07/05 10:43:08 PID:4506, Comm:i.zhihu.com/..., TID:4643, Version:TLS_VERSION_UNKNOW, Recived 32 bytes from [ADDR_NOT_FOUND], Payload:
{"process": [], "properties": 1}
2022/07/05 10:43:10 PID:4506, Comm:ZH_RxComputatio, TID:4545, Version:TLS_VERSION_UNKNOW, Send 207 bytes to [ADDR_NOT_FOUND], Payload:
GET /resolv?host=api.zhihu.com&version=8.23.0&os_type=Android&uid=00000000000000000000000000000000 HTTP/1.1
Host: 118.89.204.198
Connection: Keep-Alive
Accept-Encoding: gzip
User-Agent: okhttp/3.11.0

2022/07/05 10:43:10 PID:4506, Comm:ZH_RxComputatio, TID:4545, Version:TLS_VERSION_UNKNOW, Recived 511 bytes from [ADDR_NOT_FOUND], Payload:
HTTP/1.1 416 Requested Range Not Satisfiable
Date: Tue, 05 Jul 2022 10:43:12 GMT
Content-Length: 0
Connection: keep-alive
Set-Cookie: tgw_l7_route=fdfce69c1f50de9a2c02cc266c2964de; Expires=Tue, 05-Jul-2022 10:43:42 GMT; Path=/
Server: openresty
x-backup-hosts: www.zhihu.com,api.zhihu.com,sugar.zhihu.com
x-backup-ips: 103.41.167.226,103.41.167.236,103.41.167.235,103.41.167.234
x-client-ip: 171.80.185.18
X-Backend-Response: 0.001
Access-Control-Allow-Methods: GET
Access-Control-Allow-Origin: *
......
```

注意：

1. 如果目标apk加密了请求，输出的内容会是乱码。
2. 对于非https的socket或者其它包，乱码。
3. 如果app使用了自己的ssl请求库，或者静态链接程序，是不会有显示的，表示这种情况无法直接抓包。
   需要自己找到请求库SSL_read,SSL_write的二进制offset地址，手动指定。

## 演示视频

<iframe src="//player.bilibili.com/player.html?aid=900387088&bvid=BV1xP4y1Z7HB&cid=831143179&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="500"> </iframe>   



