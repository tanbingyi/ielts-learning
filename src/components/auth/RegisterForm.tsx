"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import Spinner from "@/components/ui/Spinner";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [codeHint, setCodeHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const { setUser } = useAuth();

  const sendCode = async () => {
    if (!email || countdown > 0) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("请输入正确的邮箱地址");
      return;
    }

    setError("");
    setCodeHint("");
    setSendingCode(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "REGISTER" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "发送失败");
        return;
      }

      if (data.code) {
        setCodeHint(data.code);
      }

      // Start 60s countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError("网络错误，请稍后再试");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "注册失败");
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
          用户名
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
          placeholder="2-20位，中英文或数字"
          required
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          邮箱
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
          placeholder="请输入QQ邮箱"
          required
          autoComplete="email"
        />
      </div>

      {codeHint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm">
          <p className="text-yellow-700 mb-1">⚠️ 邮件发送失败，验证码如下：</p>
          <p className="text-2xl font-bold text-yellow-800 tracking-widest text-center">{codeHint}</p>
          <p className="text-yellow-600 text-xs mt-1">10分钟内有效</p>
        </div>
      )}

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1.5">
          验证码
        </label>
        <div className="flex gap-2">
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
            placeholder="6位数字验证码"
            required
            maxLength={6}
            inputMode="numeric"
          />
          <button
            type="button"
            onClick={sendCode}
            disabled={sendingCode || countdown > 0}
            className="w-32 text-sm text-mint-700 border border-mint-300 rounded-lg hover:bg-mint-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {sendingCode ? "发送中..." : countdown > 0 ? `${countdown}秒后重发` : "发送验证码"}
          </button>
        </div>
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
          placeholder="至少6位密码"
          required
          autoComplete="new-password"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
          确认密码
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition"
          placeholder="再次输入密码"
          required
          autoComplete="new-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-mint-500 hover:bg-mint-600 text-white font-medium rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {loading && <Spinner className="border-white border-r-transparent" />}
        注册
      </button>

      <p className="text-center text-sm text-gray-500">
        已有账号？
        <Link href="/login" className="text-mint-700 hover:text-mint-800 font-medium ml-1">
          立即登录
        </Link>
      </p>
    </form>
  );
}
