import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">欢迎回来</h1>
          <p className="text-gray-500 mt-1 text-sm">登录你的 IELTS 学习账户</p>
        </div>
        <div className="bg-white border border-mint-200 rounded-2xl p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
