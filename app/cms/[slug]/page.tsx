import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react'
import Item from './item';
// 获取所有可用的 slug 列表（用于 SSG）
async function getAllSlugs() {
  try {
    // 使用 force-cache 来启用静态生成时的缓存
    const response = await fetch(`https://pokeapi.co/api/v2/type`, {
      // 构建时使用 force-cache，运行时可以重新验证
      // cache: 'force-cache',
      // next: { 
      //   // 设置重新验证时间（ISR），单位：秒
      //   // 3600 = 1小时，设置为 0 表示禁用 ISR，完全静态
      //   revalidate: 3600,
      //   tags: ['user'],
      // }
    });
    console.log('仅构建时运行');
    if (!response.ok) {
      throw new Error('Failed to fetch pokemon list');
    }
    
    const data = await response.json();
    return data.results.map((item: { name: string; url: string }) => {
      const id = item.url.split("/").filter(Boolean).pop();
      return {
        slug: id
      }
    });
  } catch (error) {
    console.error('Error fetching slugs:', error);
    // 如果 API 失败，返回空数组，避免构建失败
    return [];
  }
}

// 生成静态路径 - 这是实现 SSG 的关键
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  
  // 返回所有需要预生成的路径参数
  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

// 获取单个 Pokemon 数据
async function getPokemonData(slug: string) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${slug}`, {
      // cache: 'force-cache',
      // next: { 
      //   revalidate: 3600, // 1小时后重新验证
      //   tags: ['user'], // 添加 tag，用于按需重新验证
      // }
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.pokemon.map((item: { pokemon: { name: string; url: string } }) => ({
      name: item.pokemon.name,
      url: item.pokemon.url,
    }));
  } catch (error) {
    console.error(`Error fetching pokemon ${slug}:`, error);
    return null;
  }
}

// 配置页面渲染方式
// 如果不设置，Next.js 会根据是否有 generateStaticParams 自动选择 SSG
// 显式设置可以更明确控制行为
export const dynamicParams = true; // 如果访问未预生成的路径，是否允许动态生成
export const revalidate = 3600; // ISR: 3600秒后重新生成页面

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params;
  const { slug } = params;
  const pokemons = await getPokemonData(slug);
  console.log('在构建时和重新验证之后再访问时运行');
  // 如果数据不存在，显示 404
  if (!pokemons) {
    notFound();
  }

  return (
    <div style={{ padding: '10px 40px' }}>
      <div 
        style={{ 
          width: '100%', 
          fontSize: '16px', 
          textAlign: 'center', 
          padding: '10px 0' 
        }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Item pokemons={pokemons}></Item>
        </Suspense>
        {/* <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "50px",
          }}
        >
          {pokemons.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                border: "1px solid #e5e7eb",
                padding: "10px",
                position: "relative",
              }}
            >
              <div>{item.name}</div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}