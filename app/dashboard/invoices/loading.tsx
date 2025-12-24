// Loading animation - 闪烁效果
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export default function Loading() {
  return (
    <div className="flex min-h-[600px] flex-col gap-6 p-4">
      {/* 标题骨架 */}
      <div className={`${shimmer} relative h-8 w-48 overflow-hidden rounded-md bg-gray-200`} />
      
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 左侧 Canvas 区域骨架 */}
        <div className={`${shimmer} relative flex-1 overflow-hidden rounded-xl bg-gray-100 p-4`}>
          <div className="flex h-[500px] items-center justify-center rounded-lg bg-gray-200">
            {/* 图片占位图标 */}
            <svg 
              className="h-24 w-24 text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </div>

        {/* 右侧操作面板骨架 */}
        <div className="flex w-full flex-col gap-4 lg:w-64">
          {/* 按钮组骨架 */}
          <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-4`}>
            <div className="mb-3 h-5 w-20 rounded bg-gray-200" />
            <div className="flex flex-wrap gap-2">
              <div className="h-10 w-24 rounded-lg bg-gray-200" />
              <div className="h-10 w-24 rounded-lg bg-gray-200" />
              <div className="h-10 w-24 rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* 旋转控制骨架 */}
          <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-4`}>
            <div className="mb-3 h-5 w-16 rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div className="h-10 flex-1 rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* 裁剪操作骨架 */}
          <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-4`}>
            <div className="mb-3 h-5 w-16 rounded bg-gray-200" />
            <div className="flex flex-col gap-2">
              <div className="h-10 w-full rounded-lg bg-gray-200" />
              <div className="h-10 w-full rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* 预览区域骨架 */}
          <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-4`}>
            <div className="mb-3 h-5 w-16 rounded bg-gray-200" />
            <div className="h-32 w-full rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      {/* 底部提示文字骨架 */}
      <div className="flex items-center justify-center gap-2">
        {/* 加载动画圆圈 */}
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        <span className="text-sm text-gray-500">Loading image editor...</span>
      </div>
    </div>
  );
}

