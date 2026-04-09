# napcat-plugin-music-share

一个轻量的 NapCat 原生插件，提供网易云音乐点歌和歌词查询能力。

## 功能

- `点歌 关键词`：返回网易云音乐分享卡片
- `查看歌词 关键词`：返回歌曲歌词
- 支持配置命令前缀，留空后也能直接触发
- 超时、无结果、歌词缺失时会给出明确提示

## 使用示例

```text
球鳖 点歌 稻香
球鳖 查看歌词 晴天
点歌 夜曲
歌词 七里香
```

## 配置项

插件支持以下配置：

```json
{
  "enabled": true,
  "commandPrefix": "球鳖",
  "requestTimeoutMs": 8000
}
```

- `enabled`：是否启用插件
- `commandPrefix`：命令前缀，留空表示不需要前缀
- `requestTimeoutMs`：请求超时时间，范围 `1000-30000`

## 安装

1. 下载当前仓库 [Releases](https://github.com/sanxi33/napcat-plugin-music-share/releases) 中的 `napcat-plugin-music-share.zip`
2. 在 NapCat 插件管理中导入压缩包
3. 启用插件并按需修改配置

## 开发

这个插件没有构建步骤，源码文件就是发布产物：

```bash
git clone https://github.com/sanxi33/napcat-plugin-music-share.git
cd napcat-plugin-music-share
```

发布时需要打包以下文件：

- `index.mjs`
- `package.json`

## 注意事项

- 依赖网易云音乐公开接口，若上游接口调整，插件可能需要更新
- 某些客户端不支持音乐卡片时，NapCat 侧的兼容效果取决于适配器能力

## 开源检查清单

仓库内置了 [OPEN_SOURCE_CHECKLIST.md](./OPEN_SOURCE_CHECKLIST.md)，后续整理其他插件时可以直接复用。

## License

MIT
