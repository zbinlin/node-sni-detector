# SNI detector

> 验证 SNI 服务器

**注意，该工具仅支持 Node.js v6+**


## 工作机制

根据 SNI 服务器的工作原理，分别根据多个测试域名与待测服务器建立相应的 SSL 连接。
如果 SSL 连接成功，判断证书是否有效，如果全部测试域名的证书都有效，则认为该服务器是
一个 SNI 服务器。


## 使用方法

```shell
npm install -g sni-detector

sni-detect --help
```

`-i, --in` 参数接收一个文件路径，该路径指向一个包含 IP 列表的纯文件文件。
里面的每一行都必须是一个有效的 IP 地址或一个 IP 地址范围，例如：

```
127.0.0.1
127.0.0.1/32
127.0.0.0-255
127.0.0.1-127.0.0.128
```

**（当前仅支持 IPv4 的地址）**

`-o, --out` 参数可以指定文件路径，用于保存测试通过的 SNI IP。

`-c, --continue [file]` 如果待测试 IP 过多，并且可能需要中断测试，可以先使用该
参数来保存已测试的结果，在下次测试时同样使用该参数，可以跳过已测试的 IP 地址
来加快测试速度。该参数如果未指定一个路径，默认会把结果保存到 `$PWD/scan-result.txt` 里。

`-p, --parallels [number]` 当前默认的并行扫描数为 8 个，如果想增加或者减少，可以
使用该参数。

`-t, --tests [servernames]` 本工具默认使用 `www.baidu.com` 和 `www.google.com` 来测试
被测 IP，如果需要使用其他域名来测试，可以使用该参数设置。

`--timeout` 该参数主要用于每个被测连接的超时。默认为 10s，如果希望跳过响应过慢的 IP，可以将
参数设置的小点。



## 作为 module 使用

```javascript
const detect = require("sni-detector");

/**
 * @param {string|Stream} input
 * @param {string|string[]} serverNames
 * @param {number} timeout
 * @param {number} [parallels=1]
 * @param {Function} [filter=noop] - 如果调用 filter 返回 true，将忽略该 ip
 * @return {Observable} observable-like object
 */
detect(input, serverNames, timeout, parallels, filter);
```
