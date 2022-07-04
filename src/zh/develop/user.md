---
footer: false
---

# 用户空间代码

> 用户空间代码基于 `ehids/ebpfmanager` 用于 probe 管理，`cilium/ebpf` 做 `bpf map` 对接管理

## 自定义开发

> 用户在开发时需要自行实现 `config_*.go` 以及 `event_*.go` 两个文件，同时需要在 `cli/` 目录下完成对应的命令行操作使用

### config

> 在 config 文件中，需要定义文件传输类型，同样我们以 `config_bash.go` 作为样例。在改文件中需要定义 `Config` 结构体，以及对应的 `New` 函数和 `Check()` 函数

```go
package user
import (
	"errors"
	"os"
	"strings"
)
// Config 函数，继承 eConfig
type BashConfig struct {
	eConfig
	Bashpath string `json:"bashpath"` //bash的文件路径
	Readline string `json:"readline"`
	ErrNo	 int
	elfType  uint8  //
}
func NewBashConfig() *BashConfig {
	config := &BashConfig{}
	return config
}
// 统一实现 Check
func (this *BashConfig) Check() error {
	// 如果readline 配置，且存在，则直接返回。
	if this.Readline != "" || len(strings.TrimSpace(this.Readline)) > 0 {
		_, e := os.Stat(this.Readline)
		if e != nil {
			return e
		}
		this.elfType = ELF_TYPE_SO
		return nil
	}
	//如果配置 bash的地址，且存在，则直接返回
	if this.Bashpath != "" || len(strings.TrimSpace(this.Bashpath)) > 0 {
		_, e := os.Stat(this.Bashpath)
		if e != nil {
			return e
		}
		this.elfType = ELF_TYPE_BIN
		return nil
	}
	//如果没配置，则自动查找。
	bash, b := os.LookupEnv("SHELL")
	if b {
		soPath, e := getDynPathByElf(bash, "libreadline.so")
		if e != nil {
			//this.logger.Printf("get bash:%s dynamic library error:%v.\n", bash, e)
			this.Bashpath = bash
			this.elfType = ELF_TYPE_BIN
		} else {
			this.Bashpath = soPath
			this.elfType = ELF_TYPE_SO
		}
	} else {
		return errors.New("cant found $SHELL path.")
	}
	return nil
}
```

### event

> event 文件主要包含 bpf 数据解析和定义，对应的 struct 需要实现 IEventStruct，如下所示

```go
type IEventStruct interface {
	Decode(payload []byte) (err error)
	String() string
	StringHex() string
	Clone() IEventStruct
	Module() IModule
	SetModule(IModule)
	EventType() EVENT_TYPE
}
```

> 以 `event_bash.go` 为例

```go
// 定义数据，与内核态中 events 结构体对应
type bashEvent struct {
	module     IModule
	event_type EVENT_TYPE
	Pid        uint32
	Uid        uint32
	Line       [MAX_DATA_SIZE_BASH]uint8
	Retval     uint32
	Comm       [16]byte
}
// 解析函数，读取 []byte 转换至结构体中对应的数值
func (this *bashEvent) Decode(payload []byte) (err error) {
	buf := bytes.NewBuffer(payload)
	if err = binary.Read(buf, binary.LittleEndian, &this.Pid); err != nil {
		return
	}
	if err = binary.Read(buf, binary.LittleEndian, &this.Uid); err != nil {
		return
	}
	if err = binary.Read(buf, binary.LittleEndian, &this.Line); err != nil {
		return
	}
	if err = binary.Read(buf, binary.LittleEndian, &this.Retval); err != nil {
		return
	}
	if err = binary.Read(buf, binary.LittleEndian, &this.Comm); err != nil {
		return
	}
	return nil
}
// String 相关函数
func (this *bashEvent) String() string {
	s := fmt.Sprintf(fmt.Sprintf("PID:%d, UID:%d, \tComm:%s, \tRetvalue:%d, \tLine:\n%s", this.Pid, this.Uid, this.Comm, this.Retval, unix.ByteSliceToString((this.Line[:]))))
	return s
}
func (this *bashEvent) StringHex() string {
	s := fmt.Sprintf(fmt.Sprintf("PID:%d, UID:%d, \tComm:%s, \tRetvalue:%d, \tLine:\n%s,", this.Pid, this.Uid, this.Comm, this.Retval, dumpByteSlice([]byte(unix.ByteSliceToString((this.Line[:]))), "")))
	return s
}
// module get/set 函数
func (this *bashEvent) SetModule(module IModule) {
	this.module = module
}
func (this *bashEvent) Module() IModule {
	return this.module
}
// 复制当前事件
func (this *bashEvent) Clone() IEventStruct {
	event := new(bashEvent)
	event.module = this.module
	event.event_type = EVENT_TYPE_OUTPUT
	return event
}
// 返回事件类型
func (this *bashEvent) EventType() EVENT_TYPE {
	return this.event_type
}
```
