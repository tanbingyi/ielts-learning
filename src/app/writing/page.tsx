export default function WritingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-400 mb-2">写作练习</h1>
        <p className="text-gray-300 mb-4">即将推出</p>
        <p className="text-gray-300 text-sm max-w-md mx-auto">
          雅思写作模块正在开发中，将包含Task 1图表描述和Task 2议论文写作，支持模考评分和范文参考
        </p>
      </div>
    </div>
  );
}
