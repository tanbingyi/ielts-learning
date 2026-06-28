"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import Spinner from "@/components/ui/Spinner";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登录失败");
        return;
      }

      setUser(data.user);
      router.push("/reading");
    } catch {
      setError("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
          用户名 / 邮箱
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
          placeholder="请输入用户名或邮箱"
          required
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          密码
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
          placeholder="请输入密码"
          required
          autoComplete="current-password"
        />
        <div className="mt-1 text-right">
          <Link href="/forgot-password" className="text-xs text-mint-600 hover:text-mint-700">
            忘记密码？
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-mint-500 hover:bg-mint-600 text-white font-medium rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {loading && <Spinner className="border-white border-r-transparent" />}
        登录
      </button>

      <p className="text-center text-sm text-gray-500">
        还没有账号？
        <Link href="/register" className="text-mint-700 hover:text-mint-800 font-medium ml-1">
          立即注册
        </Link>
      </p>
    </form>
  );
}
