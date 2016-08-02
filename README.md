# blue-static-server
koa 静态文件服务器

## Install

```
	$ npm install -g blue-static-server
```

## Use

```
	$ cd <目标目录>
	$ bss
```

或者

```
	$ bss -r <目标目录> -a <address> -p <port> -s
```

## Options

### address

默认`0.0.0.0`

```
	$ bss -a 127.0.0.1
	或
	$ bss --addresss 127.0.0.1

```

### port

默认端口`8080`

```
	$ bss -p 9000
	或
	$ bss --port 9000
```

### root

默认`.`

```
	$ bss -r /foo/bar/test
	或
	$ bss --root /foo/bar/test
```

### deep

默认`3`

```
	$ bss -d 5
	或
	$ bss --deep 5
```

### slient

> 默认自动打开浏览器

默认`false`

```
	$ bss -s
	或
	$ bss --slient
```


## 功能
1. 当浏览器md文件时，直接在浏览器中给出预览的html格式

