import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          IELTS 学习助手
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto mb-8">
          专注于雅思考试的在线学习工具，从阅读开始，逐步解锁听力与写作模块
        </p>
        <Link
          href="/reading"
          className="inline-block bg-mint-500 hover:bg-mint-600 text-white font-medium rounded-lg px-8 py-3 text-base transition-colors no-underline"
        >
          开始学习
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
            </svg>
          }
          title="阅读练习"
          description="雅思真题文章，点击单词查释义，自动记录生词"
          href="/reading"
          available
        />
        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
          title="单词本"
          description="翻卡复习生词，正反两面记忆"
          href="/vocabulary"
          available
        />
        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          }
          title="听力练习"
          description="剑桥真题听力，逐句精听，模拟测试"
          disabled
        />
        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          }
          title="写作练习"
          description="Task 1 + Task 2，模考评分，范文参考"
          disabled
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  available,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  available?: boolean;
  disabled?: boolean;
}) {
  const cardContent = (
    <div
      className={`rounded-xl border p-6 h-full ${
        disabled
          ? "border-gray-100 bg-gray-50/50 cursor-not-allowed opacity-50"
          : "border-mint-200 bg-white hover:shadow-md hover:border-mint-400 cursor-pointer transition-all"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
          disabled ? "bg-gray-100 text-gray-300" : "bg-mint-50 text-mint-600"
        }`}
      >
        {icon}
      </div>
      <h3 className={`font-semibold mb-1.5 ${disabled ? "text-gray-400" : "text-gray-800"}`}>
        {title}
        {disabled && (
          <span className="ml-2 text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
            即将推出
          </span>
        )}
      </h3>
      <p className={`text-sm ${disabled ? "text-gray-300" : "text-gray-500"}`}>
        {description}
      </p>
    </div>
  );

  if (disabled || !href) return cardContent;
  return (
    <Link href={href} className="no-underline">
      {cardContent}
    </Link>
  );
}
