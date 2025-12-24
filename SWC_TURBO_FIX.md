# SWC 和 Turbo 错误修复指南

## 错误说明

```
⚠ Attempted to load @next/swc-darwin-x64, but it was not installed
[Error: `turbo.createProject` is not supported by the wasm bindings.]
```

## 问题原因

1. **SWC 二进制文件缺失**：`@next/swc-darwin-x64` 是 macOS 平台的 SWC 编译器二进制文件，可能未正确安装
2. **Turbo 模式问题**：`--turbo` 标志需要正确的 Turbo 支持，但当前环境可能不支持

## 解决方案

### 方案 1: 重新安装依赖（推荐）

在终端中执行以下命令：

```bash
# 1. 清理缓存和构建文件
rm -rf node_modules .next package-lock.json

# 2. 重新安装依赖
npm install

# 3. 如果使用 yarn
# rm -rf node_modules .next yarn.lock
# yarn install

# 4. 如果使用 pnpm
# rm -rf node_modules .next pnpm-lock.yaml
# pnpm install
```

### 方案 2: 手动安装 SWC 包

```bash
# 对于 macOS Intel (x64)
npm install @next/swc-darwin-x64 --save-optional

# 对于 macOS Apple Silicon (ARM64)
npm install @next/swc-darwin-arm64 --save-optional

# 或者让 npm 自动检测平台
npm install @next/swc-darwin-x64 @next/swc-darwin-arm64 --save-optional
```

### 方案 3: 禁用 Turbo 模式（临时解决）

我已经修改了 `package.json`，将默认的 `dev` 脚本移除了 `--turbo` 标志。

**修改前：**
```json
"dev": "next dev --turbo"
```

**修改后：**
```json
"dev": "next dev",
"dev:turbo": "next dev --turbo"
```

现在你可以：
- 使用 `npm run dev` 运行（不使用 Turbo，更稳定）
- 使用 `npm run dev:turbo` 运行（如果 Turbo 可用）

### 方案 4: 检查 Node.js 版本

确保使用兼容的 Node.js 版本：

```bash
# 检查 Node.js 版本
node --version

# Next.js 15 推荐使用 Node.js 18.17 或更高版本
# 如果版本过低，使用 nvm 切换版本：
nvm install 20
nvm use 20
```

### 方案 5: 使用 yarn 或 pnpm（如果 npm 有问题）

```bash
# 使用 yarn
yarn install
yarn dev

# 或使用 pnpm
pnpm install
pnpm dev
```

## 验证修复

修复后，运行：

```bash
npm run dev
```

如果看到以下输出，说明修复成功：
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in Xs
```

## 常见问题

### Q: 仍然看到 SWC 警告？
A: 这个警告通常不影响功能，Next.js 会回退到 WASM 模式。如果功能正常，可以忽略。

### Q: Turbo 模式无法使用？
A: Turbo 是实验性功能，如果遇到问题，使用普通的 `next dev` 即可。

### Q: 权限错误？
A: 如果遇到权限错误，尝试：
```bash
sudo npm install
# 或
sudo chown -R $(whoami) node_modules
```

## 相关链接

- [Next.js SWC 文档](https://nextjs.org/docs/architecture/nextjs-compiler)
- [Next.js Turbo 模式](https://nextjs.org/docs/app/api-reference/next-config-js/turbo)

