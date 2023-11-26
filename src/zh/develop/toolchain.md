---
footer: false
---

# 工具链

## 工具及对应版本

|  名称   |   版本    |
| :-----: |:-------:|
|  llvm   |  >= 9   |
| golang  | >= 1.21 |
| bpftool |    -    |

## 开发环境初始化

### UBNUTU 20.04或更新版本：

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/gojue/ecapture/master/builder/init_env.sh)"
```

### 其他Linux发行版
参考`https://github.com/gojue/ecapture/master/builder/init_env.sh` 脚本内容，自行安装。