# 对 Docker 容器内的程序抓包

:::info 案例详情介绍

## 使用流程介绍
查看docker容器列表，找到你关注的容器
```shell
docker ps | grep -w netshoot
b37ffd7a8341   nicolaka/netshoot           "/bin/sleep 3600"        50 minutes ago      Up 50 minutes  
```

确认docker ID
```shell
docker inspect b37ffd7a8341  | grep '"MergedDir"'
                "MergedDir": "/var/lib/docker/overlay2/02c5fe50b9c6a817c47117ebddd8be82cf4095a6ff278f197519b1cedb7c3d75/merged",
```

查找`libssl`

```shell
find /var/lib/docker/overlay2/02c5fe50b9c6a817c47117ebddd8be82cf4095a6ff278f197519b1cedb7c3d75/merged -name "libssl*"

/var/lib/docker/overlay2/02c5fe50b9c6a817c47117ebddd8be82cf4095a6ff278f197519b1cedb7c3d75/merged/lib/libssl.so.1.1
/var/lib/docker/overlay2/02c5fe50b9c6a817c47117ebddd8be82cf4095a6ff278f197519b1cedb7c3d75/merged/usr/lib/libssl.so.1.1
```

使用eCapture捕获
```shell
ecapture tls --libssl="/var/lib/docker/overlay2/02c5fe50b9c6a817c47117ebddd8be82cf4095a6ff278f197519b1cedb7c3d75/merged/lib/libssl.so.1.1" --hex
2022/05/30 14:02:27 pid info :2825032
2022/05/30 14:02:27 start to run EBPFProbeOPENSSL module
2022/05/30 14:02:27 start to run EBPFProbeGNUTLS module
2022/05/30 14:02:27 HOOK type:2, binrayPath:/var/lib/docker/overlay2/02c5fe50b9c6a817c47117ebddd8be82cf4095a6ff278f197519b1cedb7c3d75/merged/lib/libssl.so.1.1
2022/05/30 14:02:27 libPthread so Path:/lib64/libpthread.so.0
2022/05/30 14:02:27 target all process. 
2022/05/30 14:02:27 start to run EBPFProbeNSPR module
2022/05/30 14:02:27 stat /usr/lib/libnspr4.so: no such file or directory
2022/05/30 14:02:27 HOOK type:2, binrayPath:/lib64/libgnutls.so.30
2022/05/30 14:02:27 target all process. 
```

结果输出
```shell
2022/05/30 14:03:34 PID:2825502, Comm:curl, TID:2825502, Version:TLS1_2_VERSION, Send 74 bytes to [ADDR_NOT_FOUND], Payload:
GET / HTTP/1.1
Host: 10.1.34.88
User-Agent: curl/7.83.1
Accept: */*


2022/05/30 14:03:34 PID:2825502, Comm:curl, TID:2825502, Version:TLS1_2_VERSION, Recived 88 bytes from [ADDR_NOT_FOUND], Payload:
HTTP/1.0 200 OK
Server: BigIP
Connection: Keep-Alive
Content-Length: 10

 IT WORKS 
```
