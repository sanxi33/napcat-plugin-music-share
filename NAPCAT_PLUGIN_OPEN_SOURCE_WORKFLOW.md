# NapCat Plugin Open Source Workflow

这是一份已经在 `napcat-plugin-music-share` 上实际跑通的标准流程文档。

目标是把一个正在本地运行的 NapCat 插件，安全地整理成：

1. 独立 GitHub 仓库
2. 可发布的 GitHub Release
3. 可自动提交到 NapCat 官方索引仓库的插件项目

## 适用范围

适用于这类插件：

- 源码已经可运行
- 需要从现有运行目录里拆出来开源
- 希望进入 NapCat 官方索引

不适用于这类插件：

- 强依赖私有聊天日志、私有人设、固定群成员资料
- 默认配置中写死真实 token、cookie、个人机器路径且尚未抽象
- 没有明确最小可发布文件结构

## 总原则

- 永远不要直接把整套 `NapCat.Shell` 运行目录公开
- 永远在运行目录外新建独立仓库目录
- 优先复制源码，再做清理，不要在现网目录里删改配置
- 发布包只包含插件运行必需文件
- 所有真实配置、日志、状态文件、缓存数据都不入库

## 标准目录策略

假设现网目录是：

```text
C:\app\NapCat.Shell
```

建议把开源仓库建到：

```text
C:\app\napcat-plugin-<name>
```

例如：

```text
C:\app\napcat-plugin-music-share
```

## 标准流程

### 第 1 步：评估插件是否适合第一批开源

先判断插件属于哪一类：

- 低风险：公开接口型、少配置型、无私有数据绑定
- 中风险：含资源文件、示例配置、账号字段，但可以模板化
- 高风险：含 cookie、token、聊天日志、群号、QQ 号、绝对路径、人设文档

建议优先开源低风险插件。

### 第 2 步：只复制需要的文件

从现网目录只复制插件真正需要的内容，例如：

- `index.mjs`
- `package.json`
- 插件运行必需资源
- 可公开的 README 素材

不要复制这些目录或文件：

- `config/`
- `data/`
- `logs/`
- `cache/`
- 状态文件
- 临时下载目录
- 本机调试残留

### 第 3 步：建立最小开源仓库骨架

至少准备这些文件：

- `index.mjs`
- `package.json`
- `README.md`
- `.gitignore`
- `LICENSE`
- `config.example.json`
- `.github/workflows/release.yml`
- `.github/workflows/update-index.yml`

建议附带：

- `OPEN_SOURCE_CHECKLIST.md`
- 本文档 `NAPCAT_PLUGIN_OPEN_SOURCE_WORKFLOW.md`

### 第 4 步：清理敏感信息

重点检查：

- token
- API key
- cookie
- 个人绝对路径
- 群号
- QQ 号
- 聊天日志
- 管理员白名单
- 固定账号 handle / userId
- 私有提示词和群成员映射

处理方式：

- 真实值删除
- 改为示例值
- 改为环境变量
- 改为用户配置项
- 改为 README 说明

### 第 5 步：规范 package.json

至少保证这些字段完整：

```json
{
  "name": "napcat-plugin-xxx",
  "plugin": "xxx",
  "version": "0.1.0",
  "type": "module",
  "main": "index.mjs",
  "description": "插件描述",
  "author": "作者名",
  "license": "MIT",
  "napcat": {
    "tags": ["工具"],
    "minVersion": "4.14.0",
    "homepage": "https://github.com/<owner>/<repo>"
  }
}
```

注意：

- `name` 会被官方索引用作插件 ID
- Release 包名必须和 `name` 对齐
- `napcat.homepage` 最好直接填 GitHub 仓库地址

### 第 6 步：写 README

README 至少说明：

- 这个插件做什么
- 支持哪些命令
- 配置项是什么
- 如何安装
- Release 从哪里下载
- 已知限制和依赖风险

如果后面要进官方索引，README 最好让评审一眼看懂插件用途。

### 第 7 步：配置官方流程工作流

官方链路至少包含两条工作流：

1. `release.yml`
2. `update-index.yml`

职责分工：

- `release.yml`
  - 在 tag 发布时打包 zip
  - 创建 GitHub Release
  - 主动触发 `update-index.yml`

- `update-index.yml`
  - 读取 `package.json` 元信息
  - 拼接 Release 下载地址
  - fork `NapNeko/napcat-plugin-index`
  - 更新 `plugins.v4.json`
  - 自动创建 PR 到官方索引仓库

## 官方流程依赖

仓库必须配置：

- `INDEX_PAT`

这个 secret 用于：

- fork 官方索引仓库
- 同步 fork
- 推送修改分支
- 创建 PR

建议做法：

- 使用当前 GitHub 账号的 PAT
- 至少保证对 fork、repo 操作可用

## 第 8 步：初始化 Git 和 GitHub 仓库

标准顺序：

1. `git init`
2. 创建 GitHub 仓库
3. 把仓库地址回填到 `package.json`
4. `git add .`
5. `git commit`
6. `git push -u origin main`

如果本机没有配置 Git identity：

- 只给当前仓库配置 `user.name`
- 只给当前仓库配置 `user.email`

不要随手改全局配置，除非你明确要这么做。

## 第 9 步：发首个版本

标准做法：

1. 创建 tag，例如 `v0.1.0`
2. 推送 tag
3. 等待 `Build and Release` 工作流完成
4. 等待 `自动更新插件索引` 工作流完成

检查点：

- Release 已发布，不是 draft
- Release 资产 zip 可下载
- zip 内文件结构正确
- 官方索引 PR 已创建

## 第 10 步：验收

至少确认以下结果：

- GitHub 仓库公开可访问
- Release 页面正常
- zip 文件名正确
- `downloadUrl` 可访问
- 官方索引仓库出现 PR
- PR 标题、插件名、版本号、作者信息正确

## 实战验证记录

这份流程已经在以下项目上跑通：

- `sanxi33/napcat-plugin-music-share`

验证结果包括：

- Release 成功
- `INDEX_PAT` 已生效
- 官方索引 PR 创建成功

## 推荐执行顺序

后续处理其他插件时，建议按这个顺序推进：

1. `music-share` 这种低风险插件先做模板
2. `bilibili-live-push` 这类中低风险插件复用模板
3. `fun-pack`、`dota2-heroes` 这类需要去私有资源或密钥的第二批处理
4. `twitter-push`、`weibo-push`
5. `group-daily-report`、`qiubie-chat` 这类高风险插件最后重构

## 常见失败点

- 只做了 Release，没有补 `update-index.yml`
- 没有配置 `INDEX_PAT`
- Release zip 名称和 `package.json.name` 不一致
- `package.json.napcat.homepage` 为空
- 把现网 `config.json`、日志、状态文件一起传上去了
- 插件默认配置还写着本机绝对路径
- PR 创建成功，但 release 资产链接实际上不可下载

## 最简执行清单

1. 在运行目录外新建仓库目录
2. 只复制源码和必要资源
3. 清掉 token、cookie、日志、群号、QQ 号、绝对路径
4. 补齐 `README`、`LICENSE`、`config.example.json`
5. 补齐 `release.yml` 和 `update-index.yml`
6. 创建 GitHub 仓库
7. 配置 `INDEX_PAT`
8. 推送 `main`
9. 推送 `v0.1.x` tag
10. 检查 Release 和官方索引 PR
