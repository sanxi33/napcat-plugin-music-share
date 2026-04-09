# Music Share Open Source Checklist

这个清单按“我可以直接照着做”的方式写，后续整理其他 NapCat 插件时也可以复用。

## 1. 代码与数据边界

- 只复制插件源码和必要资源，不复制运行目录
- 不提交 `config/`、`data/`、`logs/`、缓存、状态文件
- 不提交任何真实 token、cookie、绝对路径、群号、QQ 号、私聊或群聊日志

## 2. 包结构

- `package.json` 中 `name` 使用 `napcat-plugin-*`
- 补齐 `description`、`author`、`license`
- 补齐 `napcat.tags`、`napcat.minVersion`
- 发布包内至少包含 `index.mjs` 和 `package.json`

## 3. 配置

- 提供 `config.example.json`
- 默认值不能依赖个人机器路径
- 默认值不能依赖私有服务账号
- 配置项说明写进 README

## 4. 文档

- README 说明插件用途
- README 给出命令示例
- README 写清配置项、安装方式、已知限制
- 如需官方索引，README 中最好提供 Release 下载入口说明

## 5. GitHub 发布

- 创建独立仓库
- 补上仓库主页后，把 `package.json` 中的 `napcat.homepage` 填成仓库地址
- 创建 tag 或手动触发 Release 工作流
- 检查生成的 zip 只包含插件需要的文件

## 6. NapCat 官方索引前检查

- Release 资产链接可公开访问
- zip 内文件路径正确，不要多包一层运行目录
- 插件名、描述、作者、版本号和 README 保持一致
- 没有生产配置、日志、测试数据混入 release
