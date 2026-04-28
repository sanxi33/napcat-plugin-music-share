# napcat-plugin-music-share

在 QQ 群里点歌、查歌词，用的网易云音乐数据。不用申请 API Key，装上就能用。

## 下载安装

去 [Releases](https://github.com/sanxi33/napcat-plugin-music-share/releases) 下载最新的 `napcat-plugin-music-share.zip`，在 NapCat 插件管理里导入并启用就行。

NapCat 版本 >= `4.15.19` 的，点这个按钮直接跳转安装页：

<a href="https://napneko.github.io/napcat-plugin-index?pluginId=napcat-plugin-music-share" target="_blank">
  <img src="https://github.com/NapNeko/napcat-plugin-index/blob/pages/button.png?raw=true" alt="在 NapCat WebUI 中打开" width="170">
</a>

## 配置

装上就能用，默认配置基本不用改：

```json
{
  "enabled": true,
  "commandPrefix": "/",
  "requestTimeoutMs": 8000
}
```

如果觉得 `/` 前缀不顺眼，可以把 `commandPrefix` 改成别的，或者设成空字符串——这样直接输命令就行。

## 命令

点歌：

```
/点歌 稻香
/来一首 晴天
/播放 夜曲
```

查歌词：

```
/查看歌词 七里香
/歌词 晴天
/查歌词 稻香
```

命令前缀取决于你配置里 `commandPrefix` 设的值。装好以后直接发 `/点歌 稻香` 试试，能返回音乐卡片就算成了。

## 注意

- 走的公开第三方接口，上游调整了插件得跟着更新
- 音乐卡片渲染效果取决于 QQ 客户端和适配器
- 只做音乐信息分享和歌词查询，没有本地播放功能

## License

MIT
