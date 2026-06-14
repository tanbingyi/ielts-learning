import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">创建账号</h1>
          <p className="text-gray-500 mt-1 text-sm">开始你的雅思学习之旅</p>
        </div>
        <div className="bg-white border border-mint-200 rounded-2xl p-6 shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
