# napcat-plugin-music-share

一个给 NapCat 用的点歌和歌词查询插件。它适合那种“我只想在群里发一句命令，把歌卡片或者歌词贴出来”的场景，不需要你自己再准备 API Key。

## 这份 README 默认把你当作

- 已经装好了 NapCat，会导入插件 zip
- 想在群里快速点歌、查歌词
- 不想研究源码，也不想额外配置第三方服务

## 这个插件适合谁

适合：

- 想在群里快速分享一首网易云歌曲
- 想随手查某首歌的歌词
- 想装完就用，不折腾额外依赖

不太适合：

- 想要本地播放器控制的人
- 想做复杂歌单管理的人

## 装之前要准备什么

基本不需要额外准备。

你只需要决定：

- 要不要保留默认命令前缀 `球鳖`

## 安装

### 1. 下载插件

从 [Releases](https://github.com/sanxi33/napcat-plugin-music-share/releases) 下载：

- `napcat-plugin-music-share.zip`

### 2. 导入 NapCat

在 NapCat 插件管理里导入 zip，并启用插件。

### 3. 先用默认配置

默认配置如下：

```json
{
  "enabled": true,
  "commandPrefix": "球鳖",
  "requestTimeoutMs": 8000
}
```

大多数人只会改：

- `commandPrefix`
- `requestTimeoutMs`

## 怎么用

点歌示例：

```text
球鳖 点歌 稻香
球鳖 来一首 晴天
球鳖 播放 夜曲
```

查歌词示例：

```text
球鳖 查看歌词 七里香
球鳖 歌词 晴天
球鳖 查歌词 稻香
```

如果你把前缀清空，也可以直接发送命令本体。

## 第一次怎么确认自己装好了

建议先发这两条：

```text
球鳖 点歌 稻香
球鳖 查看歌词 晴天
```

如果能返回音乐卡片或歌词文本，就说明插件已经能用了。

## 一键跳到 NapCat WebUI 安装页

如果你的 NapCat 版本是 `4.15.19` 或更高，可以直接点下面按钮跳到插件安装界面：

<a href="https://napneko.github.io/napcat-plugin-index?pluginId=napcat-plugin-music-share" target="_blank">
  <img src="https://github.com/NapNeko/napcat-plugin-index/blob/pages/button.png?raw=true" alt="在 NapCat WebUI 中打开" width="170">
</a>

## 已知限制

- 插件依赖公开接口，上游调整时可能需要更新
- 音乐卡片的显示效果取决于你当前的 QQ 客户端和适配器能力
- 这个插件负责“发卡片/发歌词”，不是本地播放器

## License

MIT
