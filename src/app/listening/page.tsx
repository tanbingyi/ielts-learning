export default function ListeningPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-400 mb-2">听力练习</h1>
        <p className="text-gray-300 mb-4">即将推出</p>
        <p className="text-gray-300 text-sm max-w-md mx-auto">
          雅思听力模块正在开发中，将包含剑桥真题听力材料、逐句精听练习和模拟测试功能
        </p>
      </div>
    </div>
  );
}
