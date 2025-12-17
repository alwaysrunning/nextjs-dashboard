# CMS 页面 SSG 实现与测试指南（基于 `/cms/[slug]` 当前代码）

## 实现要点

- **生成静态路径**：`generateStaticParams` 调用 `getAllSlugs`，从 `https://pokeapi.co/api/v2/type` 获取所有类型 ID，构建时预生成静态页面。
- **数据获取**：`getPokemonData(slug)` 调用 `https://pokeapi.co/api/v2/type/${slug}`，返回该类型下的全部宝可梦列表。
- **渲染内容**：页面渲染一个 6 列网格，展示该类型下所有宝可梦名称。
- **缓存/ISR**：`cache: 'force-cache'` + `revalidate: 3600`，默认每小时后台再生一次；`dynamicParams: true` 允许访问未预生成的 slug 时动态生成。

## 本地测试步骤

### 1) 开发模式（功能验证）
```bash
npm run dev
# 或 yarn dev / pnpm dev
```
访问示例（类型 ID）：  
- http://localhost:3000/cms/1  
- http://localhost:3000/cms/2  
- http://localhost:3000/cms/3  
开发模式不会真正静态生成，但可验证页面功能与布局。

### 2) 生产构建（真实 SSG）
```bash
npm run build
npm run start
# 或使用对应的 yarn/pnpm 命令
```
构建日志会显示静态页面生成进度，例如：
```
✓ Generating static pages (X/X)
  ○ /cms/[slug] (Y pages)
```

### 3) 验证静态产物
```bash
ls -la .next/server/app/cms/
cat .next/BUILD_ID
```
确认 `/cms/[slug]` 下已生成静态文件。

### 4) 测试 ISR
1. `npm run build && npm run start`
2. 访问某个类型页（如 `/cms/1`）
3. 将 `revalidate` 临时改为 60 秒（便于测试），等待时间后再次访问，后台会再生页面。

### 5) cURL 快速验证
```bash
curl -I http://localhost:3000/cms/1
```
静态页应快速返回；如是动态生成，首跳会稍慢。

## 验证清单
- 构建日志包含 `/cms/[slug]` 的静态页面生成记录
- 生产模式下页面首屏返回快，查看页面源码能看到完整 HTML
- Network 面板中 HTML 响应无需等待额外 API 请求
- 访问不存在的 slug，返回 404

## 调试技巧
- 查看构建输出：
```bash
npm run build 2>&1 | grep -i "cms\\|static"
```
- 调整 `revalidate`：  
  - `0` 完全静态不再生  
  - `60` 便于本地测试 ISR  
  - `false` 关闭 ISR
- 动态参数行为：`dynamicParams: true` 允许未预生成的 slug 动态生成；改为 `false` 时直接 404。

## 常见问题
- 开发模式看不到 SSG：正常，需 `npm run build && npm run start`。
- 预生成数量不够：`getAllSlugs` 改为带 `limit` 的接口或自行过滤。
- API 波动：`getAllSlugs` 已做错误捕获，失败时返回空数组避免构建崩溃。

## 相关文档
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Static Generation](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#static-generation)
- [Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#incremental-static-regeneration)