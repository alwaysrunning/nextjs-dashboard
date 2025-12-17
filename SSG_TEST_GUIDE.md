# CMS 页面 SSG 实现与测试指南

## 📋 实现说明

### SSG 实现要点

1. **`generateStaticParams`** - 核心函数，用于在构建时预生成所有静态页面
   - 在构建时调用，获取所有需要生成的 slug 列表
   - 返回路径参数数组，Next.js 会为每个参数生成静态页面

2. **`generateMetadata`** - 为每个页面生成 SEO 元数据
   - 在构建时为每个 slug 生成对应的 metadata

3. **缓存策略配置**
   - `cache: 'force-cache'` - 构建时缓存数据
   - `revalidate: 3600` - ISR（增量静态再生），1小时后重新验证
   - `dynamicParams: true` - 允许访问未预生成的路径时动态生成

4. **数据获取**
   - 使用 `fetch` API 获取 Pokemon 数据
   - 配置了适当的缓存和重新验证策略

## 🧪 本地测试方法

### 方法 1: 开发模式测试（推荐用于开发）

```bash
# 启动开发服务器
npm run dev
# 或
yarn dev
```

**注意**: 开发模式下，`generateStaticParams` 会在每次请求时调用，不会真正预生成静态页面。但你可以验证功能是否正常。

访问测试页面：
- http://localhost:3000/cms/bulbasaur
- http://localhost:3000/cms/ivysaur
- http://localhost:3000/cms/venusaur
- 等等...

### 方法 2: 生产构建测试（真正的 SSG 测试）

这是测试 SSG 的**正确方法**，因为只有在生产构建时才会真正执行静态生成：

```bash
# 1. 构建生产版本
npm run build
# 或
yarn build

# 2. 启动生产服务器
npm run start
# 或
yarn start
```

**构建过程会显示**：
```
✓ Generating static pages (X/X)
  ○ /cms/[slug] (10 pages)
```

这表示成功生成了 10 个静态页面。

### 方法 3: 验证静态文件生成

构建完成后，检查 `.next` 目录：

```bash
# 查看生成的静态页面
ls -la .next/server/app/cms/

# 或者查看构建输出
cat .next/BUILD_ID
```

### 方法 4: 测试 ISR（增量静态再生）

1. 构建并启动生产服务器：
```bash
npm run build
npm run start
```

2. 访问一个页面，例如：http://localhost:3000/cms/pikachu

3. 等待 1 小时（或修改 `revalidate` 为更短时间，如 60 秒用于测试）

4. 再次访问同一页面，Next.js 会在后台重新生成页面

### 方法 5: 使用 curl 测试（验证是否为静态页面）

```bash
# 测试页面响应
curl -I http://localhost:3000/cms/bulbasaur

# 应该看到快速响应（静态页面）
# 如果是动态页面，响应会较慢
```

## 🔍 验证 SSG 是否生效

### 检查清单

1. **构建日志检查**
   - 运行 `npm run build` 时，应该看到类似输出：
     ```
     ✓ Generating static pages (X/X)
       ○ /cms/[slug] (10 pages)
     ```

2. **页面加载速度**
   - 静态页面应该几乎瞬间加载
   - 首次访问和后续访问速度应该一致

3. **网络请求检查**
   - 打开浏览器开发者工具
   - 查看 Network 标签
   - 静态页面的 HTML 应该立即返回，不需要等待 API 请求

4. **查看页面源码**
   - 右键页面 -> 查看页面源码
   - 应该看到完整的 HTML 内容（包括 Pokemon 数据）
   - 如果是动态页面，HTML 中可能只有骨架或占位符

## 🛠️ 调试技巧

### 1. 查看构建输出

```bash
npm run build 2>&1 | grep -i "cms\|static"
```

### 2. 检查控制台日志

在 `generateStaticParams` 和 `getPokemonData` 函数中添加日志：

```typescript
export async function generateStaticParams() {
  console.log('🔨 Building static pages...');
  const slugs = await getAllSlugs();
  console.log(`✅ Generated ${slugs.length} static pages`);
  return slugs.map((item) => ({ slug: item.slug }));
}
```

### 3. 验证缓存行为

修改 `revalidate` 值来测试：
- `revalidate: 0` - 完全静态，永不更新
- `revalidate: 60` - 60秒后重新验证（便于测试）
- `revalidate: false` - 禁用 ISR

### 4. 测试动态参数

访问一个未在 `generateStaticParams` 中预生成的 slug：
- 如果 `dynamicParams: true`，页面会动态生成
- 如果 `dynamicParams: false`，会显示 404

## 📝 常见问题

### Q: 开发模式下看不到 SSG 效果？
A: 正常。开发模式下 Next.js 不会预生成页面。使用 `npm run build && npm run start` 测试。

### Q: 如何增加预生成的页面数量？
A: 修改 `getAllSlugs` 函数中的 API 参数：
```typescript
const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=0`, {
  // ...
});
```

### Q: 如何完全禁用 ISR，使用纯静态生成？
A: 设置 `revalidate: false` 或移除 `revalidate` 配置。

### Q: 构建失败怎么办？
A: 检查 API 是否可访问，确保 `getAllSlugs` 有错误处理，返回空数组而不是抛出错误。

## 🎯 测试用例

### 基本功能测试
- [ ] 访问预生成的页面（如 `/cms/bulbasaur`）应该快速加载
- [ ] 页面显示正确的 Pokemon 信息
- [ ] 图片正确加载

### SSG 测试
- [ ] 构建时生成所有静态页面
- [ ] 生产模式下页面加载速度快
- [ ] 页面源码包含完整 HTML

### ISR 测试
- [ ] 设置短 revalidate 时间（如 60 秒）
- [ ] 等待 revalidate 时间后，页面会重新生成

### 错误处理测试
- [ ] 访问不存在的 slug 显示 404
- [ ] API 失败时构建不会失败（返回空数组）

## 📚 相关文档

- [Next.js Static Generation](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#static-generation)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#incremental-static-regeneration)

