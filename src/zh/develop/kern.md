---
footer: false
---

# 内核空间代码

> 内核空间代码在 `kern/` 中

## 大致结构

```
> kern
  > bpf
    > arm64     (vmlinux.h)
    > x86       (vmlinux.h)
    ...         (bpf headers 文件)
  common.h
  ecapture.h    (文件引入)
  *_kern.c      (hook 函数)
```

## 内核代码

> 以 `bash_kern.c` 为例子，理解内核部分代码

```c
#include "ecapture.h"
// 传递数据结构体定义
struct event {
    u32 pid;
    u32 uid;
    u8 line[MAX_DATA_SIZE_BASH];
    u32 retval;
    char comm[TASK_COMM_LEN];
};
// 定义 ebpf map - events，类型 BPF_MAP_TYPE_PERF_EVENT_ARRAY
struct {
    __uint(type, BPF_MAP_TYPE_PERF_EVENT_ARRAY);
} events SEC(".maps");
// 定义 ebpf map - events_t，类型 BPF_MAP_TYPE_HASH
struct {
    __uint(type, BPF_MAP_TYPE_HASH);
    __type(key, u32);
    __type(value, struct event);
    __uint(max_entries, 1024);
} events_t SEC(".maps");
// Force emitting struct event into the ELF.
const struct event *unused __attribute__((unused));
// SEC 宏定义，在 bpf_helpers.h 中定义。将定义的对象放置 ELF section
SEC("uretprobe/bash_readline")
int uretprobe_bash_readline(struct pt_regs *ctx) {
    // 获取 pid uid
    u64 pid_tgid = bpf_get_current_pid_tgid();
    u32 pid = pid_tgid >> 32;
    u64 current_uid_gid = bpf_get_current_uid_gid();
    u32 uid = current_uid_gid >> 32;
    // 过滤
#ifndef KERNEL_LESS_5_2
    // if target_ppid is 0 then we target all pids
    if (target_pid != 0 && target_pid != pid) {
        return 0;
    }
    if (target_uid != 0 && target_uid != uid) {
        return 0;
    }
#endif
    // 将信息缓存至 events_t 这个 bpf map 中，其中 key 为当前 pid
    struct event event = {};
    event.pid = pid;
    event.uid = uid;
    // bpf_printk("!! uretprobe_bash_readline pid:%d",target_pid );
    bpf_probe_read_user(&event.line, sizeof(event.line), (void *)PT_REGS_RC(ctx));
    bpf_get_current_comm(&event.comm, sizeof(event.comm));
    bpf_map_update_elem(&events_t, &pid, &event, BPF_ANY);
    return 0;
}
SEC("uretprobe/bash_retval")
int uretprobe_bash_retval(struct pt_regs *ctx) {
    // 获取 pid uid
    u64 pid_tgid = bpf_get_current_pid_tgid();
    u32 pid = pid_tgid >> 32;
    u64 current_uid_gid = bpf_get_current_uid_gid();
    u32 uid = current_uid_gid >> 32;
    int retval = (int)PT_REGS_RC(ctx);
    // 过滤
#ifndef KERNEL_LESS_5_2
    // if target_ppid is 0 then we target all pids
    if (target_pid != 0 && target_pid != pid) {
        return 0;
    }
    if (target_uid != 0 && target_uid != uid) {
        return 0;
    }
#endif
    // 从 events_t 这个 bpf map 中获取
    struct event *event_p = bpf_map_lookup_elem(&events_t, &pid);
    // 二次判断
#ifndef KERNEL_LESS_5_2
    // if target_errno is 128 then we target all
    if (target_errno != BASH_ERRNO_DEFAULT && target_errno != retval) {
        if (event_p) bpf_map_delete_elem(&events_t, &pid);
        return 0;
    }
#endif
    // 填充 retval，将 event_p 传输至 events，在用户态接受处理
    if (event_p) {
        event_p->retval = retval;
        bpf_map_update_elem(&events_t, &pid, event_p, BPF_ANY);
        bpf_perf_event_output(ctx, &events, BPF_F_CURRENT_CPU, event_p,
                              sizeof(struct event));
    }
    return 0;
}
```
